/*loading*/
var loader = new ImagesLoader();
loader.loadImages([
    "flash_bg.jpg",
    "img_chuangxin.png",
    "img_floor.png",
    "img_huagong.png",
    "img_huagong_on.png",
    "img_jianzhu.png",
    "img_jianzhu_on.png",
    "img_qiche.png",
    "img_qiche_on.png",
    "img_yejin.png",
    "img_yejin_on.png",
    "img_zhiyao.png",
    "img_zhiyao_on.png",
], "./images/index/");
loader.complete(function () {
    console.log("loadCompleted");
    flashInit($cityImgs, len2);
});
loader.process(function () {
    console.log("process: " + this.processNum);
});
loader.start();

