import { PrismaClient } from "@prisma/client";
import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

// 查询是否存在
export const IsExistsRule = (
    table: string,//表名称
    vaildationOptions?: ValidationOptions //验证配置项
) => {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            name: "IsExistsRule",
            target: object.constructor,
            propertyName,
            options: vaildationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    if (!value.length) return false
                    const prisma = new PrismaClient()
                    const result = await prisma[table].findMany({
                        where: {
                            [propertyName]: value
                        }
                    })
                    return Boolean(result.length)
                }
            }
        })
    }
}