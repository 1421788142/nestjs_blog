import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        console.log(exception)
        const ctx = host.switchToHttp()
        const result = ctx.getResponse()
        // 自定义响应
        const status = exception.getStatus && exception?.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR
        // 自定义错误信息
        let message = '系统处理错误'
        // 自定义响应
        const response = exception.getResponse && exception.getResponse() as any
        // 单文字错误信息
        if (typeof response === 'string') {
            message = response
            // 对象错误信息 例如表单
        } else if (typeof response === 'object') {
            if (typeof response.message === 'string') {
                message = response.message
            } else if (typeof response.message === 'object') {
                message = Object.entries(response.message).map(([key, value]) => `${value}`).join(' ')
            }
        }

        const msgLog = {
            code: status,
            message: '请求失败',
            data: message
        }

        Logger.error('错误信息', JSON.stringify(msgLog))
        result.status(HttpStatus.OK).json({
            code: status,
            message,
        })
    }
}