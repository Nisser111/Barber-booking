import { IsDateString, IsInt, IsString, Matches, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @Min(1)
  serviceId: number;

  @IsInt()
  @Min(1)
  timeSlotId: number;

  @IsDateString()
  bookingDate: string;

  @IsString()
  customerName: string;

  @IsString()
  @Matches(/^\+?[\d\s\-]{7,15}$/, { message: 'Invalid phone number' })
  customerPhone: string;
}
