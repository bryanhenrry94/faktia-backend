import { PartialType } from '@nestjs/mapped-types';
import { CreateElectronicInvoicingConfigDto } from './create-electronic-invoicing-config.dto';

export class UpdateElectronicInvoicingConfigDto extends PartialType(CreateElectronicInvoicingConfigDto) {}
