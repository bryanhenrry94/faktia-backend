import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IssuancePointService } from './issuance-point.service';
import { CreateIssuancePointDto } from './dto/create-issuance-point.dto';
import { UpdateIssuancePointDto } from './dto/update-issuance-point.dto';

@Controller('issuance-point')
export class IssuancePointController {
  constructor(private readonly issuancePointService: IssuancePointService) {}

  @Post()
  create(@Body() createIssuancePointDto: CreateIssuancePointDto) {
    return this.issuancePointService.create(createIssuancePointDto);
  }

  @Get()
  findAll() {
    return this.issuancePointService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issuancePointService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIssuancePointDto: UpdateIssuancePointDto) {
    return this.issuancePointService.update(+id, updateIssuancePointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.issuancePointService.remove(+id);
  }
}
