import { Module } from '@nestjs/common';
import { MenuModule } from '@/modules/system/menu/menu.module';
import { GeneralParametersModule } from '@/modules/system/general-parameters/general-parameters.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';

@Module({
    imports: [
        MenuModule,
        GeneralParametersModule,
        UserModule,
        RoleModule
    ]
})
export class SystemModule { }
