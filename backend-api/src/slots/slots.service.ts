import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TimeSlot } from './time-slot.entity';
import { SlotOverride } from './slot-override.entity';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { CreateOverrideDto } from './dto/create-override.dto';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private readonly slotRepo: Repository<TimeSlot>,
    @InjectRepository(SlotOverride)
    private readonly overrideRepo: Repository<SlotOverride>,
    private readonly dataSource: DataSource,
  ) {}

  async getAvailableForDate(date: string): Promise<(TimeSlot & { isBooked: boolean })[]> {
    const dayOfWeek = new Date(date + 'T12:00:00').getDay();

    const baseSlots = await this.slotRepo.find({
      where: { dayOfWeek, isAvailable: true },
      order: { startTime: 'ASC' },
    });

    const overrides = await this.overrideRepo.find({ where: { date } });

    const bookedRows: { time_slot_id: number }[] = await this.dataSource.query(
      `SELECT time_slot_id FROM bookings WHERE booking_date = ? AND status != 'cancelled'`,
      [date],
    );
    const bookedIds = new Set(bookedRows.map((r) => r.time_slot_id));

    const blockedTimes = new Set(
      overrides
        .filter((o) => !o.isAvailable)
        .map((o) => o.startTime),
    );

    const extraSlots: (TimeSlot & { isBooked: boolean })[] = overrides
      .filter((o) => o.isAvailable)
      .map((o) => ({
        id: 0,
        dayOfWeek,
        startTime: o.startTime,
        endTime: o.endTime,
        isAvailable: true,
        createdAt: o.createdAt,
        isBooked: false,
      }));

    const result = baseSlots
      .filter((s) => !blockedTimes.has(s.startTime))
      .map((s) => ({ ...s, isBooked: bookedIds.has(s.id) }));

    return [...result, ...extraSlots].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );
  }

  findAll(): Promise<TimeSlot[]> {
    return this.slotRepo.find({ order: { dayOfWeek: 'ASC', startTime: 'ASC' } });
  }

  create(dto: CreateSlotDto): Promise<TimeSlot> {
    const slot = this.slotRepo.create({
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });
    return this.slotRepo.save(slot);
  }

  async update(id: number, dto: UpdateSlotDto): Promise<TimeSlot> {
    const slot = await this.slotRepo.findOneBy({ id });
    if (!slot) throw new NotFoundException(`Slot ${id} not found`);
    slot.isAvailable = dto.isAvailable;
    return this.slotRepo.save(slot);
  }

  createOverride(dto: CreateOverrideDto): Promise<SlotOverride> {
    const override = this.overrideRepo.create(dto);
    return this.overrideRepo.save(override);
  }
}
