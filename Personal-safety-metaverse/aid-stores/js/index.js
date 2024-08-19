//获取url参数值
window.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var params = window.location.search;
    if (params == null || params.length <= 1) return null;
    var r = params.substr(1).match(reg);  //匹配目标参数
    //if (r != null) return unescape(r[2]); return null; //返回参数值
    if (r != null) return decodeURIComponent(r[2]);
    return null; //返回参数值
}

document.addEventListener('productConfigLoaded', onProductConfigLoaded);

function onProductConfigLoaded(e) {
    vm.productMap = productMap;
    vm.isConfigLoaded = true;
}

//跳转页面
function toJump(path) {
    var urlArgs = '';//"?v=" + window.Version;//js参数,用于控制js版本
    window.location.href = path + urlArgs;//跳转页面
}

let initScene = getUrlParam("scene") || 'tour0.xml?v20231211',
    sceneIndex = parseInt(getUrlParam("sceneIndex")) || 0;
console.log(initScene, sceneIndex);

const app = Vue.createApp({
    data() {
        return {
            isConfigLoaded: false,
            productMap: null,
            krpano: null, // 左侧选中的场景索引
            sceneIndex, // 场景索引
            alertIndex: -1, // 危害点索引
            curSolutionIndex: -1, //解决方案索引
            curProductIndex: 0,//产品索引
            showScenePreview: true,
            showAlertBox: false,
            showProductModal: false,
            jieshuoSrc: '',
            highLightArray: [],
            sceneList: [
                {
                    name: '耳保健检查',
                    previewImg: '../scene_preview/scene_erbaojianjiancha.png?v20230222',
                    tour: 'tour0.xml?v20231211',
                    startScene: 'scene_0',
                    alertList: [],
                    jieshuo: '../jieshuo/ZhuTingQiLianSuoMenDian_ErBaoJianJianCha.mp3',
                    solutions: ['耳检查'],
                },
                {
                    name: '听力检查',
                    previewImg: '../scene_preview/scene_tinglijiancha.png?v20230222',
                    tour: 'tour1.xml?v20231211',
                    startScene: 'scene_1',
                    alertList: [],
                    jieshuo: '../jieshuo/ZhuTingQiLianSuoMenDian_TingLiJianCha.mp3',
                    solutions: ['纯音测试','声场测试','言语测试','VRA测试','声导抗测试','耳声发射测试'],
                },
                {
                    name: 'ABR/ASSR测试',
                    previewImg: '../scene_preview/scene_abrassrceshi.png?v20230222',
                    tour: 'tour2.xml?v20231211',
                    startScene: 'scene_2',
                    alertList: [],
                    jieshuo: '../jieshuo/ZhuTingQiLianSuoMenDian_ABRASSRCeShi.mp3',
                    solutions: ['客观检测'],
                },
                {
                    name: '验配',
                    previewImg: '../scene_preview/scene_yanpei.png?v20230222',
                    tour: 'tour3.xml?v20231211',
                    startScene: 'scene_3',
                    alertList: [],
                    jieshuo: '../jieshuo/ZhuTingQiLianSuoMenDian_YanPei.mp3',
                    solutions: ['验配室'],
                },
                {
                    name: '售后服务',
                    previewImg: '../scene_preview/scene_shouhoufuwu.png?v20230222',
                    tour: 'tour4.xml?v20231211',
                    startScene: 'scene_4',
                    alertList: [],
                    jieshuo: '../jieshuo/ZhuTingQiLianSuoMenDian_ShouHouFuWu.mp3',
                    solutions: ['售后'],
                },
                {
                    name: '陈列耗材',
                    previewImg: '../scene_preview/scene_chenliehaocai.png?v20230222',
                    tour: 'tour5.xml?v20231211',
                    startScene: 'scene_5',
                    alertList: [],
                    jieshuo: '../jieshuo/ZhuTingQiLianSuoMenDian_ChenLieHaoCai.mp3',
                    solutions: ['陈列道具','展示架','挂绳','配件耗材 '],
                },
                {
                    name: '耳模制作',
                    previewImg: '../scene_preview/scene_ermozhizuo.png?v20230222',
                    tour: 'tour6.xml?v20231211',
                    startScene: 'scene_6',
                    alertList: [],
                    jieshuo: '../jieshuo/ZhuTingQiLianSuoMenDian_ErMoZhiZuo.mp3',
                    solutions: ['3D制造'],
                },
                {
                    name: '验配培训及资质考核',
                    previewImg: '../scene_preview/scene_yanpeipeixunjizizhikaohe.png?v20230222',
                    tour: 'tour7.xml?v20231211',
                    startScene: 'scene_7',
                    alertList: [],
                    jieshuo: '../jieshuo/ZhuTingQiLianSuoMenDian_YanPeiPeiXunJiZiZhiKaoHe.mp3',
                    solutions: ['培训'],
                },
                {
                    name: '移动测听车服务场景',
                    previewImg: '../scene_preview/scene_yidongcetingchefuwuchangjing.png?v20230222',
                    tour: 'tour8.xml?v20231211',
                    startScene: 'scene_8',
                    alertList: [],
                    jieshuo: '../jieshuo/TingLiChe.mp3',
                    solutions: ['测听','验配','售后服务','市场用具','配件耗材'],
                },
            ],
            curAlertIndex: 0,
            curAlertList: [],
            solutionList: [
                {
                    solutionName: '耳检查',
                    solutionIcon: 'assets/img/icon_mask.png?v20230222',
                    productIds: [33,34,14],
                },
                {
                    solutionName: '纯音测试',
                    solutionIcon: 'assets/img/icon_earmuff.png?v20230222',
                    productIds: [49,74],
                },
                {
                    solutionName: '声场测试',
                    solutionIcon: 'assets/img/icon_hat.png?v20230222',
                    productIds: [35,49,74,36],
                },
                {
                    solutionName: '言语测试',
                    solutionIcon: 'assets/img/icon_earmuff.png?v20230222',
                    productIds: [35,49,74,36],
                },
                {
                    solutionName: 'VRA测试',
                    solutionIcon: 'assets/img/icon_hat.png?v20230222',
                    productIds: [37,49,74,36],
                },
                {
                    solutionName: '声导抗测试',
                    solutionIcon: 'assets/img/icon_earmuff.png?v20230222',
                    productIds: [38],
                },
                {
                    solutionName: '耳声发射测试',
                    solutionIcon: 'assets/img/icon_earmuff.png?v20230222',
                    productIds: [83,60],
                },

                {
                    solutionName: '客观检测',
                    solutionIcon: 'assets/img/icon_earmuff.png?v20230222',
                    productIds: [84,85,40,49],
                },
                {
                    solutionName: '验配室',
                    solutionIcon: 'assets/img/icon_earmuff.png?v20230222',
                    productIds: [86,8,13,40],
                },
                {
                    solutionName: '售后',
                    solutionIcon: 'assets/img/icon_earmuff.png?v20230222',
                    productIds: [56,61,25,41,12,53],
                },
                {
                    solutionName: '陈列道具',
                    solutionIcon: 'assets/img/icon_earmuff.png?v20230222',
                    productIds: [5,43,27],
                },
                {
                    solutionName: '展示架',
                    solutionIcon: 'assets/img/icon_earmuff.png?v20230222',
                    productIds: [16,75,76,77,78,79,80,81],
                },
                {
                    solutionName: '挂绳',
                    solutionIcon: 'assets/img/icon_earmuff.png?v20230222',
                    productIds: [17,99,100,101,102,103],
                },
                {
                    solutionName: '配件耗材 ',
                    solutionIcon: 'assets/img/icon_earmuff.png?v20230222',
                    productIds: [18,19,6,55,64,22,44,87,54],
                },
                {
                    solutionName: '3D制造',
                    solutionIcon: 'assets/img/icon_earmuff.png?v20230222',
                    productIds: [1,2,72],
                },
                {
                    solutionName: '培训',
                    solutionIcon: 'assets/img/icon_hat.png?v20230222',
                    productIds: [88,89],
                },
                //听力车
                {
                    solutionName: '测听',
                    solutionIcon: 'assets/img/icon_earmuff.png',
                    productIds: [74],
                },
                {
                    solutionName: '验配',
                    solutionIcon: 'assets/img/icon_hat.png',
                    productIds: [3,8],
                },
                {
                    solutionName: '售后服务',
                    solutionIcon: 'assets/img/icon_earmuff.png',
                    productIds: [48,12,53],
                },
                {
                    solutionName: '市场用具',
                    solutionIcon: 'assets/img/icon_earmuff.png',
                    productIds: [5,16,75,76,77,78,79,80,81],
                },
                {
                    solutionName: '配件耗材',
                    solutionIcon: 'assets/img/icon_earmuff.png',
                    productIds: [18,19,6,54,55,22,59,64, 17,99,100,101,102,103],
                },
            ],
            curSolutionList: [],
            productList: [],
            curProductList: [],
            showInstruction: false,
        }
    },
    created() {
        let _pub = window.$pubWin;
        var tempDate = _pub.getStorage('temp-aid-stores-modal') || '';
        var currentDate = new Date().Format("yyyy-MM-dd");
        this.showInstruction = false;// (tempDate != currentDate);
        this.showInstruction = (tempDate != currentDate);

        this.curAlertList = this.sceneList[this.sceneIndex].alertList;
        // let solutionNames = this.curAlertList.map(item => item.solutionName);
        // this.curSolutionList = this.solutionList.filter(item => {
        //     return solutionNames.includes(item.solutionName)
        // });

        var sceneItem = this.sceneList[this.sceneIndex];
        
        this.curSolutionList = this.solutionList.filter(solution => {
            return sceneItem.solutions.includes(solution.solutionName)
        })
        
        this.jieshuoSrc = sceneItem.jieshuo;

        var targetName = '场景页面-冶金-' + sceneItem.name;
        typeof addClabTrackerCommon == 'function' && addClabTrackerCommon(targetName);

        var pageSearch = '?scene=' + sceneItem.tour + '&sceneIndex=' + this.sceneIndex;
        var shareTitle = '3M个人安全防护元宇宙｜冶金-' + sceneItem.name + '作业场景';
        var shareDesc = '沉浸式体验冶金行业解决方案';
        typeof changeURLStatic == 'function' && changeURLStatic(pageSearch, shareTitle, shareDesc);
    },
    mounted() {
        embedpano({
            xml: 'pano/' + initScene,
            target: 'pano',
            html5: 'auto',
            mobilescale: 1.0,
            passQueryParameters: 'startscene,startlookat',
            onready: this.krpanoOnReady,
        });
    },
    methods: {
        onInstructionClick() {
            this.showInstruction = false;
            let _pub = window.$pubWin;
            var currentDate = new Date().Format("yyyy-MM-dd");
            _pub.setStorage('temp-aid-stores-modal', currentDate);
        },
        krpanoOnReady(krpanoInterface) {
            this.krpano = krpanoInterface;
            console.log('krpanoOnReady');
            window.krpano = krpanoInterface.get("global");
        },
        onSceneClick(index) {
            this.curSolutionIndex = -1;
            this.sceneIndex = index;
            let sceneIndex = this.sceneIndex,
                sceneList = this.sceneList,
                curAlertList = sceneList[sceneIndex].alertList,
                productList = this.productList;

            var sceneItem = sceneList[sceneIndex];
            this.krpano.call('loadpano(' + sceneItem.tour + ', null, MERGE, BLEND(1));');
            this.krpano.call('loadscene(' + sceneItem.startScene + ');');
            this.curAlertList = curAlertList;
            // let solutionNames = this.curAlertList.map(item => item.solutionName);
            // this.curSolutionList = this.solutionList.filter(item => {
            //     return solutionNames.includes(item.solutionName)
            // });

            this.curSolutionList = this.solutionList.filter(item => {
                return sceneItem.solutions.includes(item.solutionName)
            })

            this.showAlertBox = false;
            this.showProductModal = false;
            this.showScenePreview = true;
            this.alertIndex = -1;
            this.curProductIndex = 0;
            this.curAlertIndex = 0;
            this.highLightArray = [];

            var title = '场景页面-冶金-' + sceneItem.name;
            var name = '场景页面-冶金-' + sceneItem.name + '-场景切换';
            var attr1 = '冶金-' + sceneItem.name;
            var attr2 = '';
            var targetName = '场景页面-冶金-' + sceneItem.name;
            //typeof addOpenPageEvent == 'function' && addOpenPageEvent(targetName);
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
            var pageSearch = '?scene=' + sceneItem.tour + '&sceneIndex=' + this.sceneIndex;
            var shareTitle = '3M个人安全防护元宇宙｜冶金-' + sceneItem.name + '作业场景';
            var shareDesc = '沉浸式体验冶金行业解决方案';
            typeof changeURLStatic == 'function' && changeURLStatic(pageSearch, shareTitle, shareDesc);

            this.jieshuoSrc = sceneItem.jieshuo;
            jieshuo.pause();
            jieshuo.currentTime = 0;
            onPlayJieshuo();
            // console.log(this.jieshuoSrc + ",allowPlay: " + allowPlay + "，jieshuo pause : " + jieshuo.paused);
        },
        onAlertClick(index) {
            this.alertIndex = index;
            let sceneItem = this.sceneList[this.sceneIndex],
                curAlert = this.curAlertList[index],
                spotArray = curAlert.spotArray,
                highLightArray = this.highLightArray;

            //恢复高亮
            if (highLightArray.length == 0) {
                console.log("没有点亮的");
            } else {
                highLightArray.forEach((item) => {
                    window.krpano.call('resetTooltipsStyle(' + item + ');');
                });
                this.highLightArray = [];
            }
            //高亮显示
            spotArray.forEach((item) => {
                this.highLightArray.push(item);
                window.krpano.call('setTooltipStyle(' + item + ');');
            })

            var title = '场景页面-冶金-' + sceneItem.name;
            var name = '场景页面-冶金-' + sceneItem.name + '-场景危害类型过滤';
            var attr1 = curAlert.name;
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        closeAlertBox() {
            this.showAlertBox = false;

            var sceneItem = this.sceneList[this.sceneIndex];
            var curAlertItem = this.curAlertList[this.curAlertIndex];
            // console.log(">>>", sceneItem, curAlertItem);
            var title = '危害弹框-冶金' + sceneItem.name;
            var name = '危害弹框-冶金-' + sceneItem.name + '-关闭';
            var attr1 = curAlertItem.name;
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onScenePreviewClick() {
            this.showScenePreview = !this.showScenePreview;
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-冶金-' + sceneItem.name;
            var name = '场景页面-冶金-' + sceneItem.name + '-场景选择';
            var attr1 = this.showScenePreview ? '显示' : '隐藏';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        showProductList(index, curSolutionName) {
            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;

            let curAlertIndex = this.curAlertIndex,
                curSolutionIndex = this.curSolutionList.findIndex(item => item.solutionName === curSolutionName);

            this.curSolutionIndex = curSolutionIndex;
            this.curProductList = this.curProductList.filter(item => item.solutionName.includes(curSolutionName));
            this.showProductInfo(0);
            updateSwiper();
            productListSwiper.slideTo(0, 0, false);
            productPreviewSwiper.slideTo(0, 0, false);

            var sceneItem = this.sceneList[this.sceneIndex];
            var curAlertItem = this.curAlertList[this.curAlertIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];

            var pageTitle = '危害弹框-冶金-' + sceneItem.name;
            typeof addOpenPageEvent == 'function' && addOpenPageEvent('防护解决方案弹框-' + curAlertItem.name + '-' + solutionItem.solutionName);

            var title = '危害弹框-冶金-' + sceneItem.name;
            var name = '危害弹框-冶金-' + sceneItem.name + '-查看防护方案';
            var attr1 = solutionItem.solutionName;
            var attr2 = curAlertItem.name;

            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onClickAlertProduct(index){
            let curAlertIndex = this.curAlertIndex,
                curSolutionName = this.curAlertList[curAlertIndex].solutionName,
                curSolutionIndex = this.curSolutionList.findIndex(item => item.solutionName === curSolutionName);
            this.curSolutionIndex = curSolutionIndex;
            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;

            var sceneItem = this.sceneList[this.sceneIndex];
            var curAlertItem = this.curAlertList[this.curAlertIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var productItem = this.curProductList[index];
            var sceneName = sceneItem.name;

            var title = '危害弹框-冶金-' + sceneName;
            var name = '危害弹框-冶金-' + sceneName + '-查看产品详情';
            var attr1 = curAlertItem.name;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);

            var pageTitle = '危害弹框-冶金-' + sceneName;
            typeof addOpenPageEvent == 'function' && addOpenPageEvent('防护解决方案弹框-' + curAlertItem.name + '-' + solutionItem.solutionName);

            this.showProductInfo(index);
            setTimeout(() => {
                updateSwiper();
                productListSwiper.slideTo(index, 0, false);
                productPreviewSwiper.slideTo(index, 0, false);
            }, 100);
        },
        showProductInfoById(id) {
            var product = this.productMap.get(id);
            //通过productId 获取当前解决方案
            var curSolution = this.curSolutionList.find(item => {
                return item.productIds.includes(parseInt(product.id));
            });
            this.curSolutionIndex = this.curSolutionList.indexOf(curSolution);

            this.curProductList = [];
            curSolution.productIds.forEach(id => {
                this.curProductList.push(this.productMap.get(id))
            })

            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;
            
            //遍历curProductList 如果id相同就 返回index
            let index = this.curProductList.findIndex(item => parseInt(item.id) === id);
            this.showProductInfo(index);
            productListSwiper.slideTo(index, 0, false);
            productPreviewSwiper.slideTo(index, 0, false);
        },
        showProductInfo(index) {
            this.curProductIndex = index;
            let curProductList = this.curProductList,
                curProductIndex = this.curProductIndex;

            if (curProductList[curProductIndex].product360) {
                let src = curProductList[curProductIndex].product360.src,
                    num = curProductList[curProductIndex].product360.num;
                console.log(src, num);
                setTimeout(function () {
                    showProduct(src, num, 'productImgList-' + curProductIndex);
                }, 100)
            }
            updateSwiper();
        },
        onProductClick(index) {
            this.showProductInfo(index);
            var sceneItem = this.sceneList[this.sceneIndex];
            var productItem = this.curProductList[this.curProductIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var title = '防护解决方案弹框-冶金-' + sceneItem.name;
            var name = '防护解决方案弹框-冶金-' + sceneItem.name + '-产品切换';
            var attr1 = sceneItem.name + '厂' + solutionItem.solutionName + '解决方案';
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onClickSolution(index) {
            this.curSolutionIndex = index;

            let sceneIndex = this.sceneIndex,
                curAlertIndex = this.curAlertIndex,
                curSolution = this.curSolutionList[this.curSolutionIndex];

            // this.curProductList = this.productList.filter(item => {
            //     return item.sceneName.includes(sceneName) && item.solutionName.includes(curSolution.solutionName)
            // })
            
            this.curProductList = [];
            curSolution.productIds.forEach(id => {
                this.curProductList.push(this.productMap.get(id))
            })

            curAlertIndex = this.curAlertList.findIndex(item => item.solutionName === curSolution.solutionName);
            this.curAlertIndex = curAlertIndex;
            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;
            this.showProductInfo(0);
            updateSwiper();
            productListSwiper.slideTo(0, 0, false);
            productPreviewSwiper.slideTo(0, 0, false);

            var sceneItem = this.sceneList[this.sceneIndex];
            var solutionItem = curSolution;

            var title = '场景页面-冶金-' + sceneItem.name;
            var name = '场景页面-冶金-' + sceneItem.name + '-安全解决方案';
            var attr1 = solutionItem.solutionName;
            var attr2 = '';

            typeof addOpenPageEvent == 'function' && addOpenPageEvent(title + '-防护解决方案弹框-' + solutionItem.solutionName);
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onCloseProductModal() {
            this.showProductModal = false;
            this.showScenePreview = true;
            var sceneItem = this.sceneList[this.sceneIndex];
            var curProductList = this.curProductList;
            var curProductIndex = this.curProductIndex;
            var productItem =curProductList[curProductIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            // console.log(">>>>", solutionItem, productItem)
            var title = '防护解决方案弹框-冶金-' + sceneItem.name;
            var name = '防护解决方案弹框-冶金-' + sceneItem.name + '-关闭';
            var attr1 = solutionItem.solutionName;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);

            this.curSolutionIndex = -1;
        },
        goBack() {
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-冶金-' + sceneItem.name;
            var name = '场景页面-冶金-' + sceneItem.name + '-返回';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2, function () {
                history.go(-1);
            });
        },
        goGame() {
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-冶金-' + sceneItem.name;
            var name = '场景页面-冶金-' + sceneItem.name + '-3M虚拟空间';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2, function () {
                location.href = '../Game/index.html';
            });
        },
        goContenthub() {
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-冶金-' + sceneItem.name;
            var name = '场景页面-冶金-' + sceneItem.name + '-留资';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onProductLinkClick(index) {
            var sceneItem = this.sceneList[this.sceneIndex];
            var curProductList = this.curProductList;
            var curProductIndex = this.curProductIndex;
            var productItem = curProductList[curProductIndex];
            var productLink = productItem.productLink[index];
            var title = '防护解决方案弹框-冶金-' + sceneItem.name;
            var name = '防护解决方案弹框-冶金-' + sceneItem.name + '-查看详情';
            var attr1 = productLink.text;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
    },
})

const vm = app.mount("#app");


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
    initClick();
});