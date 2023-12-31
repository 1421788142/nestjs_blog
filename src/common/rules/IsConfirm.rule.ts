import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

// 验证两次密码是否一致
@ValidatorConstraint()
export class IsConfirmRule implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        return value === args.object[args.property]
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return '两次密码不一致'
    }
}