
//定义
var ServiceJs = {

    initialize: function () {
        //抛出一个虚方法给继承重写
        this.oninit();
    },

    oninit: function () {// 页面处理虚方法
        //虚方法代码
    },

    setSendHeader: function (headers) {
        RequestUtils.setSendHeader(headers);
    },

    //请求列表
    request: function (paramsObject, requestKind, method, async, formData) {
        return RequestUtils.request(paramsObject, this, requestKind, method, async, formData);
    },

    //请求返回
    success: function (requestKind, res) {
        this.executeResponse(requestKind, res);
    },
    fail: function (requestKind, e) {
        this.executeErrorResponse(requestKind, e);
    },
    complete: function (requestKind) {
        this.executeCompleteResponse(requestKind);
    },

    //处理请求结果
    executeResponse: function (requestKind, res) {
        //if (res.Status == 2) {            
        //    typeof cleanLogin == "function" && cleanLogin(true);
        //}
    },

    //处理错误结果
    executeErrorResponse: function (requestKind, e) {

    },

    //处理完成结果
    executeCompleteResponse: function (requestKind) {

    },

    extend: function (destination, source) {
        for (name in source) {
            destination[name] = source[name];
        }
        return destination;
    }
}