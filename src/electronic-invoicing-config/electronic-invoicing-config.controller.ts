import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ElectronicInvoicingConfigService } from './electronic-invoicing-config.service';
import { CreateElectronicInvoicingConfigDto } from './dto/create-electronic-invoicing-config.dto';
import { UpdateElectronicInvoicingConfigDto } from './dto/update-electronic-invoicing-config.dto';

@Controller('electronic-invoicing-config')
export class ElectronicInvoicingConfigController {
  constructor(
    private readonly electronicInvoicingConfigService: ElectronicInvoicingConfigService,
  ) {}

  @Post()
  create(
    @Body()
    createElectronicInvoicingConfigDto: CreateElectronicInvoicingConfigDto,
    @Req() req: Request,
  ) {
    const subdomain = req['tenant-subdomain'];

    return this.electronicInvoicingConfigService.create(
      createElectronicInvoicingConfigDto,
      subdomain,
    );
  }

  @Get()
  findAll(@Req() req: Request) {
    const subdomain = req['tenant-subdomain'];

    return this.electronicInvoicingConfigService.findOneByDomain(subdomain);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.electronicInvoicingConfigService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateElectronicInvoicingConfigDto: UpdateElectronicInvoicingConfigDto,
  ) {
    return this.electronicInvoicingConfigService.update(
      id,
      updateElectronicInvoicingConfigDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.electronicInvoicingConfigService.remove(id);
  }
}
