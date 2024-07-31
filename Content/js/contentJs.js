
//配置baseUrl
var baseUrl = document.getElementById('main').getAttribute('data-baseurl');

var mainsrc = document.getElementById('main').getAttribute('data-main') || '';

var urlArgs = "?v=" + window.Version;//js参数,用于控制js版本   
//动态加载js
document.write('<script type="text/javascript" src="' + baseUrl + 'Content/js/lib/layer/layer.js"><\/script>');
document.write('<script type="text/javascript" src="' + baseUrl + 'Content/js/public/public.js' + urlArgs + '"><\/script>');
document.write('<script type="text/javascript" src="' + baseUrl + 'Content/js/public/commen.js' + urlArgs + '"><\/script>');
document.write('<script type="text/javascript" src="' + baseUrl + 'Content/js/network/MD5.js' + urlArgs + '"><\/script>');
document.write('<script type="text/javascript" src="' + baseUrl + 'Content/js/network/Utils.js' + urlArgs + '"><\/script>');
document.write('<script type="text/javascript" src="' + baseUrl + 'Content/js/network/NetUtils.js' + urlArgs + '"><\/script>');
document.write('<script type="text/javascript" src="' + baseUrl + 'Content/js/network/RequestUtils.js' + urlArgs + '"><\/script>');
document.write('<script type="text/javascript" src="' + baseUrl + 'Content/js/public/ServiceBase.js' + urlArgs + '"><\/script>');
let srcarr = mainsrc.split(',');
for (var i = 0, len = srcarr.length; i < len; i++) {
    let src = srcarr[i];
    if (src) {
        let search = src.indexOf('?') > -1 ? urlArgs.replace('?', '&') : urlArgs;
        document.write('<script type="text/javascript" src="' + src + search + '"><\/script>');
    }
}

//提示框,msg 消息内容 time 自动关闭时间
function JsDialog(msg, time) {
    layer.msg((msg), { time: time });
}
//加载
function ShowProgress() {
    let index = layer.load(2, { shade: [0.4, '#393D49'] });
    return index;
}
function HideProgress(index) {
    layer.close(index);
}

if (!(typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1)) {
    alert("不支持Promise，请联系管理员");
}
