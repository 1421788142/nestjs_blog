import { Module } from '@nestjs/common';
import { GeneralParametersService } from './general-parameters.service';
import { GeneralParametersController } from './general-parameters.controller';

@Module({
  controllers: [GeneralParametersController],
  providers: [GeneralParametersService],
})
export class GeneralParametersModule {}
