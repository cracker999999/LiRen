//获取url参数值
window.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var params = window.location.search;
    if (params == null || params.length <= 1) return null;
    var r = params.substr(1).match(reg);  //匹配目标参数
    //if (r != null) return unescape(r[2]); return null; //返回参数值
    if (r != null) return decodeURIComponent(r[2]); return null; //返回参数值
}

//url encode
window.urlencode = function (str) {
    str = (str + '').toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

window.urldecode = function(zipStr) {
    var uzipStr = '';
    for (var i = 0; i < zipStr.length; i += 1) {
        var chr = zipStr.charAt(i);
        if (chr === '+') {
            uzipStr += ' ';
        } else if (chr === '%') {
            var asc = zipStr.substring(i + 1, i + 3);
            if (parseInt('0x' + asc) > 0x7f) {
                uzipStr += decodeURI('%' + asc.toString() + zipStr.substring(i + 3, i + 9).toString());
                i += 8;
            } else {
                uzipStr += AsciiToString(parseInt('0x' + asc));
                i += 2;
            }
        } else {
            uzipStr += chr;
        }
    }
    return uzipStr;
}

var useragent = navigator.userAgent;
var openid = getUrlParam('openid') || localStorage.getItem('3m_wx_openid') || '';
localStorage.setItem('3m_wx_openid', openid);
if (useragent.match(/MicroMessenger/i) == 'MicroMessenger' && !openid) {
    // 这里警告框会阻塞当前页面继续加载
    //alert('已禁止本次访问：您必须使用微信访问本页面！');
    var tlinkUrl = 'https://huodong.personalsafety-china.com/3mawards/psd/Go/index.aspx?scope=snsapi_base&nextpage=' + window.urlencode(window.location.href);
    window.location.replace(tlinkUrl);
}



//初始化微信config
function initWxConfig(shareUrl, shareTitle, shareDesc) {
    //获取当前url，
    var url = window.location.href;
    var turl = url.split('#');
    url = turl[0];
    //获取微信js-sdk签名
    var p = new PSDHttp().Common.GetConfigWXSDK(url);
    p.then((res) => {
        if (res.Status == 0) {
            let link = window.location.href;
            var shareIcon = 'https://3m.sjune.cn/Personal-safety-metaverse/images/icon_share.jpg';
            shareTitle = shareTitle || '3M个人安全防护元宇宙';
            shareDesc = shareDesc || '';
            window.InitWxShare(res.Data, shareIcon, shareUrl, shareTitle, shareDesc
                , function () {
                });
        }
    }).catch((reason) => {
        console.log('失败：' + reason);
    });
}


function changeURLStatic(search, shareTitle, shareDesc) {
    let link = window.location.href;

    var pathname = window.location.pathname;
    var shareUrl = link.substring(0, link.indexOf(pathname) + pathname.length);
    shareUrl = shareUrl + search;  
    console.log('shareUrl =>', shareUrl)
    initWxConfig(shareUrl, shareTitle, shareDesc);
}

/**
 * @param {string} solutionName
 * @param {array} productList
 * @return {array} 
 */
function getProductsBySolution(solutionName, productList){
    return productList.filter(item => item.solution.includes(solutionName));
}

/**
 * @param {string} productType
 * @param {array} productList
 * @return {array} 
 */
function getProductsByType(productType, productList){
    return productList.filter(item => item.productType.includes(productType));
}

/**
 * @param {string} solutionName
 * @param {array} solutionList
 * @return {Object|undefined}
 */
function getSolutionByName(solutionName, solutionList){
    return solutionList.find(item => item.solutionName === solutionName);
}

let productMap;
let productList;
let isConfigLoaded = false;
function loadProductConfig() {
    fetch('../product.json')
        .then(response => response.json())
        .then(data => {
            productList = data;

            //把productList转成map key为id value为对象
            productMap = new Map();
            data.forEach(item => {
                productMap.set(parseInt(item.id), item);
            });

            isConfigLoaded = true;

            console.log('产品总数: '+productMap.size);
            
            document.dispatchEvent(new Event('productConfigLoaded'));
        })
        .catch(error => {
            console.error('Error loading config:', error);
        });
}

$(function (){
    loadProductConfig();
})