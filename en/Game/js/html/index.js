
//上传完成回调
function FinsihUploadFun(formData) {
    var $index = 0//ShowProgress();

    $(".makingTips").fadeIn();
    var p = new Http().Psd.Upload(formData);
    p.then((res) => {
        if (res.Status == 0) {
            var data = res.Data || {};
            var merge = new Http().Psd.FaceMerge(gender == "female" ? 1 : 0, data.FileId);
            merge.then((resMerge) => {
                var dataMerge = resMerge.Data || {};
                $(".choseSceneProductsPage .peopleImg").attr("src", dataMerge);
                //$("#userLogo").attr("src", ""); 
                $(".makingTips").hide();
                $(".choseSceneProductsPage").fadeIn();
                typeof addOpenPageEvent == 'function' && addOpenPageEvent("3M换装游戏-换装结果");
            }).catch((reason) => {
                HideProgress($index);
                console.log('失败：' + reason);
            });
        } else if (res.Status != 2) {
            JsDialog(res.Message, 2000);
        }
        HideProgress($index);
    }).catch((reason) => {
        HideProgress($index);
        console.log('失败：' + reason);
    });
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
    var shareDesc = '3M换装游戏';
    typeof changeURLStatic == 'function' && changeURLStatic(pageSearch, shareTitle, shareDesc);

    initClick();
});