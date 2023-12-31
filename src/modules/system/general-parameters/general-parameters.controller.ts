import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GeneralParametersService } from './general-parameters.service';
import { CreateGeneralParameterDto } from './dto/create-general-parameter.dto';
import { UpdateGeneralParameterDto } from './dto/update-general-parameter.dto';

@Controller('parameters')
export class GeneralParametersController {
  constructor(private readonly generalParametersService: GeneralParametersService) { }

  @Post()
  create(@Body() createGeneralParameterDto: CreateGeneralParameterDto) {
    return this.generalParametersService.create(createGeneralParameterDto);
  }

  @Get('/listByPage')
  findAll(@Query() query: any) {
    return this.generalParametersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generalParametersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeneralParameterDto: UpdateGeneralParameterDto) {
    return this.generalParametersService.update(+id, updateGeneralParameterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generalParametersService.remove(+id);
  }
}
