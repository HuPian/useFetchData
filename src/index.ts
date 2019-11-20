import {useEffect} from 'react';
import url = require('url') ;
import {ReqConfig,OptionConfig} from './interface'
import {DEFAULT_OPTION_CONFIG,DEFAULT_REQ_CONFIG} from './default-props'


export const setGlobalOptionConfig = (config:OptionConfig) =>{
  Object.assign(DEFAULT_OPTION_CONFIG,config);
};

export const fetchData = ({api, ...reqConfig}:ReqConfig, optConfig:OptionConfig) =>{
    // 重组参数
    let reqUrl = api;
    const config = {...DEFAULT_REQ_CONFIG, ...reqConfig };
    config.method = config.method.toUpperCase();

    // for get method, 拼接body参数到url
    if(config.method === "GET" && config.body){
    const apiObj = url.parse(api,true);
    apiObj.query =  {...apiObj.query, ...config.body};
    delete config.body;
    reqUrl = url.format(apiObj);
    }

    // for post method，统一处理body格式
    if(config.method === "POST" || config.method === "PUT" && config.headers["Content-Type"] === 'application/json' && config.body ){
        config.body = JSON.stringify(config.body);
    }

    // 发起请求
    return fetch(api, config).then(res=>{
        if(res.ok){
            return res.json();
        }else{
            throw new Error(optConfig.networkErrorMsg);
        }
    }).catch(err =>{
        console.error(err);
        throw new Error(optConfig.networkErrorMsg);
    })
}

export default function useFetchData (req:ReqConfig, handler:((data:any)=>void), dependency:Array<any>=[], optConfig:OptionConfig ={}){
    useEffect(()=>{
      const optionConfig =  {...DEFAULT_OPTION_CONFIG, ...optConfig};

      // loading start
      if(optionConfig.showLoading){
        optionConfig.loadingStartCb && optionConfig.loadingStartCb();
      }

      const promiseList = [fetchData(req, optionConfig)];

      // 超时处理
      let timer;
      if(optionConfig.timeout){
        const timeoutPromise = new Promise(function (resolve) {
          timer = setTimeout(()=>{
            resolve(new Response(null,{status:504}));
          }, optionConfig.timeoutLimit)
        });
        promiseList.push(timeoutPromise);
      }

      Promise.race(promiseList).then(res=>{
        // stop loading
        if(optionConfig.showLoading){
          optionConfig.loadingEndCb && optionConfig.loadingEndCb();
        }

        // call timeout callback
        if(res.status === 504){
          optionConfig.timeoutCb && optionConfig.timeoutCb(optionConfig.timeoutErrorMsg);
        }else{
           if(res[optionConfig.statusField] === optionConfig.statusOkValue){
             optionConfig.showSuccessMsg && optionConfig.successCb && optionConfig.successCb(optionConfig.successMsg);
             handler(res.data);
           }else{
            console.error(res[optionConfig.messageField]);
            throw new Error(res[optionConfig.messageField]);
           }
          timer && clearTimeout(timer);
        }
      }).catch(err => {
        if(optionConfig.toastError){
          optionConfig.errorCb && optionConfig.errorCb(err && err.message);
        }
      })
    }, dependency); // 参数变化时，再次发起请求
}