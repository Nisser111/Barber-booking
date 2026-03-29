import { IsBoolean } from 'class-validator';

export class UpdateSlotDto {
  @IsBoolean()
  isAvailable: boolean;
}
