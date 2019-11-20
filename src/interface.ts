export type LoadingCallback = () => void;
export type MsgCallback = (err:string) => void;

export interface OptionConfig{
    // loading
    showLoading?: boolean,
    loadingStartCb?: LoadingCallback,
    loadingEndCb?: LoadingCallback,

    // 超时处理
    timeout?: boolean,
    timeoutLimit?: number,
    timeoutCb?:MsgCallback,
    timeoutErrorMsg?:string,

    // 错误处理
    toastError?:boolean,
    errorCb?:MsgCallback,
    networkErrorMsg?:string,

    // 请求返回解析
    statusField?:string,
    statusOkValue?: any,
    messageField?:string,

    // 请求成功处理
    showSuccessMsg?:boolean,
    successMsg?:string,
    successCb?:MsgCallback
}

export interface ReqConfig{
    api: string,
    method?: string,
    body?: any,
    headers?: any
}

