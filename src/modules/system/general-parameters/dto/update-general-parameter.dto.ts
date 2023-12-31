import { PartialType } from '@nestjs/mapped-types';
import { CreateGeneralParameterDto } from './create-general-parameter.dto';

export class UpdateGeneralParameterDto extends PartialType(CreateGeneralParameterDto) {}
