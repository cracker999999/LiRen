var $directory = window.Directory + '/';

//微信分享
window.InitWxShare = function (configdata, imgUrl, link, title, desc, successFun, failFun) {

    wx.config({
        debug: configdata.debug || false, // true:是调试模式,调试时候弹窗,会打印出日志
        appId: configdata.appId,
        timestamp: configdata.timestamp,
        nonceStr: configdata.nonceStr,
        signature: configdata.signature,
        jsApiList: [
            // 所有要调用的 API 都要加到这个列表中
            //'onMenuShareTimeline', // 分享到朋友圈接口（即将废弃）
            //'onMenuShareAppMessage', //  分享到朋友接口（即将废弃）
            //'onMenuShareQQ', // 分享到QQ接口（即将废弃）
            'onMenuShareWeibo', // 分享到微博接口
            //'onMenuShareQZone',//分享到QQ空间（即将废弃）
            'updateTimelineShareData',//“分享到朋友圈”及“分享到QQ空间”接口（1.4.0）
            'updateAppMessageShareData'//“分享给朋友”及“分享到QQ”接口（1.4.0）
        ]
    });

    wx.ready(function () {
        // 微信分享的数据
        var shareData = {
            imgUrl: imgUrl, // 分享显示的缩略图地址
            link: link, // 分享地址
            desc: desc, // 分享描述
            title: title, // 分享标题
            success: function () {
                //alert('分享:success');
                //typeof successFun == "function" && successFun();
            },
            fail: function () {
                //alert('分享:fail');
            },
            cancel: function () {
                //alert('分享:cancel');
                typeof failFun == "function" && failFun();
            },
            complete: function () {
                //alert('分享:complete')

            },
            trigger: function () {//1.4.0接口无法监听
                //alert('分享:trigger')
                typeof successFun == "function" && successFun();
            }
        }

        wx.updateTimelineShareData(shareData);
        wx.updateAppMessageShareData(shareData);
        //wx.onMenuShareTimeline(shareData);
        //wx.onMenuShareAppMessage(shareData);
        wx.onMenuShareWeibo(shareData);
        //wx.onMenuShareQQ(shareData);
        //wx.onMenuShareQZone(shareData);
    });
    wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，
        // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
        // 对于SPA可以在这里更新签名。
        console.log(res);
    });
}

//微信config接口注入权限验证配置
window.InitWxConfig = function (configdata, jsApiList, readyFun) {

    wx.config({
        debug: configdata.debug || false, // true:是调试模式,调试时候弹窗,会打印出日志
        appId: configdata.appId,
        timestamp: configdata.timestamp,
        nonceStr: configdata.nonceStr,
        signature: configdata.signature,
        jsApiList: jsApiList || []
    });

    wx.ready(function () {
        typeof readyFun == "function" && readyFun();
    });
    wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，
        // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
        // 对于SPA可以在这里更新签名。
        console.log(res);
    });
}

//监听微信浏览器内部WeixinJSBridge
window.InitBridgeReady = function (onBridgeReady) {
    if (typeof onBridgeReady != "function") {
        onBridgeReady = function () { }
    }

    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    } else {
        onBridgeReady();
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
Date.prototype.Format = function (fmt) {   //时间格式转换
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//全部替换
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

/**
*
* 查找数组，返回匹配到的第一个index
*
* param array 被查找的数组
* param feature 查找特征 或者为一个具体值，用于匹配数组遍历的值，或者为一个对象，表明所有希望被匹配的key-value
* param or boolean 希望命中feature全部特征或者只需命中一个特征，默认true
*
* return 数组下标  查找不到返回-1
*/
function findArray(array, feature, all) {
    all = arguments[2] != null ? arguments[2] : true;
    for (var index in array) {
        var cur = array[index];
        if (feature instanceof Object) {
            var allRight = true;
            for (var key in feature) {
                var value = feature[key];
                if (cur[key] == value && !all) return index;
                if (all && cur[key] != value) {
                    allRight = false;
                    break;
                }
            }
            if (allRight) return index;
        } else {
            if (cur == feature) {
                return index;
            }
        }
    }
    return -1;
}