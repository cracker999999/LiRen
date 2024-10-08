let bgm = document.getElementById("bgm"),
    jieshuo = document.getElementById("jieshuo"),
    allowPlay = true;

// onPlayJieshuo();
// onPlayBgm();
autoPlayMusic();
$(function (){
    console.log("init jieshuo : " + jieshuo.paused);
})
function onPlayJieshuo() {
    console.log("OnpalyJieshuo ==> jieshuo is paused:" + jieshuo.paused + ",allowPlay: " + allowPlay);
    if (allowPlay && jieshuo.paused) {
        let playPromise = jieshuo.play();
        if (playPromise) {
            playPromise.then(() => {
                // 音频或视频加载成功
                // 音频或视频的播放需要耗时
                setTimeout(() => {
                    // 后续操作
                    // console.log("done");
                }, renst.duration * 1000); // audio.duration 为音频或视频的时长单位为秒
            }).catch((err) => {
                // console.log("Operation is too fast, audio play fails");
            });
        }
        $(".btn-jieshuo").removeClass("paused");
    } else {
        jieshuo.pause();
        $(".btn-jieshuo").addClass("paused");
    }
}

$(".btn-jieshuo").click(function (){
    allowPlay = !allowPlay;
    onPlayJieshuo();
});

function onPlayBgm() {
    bgm.volume = 0.1;
    if (bgm.paused) {
        bgm.play();
        $(".btn-bgm").removeClass("paused");
    } else {
        bgm.pause();
        $(".btn-bgm").addClass("paused");
    }
}

function autoPlayMusic() {
    // 自动播放音乐效果，解决浏览器或者APP自动播放问题
    function musicInBrowserHandler() {
        console.log(allowPlay, bgm.paused);
        onPlayJieshuo();
        onPlayBgm();
        document.body.removeEventListener('touchstart', musicInBrowserHandler);
        document.body.removeEventListener('mousedown', musicInBrowserHandler);
    }

    document.body.addEventListener('touchstart', musicInBrowserHandler);
    // document.body.addEventListener('mousedown', musicInBrowserHandler);

    // 自动播放音乐效果，解决微信自动播放问题
    function musicInWeixinHandler() {
        onPlayJieshuo();
        onPlayBgm();
        document.addEventListener("WeixinJSBridgeReady", function () {
            onPlayJieshuo();
            onPlayBgm();
        }, false);
        document.removeEventListener('DOMContentLoaded', musicInWeixinHandler);
    }

    document.addEventListener('DOMContentLoaded', musicInWeixinHandler);
    $(".btn-jieshuo, .btn-bgm").removeClass("paused");
}


jieshuo.addEventListener("playing", function () {
    console.log("jieshuo is playing, allowPlay: " + allowPlay);
    if(!allowPlay){
        $(".btn-jieshuo").addClass("paused");
        jieshuo.pause();
    }else{
        $(".btn-jieshuo").removeClass("paused");
        jieshuo.play();
    }
});

jieshuo.addEventListener("pause", function () {
    console.log("jieshuo is pause, allowPlay: " + allowPlay);
    if(!allowPlay){
        $(".btn-jieshuo").addClass("paused");
    }else{
        $(".btn-jieshuo").removeClass("paused");
    }
})

jieshuo.addEventListener("ended", function () {
    console.log("jieshuo is ended, allowPlay: " + allowPlay);
    if(!allowPlay){
        $(".btn-jieshuo").addClass("paused");
    }else{
        $(".btn-jieshuo").removeClass("paused");
    }
})

bgm.addEventListener("playing", function () {
});

bgm.addEventListener("pause", function () {
});

bgm.addEventListener("ended", function () {
});