
//公共
var $pubWin = {
    isAndroid: (/android/gi).test(navigator.appVersion),
    isIOS: (/mac/gi).test(navigator.appVersion),
    isIpad: (/iPad/gi).test(navigator.appVersion),
    currenHref: decodeURI(document.URL),//当前页面地址
    uzStorage: function () {//得到缓存对象  分window和os
        var ls = window.localStorage;
        return ls;
    },
    setStorage: function (key, value) {//设置缓存值
        if (arguments.length === 2) {
            var v = value;
            if (typeof v == 'object') {
                v = JSON.stringify(v);
                v = 'obj-' + v;
            } else {
                v = 'str-' + v;
            }
            var ls = this.uzStorage();
            if (ls) {
                ls.setItem(key, v);
            }
        }
    },
    getStorage: function (key) {//得到缓存值
        var ls = this.uzStorage();
        if (ls) {
            var v = ls.getItem(key);
            if (!v) {
                return;
            }
            if (v.indexOf('obj-') === 0) {
                v = v.slice(4);
                return JSON.parse(v);
            } else if (v.indexOf('str-') === 0) {
                return v.slice(4);
            }
        }
    },
    rmStorage: function (key) {//移除缓存值
        var ls = this.uzStorage();
        if (ls && key) ls.removeItem(key);
    },
    clearStorage: function (callback) {//清空缓存
        var ls = this.uzStorage();
        if (ls) ls.clear();
    },
    //判断对象是否为空
    isEmpty: function (obj) {
        if (typeof obj != "number" && !obj) {
            return true
        }
        if (Object.prototype.toString.call(obj) === "[object Array]") {
            if (obj.length === 0) {// []
                return true
            }
            return false
        } else if (typeof obj === "object") {
            if (obj === null) {// null
                return true
            }
            for (var key in obj) {// {}
                return false
            }
            return true
        } else if (obj === '') {// ''
            return true
        }
        return false
    },
    isHttpUrlCom: function (s) {
        return /^http[s]?:\/\/.*/.test(s)
    },
    //判断是否为空
    isEmptyCom: function (val) {
        if (typeof val === 'boolean') {
            return false
        }
        if (this.isArrayCom(val)) {
            if (val.length === 0) return true
        } else if (this.isObjectCom(val)) {
            if (JSON.stringify(val) === '{}') return true
        } else {
            if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true
            return false
        }
        return false
    },
    //验证邮箱
    checkEmailCom: function (val) {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (this.isEmpty(val)) {
            return false;
        } else if (!(reg.test(val))) {
            return false;
        }
        return true;
    },
    //验证手机号
    checkPhoneCom: function (tel) {
        var reg = /^[1][0-9]{10}$/;
        if (this.isEmpty(tel)) {
            return false;
        } else if (!(reg.test(tel))) {
            return false;
        }
        return true;
    },
    //判断是否为数组
    isArrayCom: function (val) {
        return val instanceof Array;
    },
    //判断是否对象
    isObjectCom: function (val) {
        return val instanceof Object;
    },
    isNumberS: function (s) {
        return /[^0-9.]/g.test(s)
    },
    formatNumber: function (n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    },

    //银行卡中间四位加密
    bankCardEncryCom: function (str) {
        var result = '';
        if (!_pub.isEmpty(str)) {
            if (str.length > 3) { result = str.substring(0, 4) + '****'; }
            else { result = str.substring(0, str.length) + '****'; }
            result += ' **** ****' + str.substring(str.length - 4)
        } else { result = null }
        return result;
    },
    //手机号中间四位加密
    phoneEncryCom: function (str) {
        var result = '';
        if (!_pub.isEmpty(str)) {
            if (str.length > 2) { result = str.substring(0, 3) + '****'; }
            else { result = str.substring(0, str.length) + '****'; }
            result += str.substring(7)
        } else { result = null }
        return result;
    },
    //手机号 格式化显示 123 4567 8901
    phoneCssCom: function (str) {
        var result = '';
        if (!_pub.isEmpty(str)) {
            if (str.length == 11) {
                result = str.substring(0, 3) + ' ' + str.substring(3, 7) + ' ' + str.substring(7);
            }
            else { result = str }
        } else { result = null }
        return result;
    },
    setTimeoutMyTime: null,
    /* 倒计时 */
    count_down: function (cb, total_second, initMsg) {
        initMsg = initMsg || "重新发送";
        var _self = this;
        if (total_second <= 0) {
            var verifiTime = initMsg;
            typeof cb == "function" && cb(verifiTime, true);
            return;
        }
        // 渲染倒计时时钟
        var verifiTime = total_second + " 秒";
        typeof cb == "function" && cb(verifiTime);
        setTimeoutMyTime = setTimeout(function () {
            // 放在最后--
            total_second -= 1;
            _self.count_down(cb, total_second, initMsg);
        }, 1000);
    },

}

//微信网页登录
window.urlSetWXuRL = function (appid, isSilent, state, isCompel) {
    appid = appid || 'wx2836a179a925689e';
    state = state || '1';//携带参数
    const slef = this;
    var useragent = navigator.userAgent;

    if (useragent.match(/MicroMessenger/i) == 'MicroMessenger' || isCompel) {
        // 这里警告框会阻塞当前页面继续加载
        //alert('已禁止本次访问：您必须使用微信访问本页面！');
        var turl = decodeURI(document.URL).split('?');
        turl = turl[0].split('#');
        var hash = window.location.hash;
        var url = turl[0] + hash;
        let search = 'appid=' + appid + '&redirect_uri=' + window.urlencode(url);
        //snsapi_base:静默登录，snsapi_userinfo:授权登录（获取用户信息）
        search += '&response_type=code&scope=' + (isSilent == 1 ? 'snsapi_base' : 'snsapi_userinfo');
        search += '&state=' + state + '#wechat_redirect';
        var tlinkUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?' + search;
        window.location.replace(tlinkUrl);
        return true;
    } else {
        alert("请使用微信访问！");
    }
    return false;
}


//url encode
window.urlencode = function(str) {
    str = (str + '').toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

//url decode
window.urldecode = function (str) {
    str = (str + '').toString();
    return decodeURIComponent(str.replace(/\+/g, '%20').replace(/%2A/g, '\*').replace(/%29/g, '\)').
        replace(/%28/g, '\(').replace(/%27/g, '\'').replace(/%21/g, '!'));
}

//获取url参数值
window.getUrlParam = function (name, url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var params = url || window.location.search;
    if (params == null || params.length <= 1) return null;
    var r = params.substr(1).match(reg);  //匹配目标参数
    //if (r != null) return unescape(r[2]); return null; //返回参数值
    if (r != null) return decodeURIComponent(r[2]); return null; //返回参数值
}

//动态加载一个js/css文件
function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //判定文件类型
        var fileref = document.createElement('script')//创建标签
        fileref.setAttribute("type", "text/javascript")//定义属性type的值为text/javascript
        fileref.setAttribute("src", filename)//文件的地址
    }
    else if (filetype == "css") { //判定文件类型
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined") document.getElementsByTagName("head")[0].appendChild(fileref)
}
//移动已经加载过的js/css
function removejscssfile(filename, filetype) {
    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none";
    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none";
    var allsuspects = document.getElementsByTagName(targetelement);

    for (var i = allsuspects.length; i >= 0; i--) {

        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null
            && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {

            allsuspects[i].parentNode.removeChild(allsuspects[i]);
        }
    }
}
