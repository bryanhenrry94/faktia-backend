import { PartialType } from '@nestjs/mapped-types';
import { CreateRecoveryPasswordDto } from './create-recovery-password.dto';

export class UpdateRecoveryPasswordDto extends PartialType(CreateRecoveryPasswordDto) {}
