// 成功返回
export interface Response {
    code?: number
    message?: string
}

export interface ResponseSuccess<T> extends Response {
    data: T
}

// 失败返回
export interface ResponseError extends Response { }

// 分页返回
export interface ResponsePaging<T> extends Response {
    data: {
        dataList: T[]
        message: string
    }
}
