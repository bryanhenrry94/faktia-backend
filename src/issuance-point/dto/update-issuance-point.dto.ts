import { PartialType } from '@nestjs/mapped-types';
import { CreateIssuancePointDto } from './create-issuance-point.dto';

export class UpdateIssuancePointDto extends PartialType(CreateIssuancePointDto) {}
