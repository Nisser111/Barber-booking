import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly repo: Repository<Booking>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking> {
    const booking = await this.dataSource.transaction(async (manager) => {
      // Lock: prevent concurrent bookings of the same slot+date
      const existing = await manager.query(
        `SELECT id FROM bookings
         WHERE time_slot_id = ? AND booking_date = ? AND status != 'cancelled'
         FOR UPDATE`,
        [dto.timeSlotId, dto.bookingDate],
      );

      if (existing.length > 0) {
        throw new ConflictException('Ten termin jest już zajęty');
      }

      const newBooking = manager.create(Booking, {
        serviceId: dto.serviceId,
        timeSlotId: dto.timeSlotId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        bookingDate: dto.bookingDate,
      });

      return manager.save(newBooking);
    });

    return this.findOne(booking.id);
  }

  findAll(filters: { date?: string; status?: string }): Promise<Booking[]> {
    const qb = this.repo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.service', 'service')
      .leftJoinAndSelect('b.timeSlot', 'timeSlot')
      .orderBy('b.bookingDate', 'ASC')
      .addOrderBy('timeSlot.startTime', 'ASC');

    if (filters.date) {
      qb.andWhere('b.bookingDate = :date', { date: filters.date });
    }
    if (filters.status) {
      qb.andWhere('b.status = :status', { status: filters.status });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.repo.findOne({
      where: { id },
      relations: ['service', 'timeSlot'],
    });
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    return booking;
  }

  async updateStatus(id: number, dto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.status = dto.status;
    await this.repo.save(booking);
    return booking;
  }

  async cancel(id: number): Promise<Booking> {
    const booking = await this.findOne(id);
    if (booking.status === 'cancelled') return booking;
    booking.status = 'cancelled';
    await this.repo.save(booking);
    return booking;
  }
}
