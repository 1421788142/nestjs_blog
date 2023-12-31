import { MethodNotAllowedException, UseInterceptors, applyDecorators } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export const fileFilter = (type: 'image' | 'video') => {
    return (req: any, file: any, callback: (error: Error | null, acceptFile: boolean) => void) => {
        if (!file.mimetype.includes(type)) {
            callback(new MethodNotAllowedException('请上传正确的文件!'), false);
        } else {
            callback(null, true);
        }
    }
}

export function AuthUpload(field: string = 'file', options: MulterOptions = {}) {
    return applyDecorators(UseInterceptors(
        FileInterceptor(field, options)
    ))
}

export const Image = (field: string = 'file') => {
    console.log('image', field)
    return AuthUpload(field, {
        limits: { fileSize: Math.pow(1024, 2) * 10 },
        fileFilter: fileFilter('image')
    })
}