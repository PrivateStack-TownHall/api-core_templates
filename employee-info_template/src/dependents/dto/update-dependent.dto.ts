import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateDependentDto } from './create-dependent.dto';

export class UpdateDependentDto extends PartialType(
  OmitType(CreateDependentDto, ['employeeId'] as const),
) {}
