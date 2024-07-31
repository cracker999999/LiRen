/**请求工具类 */
//var URL_BASE = "";
//var URL_BASE = window.API_BASE_URL;
var appKey = "7nejhFEw2DYaFz01";
var appsecret = "XyTK26icxcGCbGHj3hleb0JtZHM5P5Yo";
var RequestUtils = {

    /***
         * 发送请求
         * @param paramsObject
         * @param listener
         * @param requestKind
         */
    request: function (paramsObject, listener, requestKind, method, async, formData) {
        method = arguments[3] ? arguments[3] : "POST";//请求方式
        let url = window.API_BASE_URL;//请求url
        paramsObject['sourceSys'] = 0;
        paramsObject['apiType'] = requestKind;
        var timestamp = new Date().getTime();
        paramsObject.timestamp = timestamp;
        paramsObject.appKey = appKey;
        var sign = create_sign(paramsObject, appsecret);
        paramsObject.sign = sign;

        var fun = function (resolve, reject) {
            var OnResponseListener =  {
                success: function (requestKind, res) {                        
                    resolve(res);
                    if (listener != null) {
                        listener.success(requestKind, res);
                    }
                },
                fail: function (requestKind, e) {                       
                    reject(e);
                    if (listener != null) {
                        listener.fail(requestKind, e);
                    }
                },
                complete: function (requestKind) {
                    if (listener != null) {
                        listener.complete(requestKind);
                    }
                }
            }

            switch (method.toUpperCase()) {
                case 'UPLOAD':
                    for (var key in paramsObject) {
                        formData.append(key, paramsObject[key]);
                    }
                    NetUtils.multipartJSONRequest(url, formData, OnResponseListener, requestKind, async);
                    break;
                case 'GET':
                    NetUtils.getJSONRequest(url, paramsObject, OnResponseListener, requestKind, async);
                    break;
                case 'POST':
                default:
                    NetUtils.postJSONRequest(url, paramsObject, OnResponseListener, requestKind, async);
                    break;
            }
        }         
        return new Promise(fun);
    },

    
    /**
    * 设置headers
    */
    setSendHeader: function (headers) {
        NetUtils.setSendHeader(headers);
    }

}