import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Service } from '../services/service.entity';
import { TimeSlot } from '../slots/time-slot.entity';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'service_id' })
  serviceId: number;

  @Column({ name: 'time_slot_id' })
  timeSlotId: number;

  @Column({ name: 'customer_name', length: 100 })
  customerName: string;

  @Column({ name: 'customer_phone', length: 20 })
  customerPhone: string;

  @Column({ name: 'booking_date', type: 'date' })
  bookingDate: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  })
  status: BookingStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Service, { eager: true })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => TimeSlot, { eager: true })
  @JoinColumn({ name: 'time_slot_id' })
  timeSlot: TimeSlot;
}
