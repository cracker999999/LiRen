
//获取url参数值
window.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var params = window.location.search;
    if (params == null || params.length <= 1) return null;
    var r = params.substr(1).match(reg);  //匹配目标参数
    //if (r != null) return unescape(r[2]); return null; //返回参数值
    if (r != null) return decodeURIComponent(r[2]); return null; //返回参数值
}

//跳转页面
function toJump(path) {
    var urlArgs = '';//"?v=" + window.Version;//js参数,用于控制js版本
    window.location.href = path + urlArgs;//跳转页面
}

function initClick() {

    $(".EnterPageEvent").on('click', function () {
        var title = $(this).data('title');
        var name = $(this).data('name');
        var attr1 = $(this).data('attr1') || '';
        var attr2 = $(this).data('attr2') || '';
        typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);//页面日志
    });
}

function toJumpPageEvent(event, callback) {
    var title = $(event).data('title');
    var name = $(event).data('name');
    var attr1 = $(event).data('attr1') || '';
    var attr2 = $(event).data('attr2') || '';
    typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2, callback);//页面日志
}

$(function () {
    var pageSearch = '';
    var shareTitle = '3M个人安全防护元宇宙';
    var shareDesc = '沉浸式体验行业解决方案';
    typeof changeURLStatic == 'function' && changeURLStatic(pageSearch, shareTitle, shareDesc);

    initClick();
});
