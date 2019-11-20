"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_REQ_CONFIG = {
    api: "",
    method: "GET",
    headers: {
        'Content-Type': 'application/json'
    }
};
exports.DEFAULT_OPTION_CONFIG = {
    // loading
    showLoading: true,
    loadingStartCb: null,
    loadingEndCb: null,
    // 超时处理
    timeout: true,
    timeoutLimit: 10000,
    timeoutCb: null,
    timeoutErrorMsg: "请求超时，请稍后再试",
    // 错误处理
    toastError: true,
    errorCb: null,
    networkErrorMsg: "网络请求错误",
    // 请求返回解析
    statusField: "success",
    statusOkValue: true,
    messageField: "message",
    // 请求成功处理
    showSuccessMsg: false,
    successMsg: "请求成功",
    successCb: null
};
