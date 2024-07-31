
function addClabTrackerCommon(targetName) {
    $.get('https://3m-service.sjune.cn/getip.ashx', function (res) {
        // console.log(res);
        // console.log(targetName);

        if(typeof clab_tracker != "undefined")
        {
            clab_tracker.push({ "campaign": "PSDPersonalSafetyMetaverse" });
            clab_tracker.push({ "appName": "PSD安全防护元宇宙" });

            var openid = getUrlParam('openid') || localStorage.getItem('3m_wx_openid') || '';

            clab_tracker.push({
                identityType: 'applet-wechat',  //固定值，配合下方设置用户的open id
                identityValue: openid,   // identityValue 是用户的open_id
                identityType3: 'commonMd5',  //固定值，配合下方设置用户的MD5身份信息
                identityValue3: res.ip   // IP地址
            });
            clab_tracker.push({ "location": res.ip });     //  IP地址

            clab_tracker.push({
                "source": getUrlParam('source') || '',      //按URL中的实际情况传输
                "source1": getUrlParam('source1') || '',      //按URL中的实际情况传输
                "source4": getUrlParam('source4') || '',     //按URL中的实际情况传输
                "source5": getUrlParam('source5') || '',     //按URL中的实际情况传输
                "source6": getUrlParam('source6') || ''      //按URL中的实际情况传输
            });

            clab_tracker.setEnableAutoTrackOpenPage(false);
        }

    
        addOpenPageEvent(targetName);
        //alert(targetName);
    });
}

function addOpenPageEvent(targetName, callback) {
    new PSDHttp().System.AddPageLog("OpenPage", window.location.href, targetName, window.location.search, "", "Open", "页面打开",
        "", "", document.referrer, "", "", "", "", "", "", "");

    if(typeof clab_tracker != "undefined")
    {
        clab_tracker.setEnableAutoTrackOpenPage(false);
        clab_tracker.track("open_page", {
            "targetId": window.location.href,
            "targetName": targetName,
        }, function () {
            console.log('clab_tracker:open_page=>', targetName);
            typeof callback == 'function' && callback();
            //debugger;
        });
    }
    else
    {
        typeof callback == 'function' && callback();
    }
}

function addPageEvent(pageTitle, contentName, attr1, attr2, callback) {
    new PSDHttp().System.AddPageLog("OpenEvent", window.location.href, pageTitle, window.location.search, "", "Click", contentName,
        "", attr1, document.referrer, "", "", "", "", "", attr2, "");

    if(typeof clab_tracker != "undefined")
    {
        clab_tracker.track("c_page_event", {
            "c_page_path": window.location.href,  //页面路径
            "c_page_title": pageTitle,   //页面名称
            "contentName": contentName, //按钮/链接等元素名称
            "c_action": "click",
            "c_attr1": attr1 || '', //额外信息字段，传输如商品名称
            "c_attr2": attr2 || '',  //额外信息字段，传输如商品ID
        }, function () {
            console.log('clab_tracker:c_page_event=>', pageTitle, contentName, attr1, attr2);
            typeof callback == 'function' && callback();
            //debugger;
        });
    }
    else
    {
        typeof callback == 'function' && callback();
    }
}