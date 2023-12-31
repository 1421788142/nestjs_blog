import { OmitType } from '@nestjs/mapped-types';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends OmitType(CreateMenuDto, ['path']) {
    id: number
}
