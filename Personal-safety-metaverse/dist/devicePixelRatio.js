//获取屏幕缩放比例
function getRatio() {
    var ratio = 0;
    var screen = window.screen;
    var ua = navigator.userAgent.toLowerCase();

    if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
    } else if (~ua.indexOf('msie')) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI;
        }

    } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth;
    }

    if (ratio) {
        ratio = Math.round(ratio * 100);
    }
    return ratio;
}
console.log(getRatio())
console.log(window.screen.width * getRatio() / 100, window.screen.height * getRatio() / 100);

let baseScreen = 1920,
    realScreen = window.screen.width * getRatio() / 100;

let zoomContainer = $(".zoomContainer");
function setZoomContainer(){
    if(device.desktop()){
        zoomContainer.css("zoom", 100 / Number(getRatio()) * (realScreen / baseScreen))
        // zoomContainer.style.zoom = 100 / Number(getRatio()) * (realScreen / baseScreen);
    }else{
        zoomContainer.css("zoom", 1)
        // zoomContainer.style.zoom = 1;
    }
}
setZoomContainer();

$(window).resize(function (){
    realScreen = window.screen.width * getRatio() / 100;
    getRatio();
    setZoomContainer();
})