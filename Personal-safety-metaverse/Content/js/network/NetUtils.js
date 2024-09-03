var sendHeader = {};

var NetUtils = {

    /***
     * 发送POST请求
     * @param httpurl
     * @param paramsObject
     * @param listener
     * @param requestKind
     */
    postJSONRequest: function (httpurl, paramsObject, listener, requestKind, async) {
        var OnResponseListener = {
            success: function (res) {
                //console.log(res);
                if (listener != null) {
                    listener.success(requestKind, res);
                }
            },
            fail: function (e) {
                if (listener != null) {
                    listener.fail(requestKind, e);
                }
            },
            complete: function () {
                if (listener != null) {
                    listener.complete(requestKind);
                }
            }
        };
        this.httpClient(httpurl, paramsObject, OnResponseListener, "POST", async);
    },


    /***
     * 发送GET请求
     * @param httpurl
     * @param paramsObject
     * @param listener
     * @param requestKind
     */
    getJSONRequest: function (httpurl, paramsObject, listener, requestKind, async) {
        var OnResponseListener = {
            success: function (res) {
                //console.log(res);

                if (listener != null) {
                    listener.success(requestKind, res);
                }
            },
            fail: function (e) {
                if (listener != null) {
                    listener.fail(requestKind, e);
                }
            },
            complete: function () {
                if (listener != null) {
                    listener.complete(requestKind);
                }
            }
        };

        this.httpClient(httpurl, paramsObject, OnResponseListener, "GET", async);
    },

    /***
     * 上传文件请求
     * @param httpurl 
     * @param paramsObject
     * @param listener
     * @param requestKind
     */
    multipartJSONRequest: function (httpurl, paramsObject, listener, requestKind, async) {
        var OnResponseListener = {
            success: function (res) {
                if (listener != null) {
                    listener.success(requestKind, res);
                }
            },
            fail: function (e) {
                if (listener != null) {
                    listener.fail(requestKind, e);
                }
            },
            complete: function () {
                if (listener != null) {
                    listener.complete(requestKind);
                }
            }
        };
        this.httpClientMultipart(httpurl, paramsObject, OnResponseListener);
    },

    httpClient: function (httpurl, paramsObject, listener, method, async) {
        method = arguments[3] ? arguments[3] : "POST";
        async = arguments[4] != null ? arguments[4] : true;
        var isObject = typeof paramsObject === 'object';
        var contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
        if (!isObject) {
            contentType = 'application/json;charset=UTF-8';
        }
        $.ajax({
            type: method,
            contentType: contentType,
            url: httpurl,
            data: paramsObject,
            dataType: "json",
            async: async,
            timeout: 50000,
            beforeSend: function (xhr) {
                for (var key in sendHeader) {
                    xhr.setRequestHeader(key, sendHeader[key]);
                }
            },
            success: function (res) {
                if (listener != null) {
                    listener.success(res);
                }
            },
            error: function (e) {
                if (listener != null) {
                    listener.fail(e);
                }
            },
            complete: function () {
                if (listener != null) {
                    listener.complete();
                }
            }
        });
    },

    httpClientMultipart: function (httpurl, paramsObject, listener, async) {
        async = arguments[3] != null ? arguments[3] : true;
        $.ajax({
            url: httpurl,
            type: 'POST',
            async: async,
            contentType: false,//{ 'Content-Type': 'multipart/form-data' },
            processData: false,
            data: paramsObject,
            beforeSend: function (xhr) {
                for (var key in sendHeader) {
                    xhr.setRequestHeader(key, sendHeader[key]);
                }
            },
            success: function (res) {
                if (listener != null) {
                    listener.success(res);
                }
            },
            error: function (e) {
                if (listener != null) {
                    listener.fail(e);
                }
            },
            complete: function () {
                if (listener != null) {
                    listener.complete();
                }
            }

        });
    },

    setSendHeader: function (headers) {
        sendHeader = headers || {};
    },

}