import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { CreateOverrideDto } from './dto/create-override.dto';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get()
  findAvailable(@Query('date') date: string) {
    if (date) return this.slotsService.getAvailableForDate(date);
    return this.slotsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateSlotDto) {
    return this.slotsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSlotDto) {
    return this.slotsService.update(id, dto);
  }

  @Post('override')
  createOverride(@Body() dto: CreateOverrideDto) {
    return this.slotsService.createOverride(dto);
  }
}
