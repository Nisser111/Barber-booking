import { IsInt, Min, Max, IsString, Matches } from 'class-validator';

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateSlotDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  @Matches(TIME_REGEX, { message: 'startTime must be HH:MM' })
  startTime: string;

  @IsString()
  @Matches(TIME_REGEX, { message: 'endTime must be HH:MM' })
  endTime: string;
}
