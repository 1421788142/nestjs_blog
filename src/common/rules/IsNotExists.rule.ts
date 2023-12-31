import { PrismaClient } from "@prisma/client";
import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

// 查询是否不存在
export const IsNotExistsRule = (
    table: string,//表名称
    vaildationOptions?: ValidationOptions //验证配置项
) => {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            name: "isNotExists",
            target: object.constructor,
            propertyName,
            options: vaildationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    // 如果没有值则直接抛出成功
                    if (!value) return true
                    const prisma = new PrismaClient()
                    const result = await prisma[table].findMany({
                        where: {
                            [propertyName]: value
                        }
                    })
                    return !Boolean(result.length)
                }
            }
        })
    }
}