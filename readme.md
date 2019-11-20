##使用

import 

## 开发

### 本地启动案例

`npm run start`


###  编译lib
`npm run build`
 
 
### 自动化测试

`npm run test`

## API

###useFetchData hook
useFetchData (req:ReqConfig, handler:((data:any)=>void), dependency:Array<any>=[], optConfig:OptionConfig ={})

#### req:ReqConfig 必需
描述：请求参数，可配置以下跟请求相关数据：

|  参数 | 是否可选 |格式 | 默认值 |   
| ---- | ---- |---- | ---- |   
| api  | |string |     |
| method| 可选|string | “GET”|
| body  | 可选|any |      |
| headers| 可选|any |     |

#### handler:((data:any)=>void) 必需

描述：数据请求成功后的回调，回调参数为请求返回的数据data。 

#### dependency:Array<any>=[] 可选

描述：触发请求的依赖，数组。只有依赖数据变化时，才会再次触发请求

例如可以是：分页参数page 和 pageSize

#### optConfig:OptionConfig ={} 可选
描述：可选参数，对象，可配置以下跟请求行为相关的配置：

loading 配置

|  参数 | 是否可选 |格式 | 默认值 |描述   
| ---- | ---- |---- | ---- | ----|  
|showLoading|可选|boolean| true|是否展示loading
|loadingStartCb|可选 |LoadingCallback|| loading 开始回调 
|loadingEndCb|可选 |LoadingCallback|| loading 结束回调 

超时处理配置

|  参数 | 是否可选 |格式 | 默认值 | 描述
| ---- | ---- |---- | ---- | ----|      
|timeout|可选  | boolean| true  | 是否需要超时限制 |
|timeoutLimit|可选 |number| 10000 | 超时限制
|timeoutCb|可选|MsgCallback|   | 请求超时回调，回调参数为timeoutErrorMsg
|timeoutErrorMsg|可选|string| "请求超时，请稍后再试" | 请求超时文本

错误处理配置
    
|  参数 | 是否可选 |格式 | 默认值 |  描述
| ---- | ---- |---- | ---- | ----|  
|toastError|可选|boolean| true | 是否展示错误信息
|errorCb|可选|MsgCallback| | 展示错误信息的回调
|networkErrorMsg|可选|string| "网络请求错误"| 网络错误信息文本

 
请求返回解析

|  参数 | 是否可选 |格式 | 默认值 |  描述
| ---- | ---- |---- | ---- | ----|
|statusField|可选|string| “success” |请求响应中表示请求数据状态的字段
|statusOkValue|可选 |any| true | 请求响应中表示请求数据状态为成功的值
|messageField|可选|string| "message"| 请求响应中描述错误信息的字段

 
  请求成功处理
  
|  参数 | 是否可选 |格式 | 默认值 | 描述 
| ---- | ---- |---- | ---- | ----|
|showSuccessMsg|可选|boolean| false| 是否展示请求成功信息
|successMsg|可选|string| “请求成功” |请求成功信息文本
|successCb|可选|MsgCallback|  |展示请求成功回调，回调参数为successMsg 

### setGlobalOptionConfig method

setGlobalOptionConfig(config:OptionConfig)
 
描述：全局统一配置请求行为，配置参数优先级低于useFetchData hook 上配置的optConfig。

例如：应用统一在页面级别loading，则可以使用setGlobalOptionConfig 统一设置 loading 相关配置。 但有个别请求不希望展示loading，则可以在相关 useFetchData hook 调用时设置optConfig 参数；
 
## Example
 [useFetchData example](./example/index.ts)

    

   

