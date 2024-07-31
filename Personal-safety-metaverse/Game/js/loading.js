/*Loading*/
var loader = new ImagesLoader();
loader.loadImages([
    "icon_music.png",
    "page1/bg.png",
    "page1/btn_rules.png",
    "page1/logo.png",
    "page1/banner1.png",
    "page1/banner2.png",
    "page1/banner3.png",
    "page1/banner4.png",
    "page1/banner5.png",
    "page1/banner6.png",
    "page2/bg.png",
    "page2/btn_play.png",
    "page2/icon_checked.png",
    "page2/logo.png",
    "page2/modal_bg_bottom.png",
    "page2/modal_bg_mid.png",
    "page2/modal_bg_top.png",
    "page3/bg.png",
    "page3/icon_man.png",
    "page3/icon_man_on.png",
    "page3/icon_woman.png",
    "page3/icon_woman_on.png",
    "page3/img_man.png",
    "page3/img_woman.png",
    "page4/bg_architecture.png",
    "page4/bg_automobile.png",
    "page4/bg_chemical.png",
    "page4/bg_metallurgy.png",
    "page4/bg_pharmacy.png",
    "page4/bg_shipping.png",
    "page4/preview_architecture.png",
    "page4/preview_automobile.png",
    "page4/preview_chemical.png",
    "page4/preview_metallurgy.png",
    "page4/preview_pharmacy.png",
    "page4/preview_shipping.png",
    "page4/man.png",
    "page4/woman.png",
    "page4/frame.png",
    "page5/btn_next.png",
    "page5/line.png",
    "page5/marsk1_preview.png",
    "page5/marsk2_preview.png",
    "page5/marsk3_preview.png",
    "page5/marsk4_preview.png",
    "page5/marsk1_product.png",
    "page5/marsk2_product.png",
    "page5/marsk3_product.png",
    "page5/marsk4_product.png",
    "page5/sort_earphone.png",
    "page5/sort_earphone_on.png",
    "page5/sort_earplugs.png",
    "page5/sort_earplugs_on.png",
    "page5/sort_glasses.png",
    "page5/sort_glasses_on.png",
    "page5/sort_helmet.png",
    "page5/sort_helmet_on.png",
    "page5/sort_marsk.png",
    "page5/sort_marsk_on.png",
    "page6/btn_forward.png",
    "page6/btn_poster.png",
    "page6/btn_back.png",
    "page6/identify.png",
    "page6/man.png",
    "page6/marsk1_product.png",
    "page6/marsk2_product.png",
    "page6/marsk3_product.png",
    "page6/marsk4_product.png",
    "page7/poster_bg.png?v20230112",
    "page7/tips.png",
    "page7/btn_upload.png",
], "./images/");
loader.complete(function () {
    console.log("loadCompleted");
    $(".loading-page").hide();
    $(".startPage, .posterPage").show();
    setTimeout(function (){
        bannerSwiper.update();
        bannerSwiper.autoplay.start();
    },300);
});
loader.process(function () {
    // console.log("process: " + this.processNum);
    $(".loading-num").html(this.processNum + "%");
    $(".inner-bar").css({
        "width": this.processNum + "%"
    })
});
loader.start();