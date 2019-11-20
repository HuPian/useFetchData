"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var url = require("url");
var default_props_1 = require("./default-props");
exports.setGlobalOptionConfig = function (config) {
    Object.assign(default_props_1.DEFAULT_OPTION_CONFIG, config);
};
exports.fetchData = function (_a, optConfig) {
    var api = _a.api, reqConfig = __rest(_a, ["api"]);
    // 重组参数
    var reqUrl = api;
    var config = __assign(__assign({}, default_props_1.DEFAULT_REQ_CONFIG), reqConfig);
    config.method = config.method.toUpperCase();
    // for get method, 拼接body参数到url
    if (config.method === "GET" && config.body) {
        var apiObj = url.parse(api, true);
        apiObj.query = __assign(__assign({}, apiObj.query), config.body);
        delete config.body;
        reqUrl = url.format(apiObj);
    }
    // for post method，统一处理body格式
    if (config.method === "POST" || config.method === "PUT" && config.headers["Content-Type"] === 'application/json' && config.body) {
        config.body = JSON.stringify(config.body);
    }
    // 发起请求
    return fetch(api, config).then(function (res) {
        if (res.ok) {
            return res.json();
        }
        else {
            throw new Error(optConfig.networkErrorMsg);
        }
    }).catch(function (err) {
        console.error(err);
        throw new Error(optConfig.networkErrorMsg);
    });
};
function useFetchData(req, handler, dependency, optConfig) {
    if (dependency === void 0) { dependency = []; }
    if (optConfig === void 0) { optConfig = {}; }
    react_1.useEffect(function () {
        var optionConfig = __assign(__assign({}, default_props_1.DEFAULT_OPTION_CONFIG), optConfig);
        // loading start
        if (optionConfig.showLoading) {
            optionConfig.loadingStartCb && optionConfig.loadingStartCb();
        }
        var promiseList = [exports.fetchData(req, optionConfig)];
        // 超时处理
        var timer;
        if (optionConfig.timeout) {
            var timeoutPromise = new Promise(function (resolve) {
                timer = setTimeout(function () {
                    resolve(new Response(null, { status: 504 }));
                }, optionConfig.timeoutLimit);
            });
            promiseList.push(timeoutPromise);
        }
        Promise.race(promiseList).then(function (res) {
            // stop loading
            if (optionConfig.showLoading) {
                optionConfig.loadingEndCb && optionConfig.loadingEndCb();
            }
            // call timeout callback
            if (res.status === 504) {
                optionConfig.timeoutCb && optionConfig.timeoutCb(optionConfig.timeoutErrorMsg);
            }
            else {
                if (res[optionConfig.statusField] === optionConfig.statusOkValue) {
                    optionConfig.showSuccessMsg && optionConfig.successCb && optionConfig.successCb(optionConfig.successMsg);
                    handler(res.data);
                }
                else {
                    console.error(res[optionConfig.messageField]);
                    throw new Error(res[optionConfig.messageField]);
                }
                timer && clearTimeout(timer);
            }
        }).catch(function (err) {
            if (optionConfig.toastError) {
                optionConfig.errorCb && optionConfig.errorCb(err && err.message);
            }
        });
    }, dependency); // 参数变化时，再次发起请求
}
exports.default = useFetchData;
