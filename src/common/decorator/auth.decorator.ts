import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

export function AuthToken() {
    return applyDecorators(UseGuards(AuthGuard('jwt')))
}