import { Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configServer: ConfigService, private prisma: PrismaService) {
        super({
            // 从请求头中获取token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 加密的密钥
            secretOrKey: configServer.get('TOKEN_SECRET')
        })
    }

    async validate({ id }) {
        return this.prisma.user.findUnique({
            where: { id }
        })
    }
}