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
            productType: 0,//产品类型索引
            showScenePreview: true,
            showAlertBox: false,
            showProductModal: false,
            jieshuoSrc: '',
            highLightArray: [],
            sceneList: [
                {
                    name: '听力中心',
                    previewImg: '../scene_preview/scene_tinglizhongxin.png',
                    tour: 'tour0.xml?v20231211',
                    startScene: 'scene_0',
                    alertList: [],
                    jieshuo: '../jieshuo/DaJianKangHangYeJiGou_TingLiZhongXin.mp3',
                    solutions: ['测听','验配','售后服务','市场用具','配件耗材'],
                },
                {
                    name: '药房',
                    previewImg: '../scene_preview/scene_yaofang.png',
                    tour: 'tour1.xml?v20231211',
                    startScene: 'scene_1',
                    alertList: [],
                    jieshuo: '../jieshuo/DaJianKangHangYeJiGou_YaoDian.mp3',
                    solutions: ['测听','验配','售后服务','市场用具','配件耗材'],
                },
                // {
                //     name: '眼镜门店场景',
                //     previewImg: '../scene_preview/scene_yaofang.png',
                //     tour: 'tour1.xml?v20231211',
                //     startScene: 'scene_1',
                //     alertList: [],
                //     jieshuo: '../jieshuo/ZhuTingQiLianSuoMenDian_ErBaoJianJianCha.mp3',
                //     solutions: ['测听','验配','售后服务','市场用具','配件耗材'],
                // },
                
                // {
                //     name: '采耳店',
                //     previewImg: '../scene_preview/scene_yaofang.png',
                //     tour: 'tour3.xml?v20231211',
                //     startScene: 'scene_3',
                //     alertList: [],
                //     jieshuo: '../jieshuo/ZhuTingQiLianSuoMenDian_ErBaoJianJianCha.mp3',
                //     solutions: ['测听','验配','售后服务','市场用具','配件耗材'],
                // },
            ],
            curAlertIndex: 0,
            curAlertList: [],
            solutionList: [
                {
                    solutionName: '测听',
                    solutionIcon: 'assets/img/CeTing.png',
                    productIds: [49,74],
                },
                {
                    solutionName: '验配',
                    solutionIcon: 'assets/img/YanPei.png',
                    productIds: [3,28,8,86,40],
                },
                {
                    solutionName: '售后服务',
                    solutionIcon: 'assets/img/ShouHouFuWu.png',
                    productIds: [48,12,53,41],
                },
                {
                    solutionName: '市场用具',
                    solutionIcon: 'assets/img/ShiChangYongJu.png',
                    productIds: [5,16,27],
                },
                {
                    solutionName: '配件耗材',
                    solutionIcon: 'assets/img/PeiJianHaoCai.png',
                    productIds: [17,18,19,6,54,55,22,59,64,44,87],
                },
            ],
            curSolutionList: [],
            productList: [],
            curProductList: [],
            showInstruction: true,
        }
    },
    created() {
        let _pub = window.$pubWin;
        var tempDate = _pub.getStorage('temp-big-health-modal') || '';
        var currentDate = new Date().Format("yyyy-MM-dd");
        this.showInstruction = false;// (tempDate != currentDate);
        this.showInstruction = (tempDate != currentDate);

        this.curAlertList = this.sceneList[this.sceneIndex].alertList;
        // let solutionNames = this.curAlertList.flatMap(alertItem =>
        //     alertItem.alertInfos.map(alertInfo => alertInfo.solutionName)
        // );
        // this.curSolutionList = this.solutionList.filter(item => {
        //     return solutionNames.includes(item.solutionName)
        // })
        var sceneItem = this.sceneList[this.sceneIndex];

        this.curSolutionList = this.solutionList.filter(solution => {
            return sceneItem.solutions.includes(solution.solutionName)
        })

        this.jieshuoSrc = sceneItem.jieshuo;

        var targetName = '场景页面-汽车-' + sceneItem.name;
        typeof addClabTrackerCommon == 'function' && addClabTrackerCommon(targetName);

        var pageSearch = '?scene=' + sceneItem.tour + '&sceneIndex=' + this.sceneIndex;
        var shareTitle = '3M个人安全防护元宇宙｜汽车-' + sceneItem.name + '作业场景';
        var shareDesc = '沉浸式体验汽车行业解决方案';
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
            _pub.setStorage('temp-big-health-modal', currentDate);
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

            var sceneItem = this.sceneList[this.sceneIndex];
            this.krpano.call('loadpano(' + sceneItem.tour + ', null, MERGE, BLEND(1));');
            this.krpano.call('loadscene(' + sceneItem.startScene + ');');

            this.curAlertList = curAlertList;
            // let solutionNames = this.curAlertList.flatMap(alertItem =>
            //     alertItem.alertInfos.map(alertInfo => alertInfo.solutionName)
            // );
            // this.curSolutionList = this.solutionList.filter(item => {
            //     return solutionNames.includes(item.solutionName)
            // })

            this.curSolutionList = this.solutionList.filter(item => {
                return sceneItem.solutions.includes(item.solutionName)
            })

            this.showAlertBox = false;
            this.showProductModal = false;
            this.showScenePreview = true;
            this.alertIndex = -1;
            this.curProductIndex = 0;
            this.curAlertIndex = 0;
            this.productType = 0;
            this.curProductTypeIndex = 0;
            this.highLightArray = [];

            var title = '场景页面-汽车-' + sceneItem.name;
            var name = '场景页面-汽车-' + sceneItem.name + '-场景切换';
            var attr1 = '汽车-' + sceneItem.name;
            var attr2 = '';
            var targetName = '场景页面-汽车-' + sceneItem.name;
            //typeof addOpenPageEvent == 'function' && addOpenPageEvent(targetName);
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
            var pageSearch = '?scene=' + sceneItem.tour + '&sceneIndex=' + this.sceneIndex;
            var shareTitle = '3M个人安全防护元宇宙｜汽车-' + sceneItem.name + '作业场景';
            var shareDesc = '沉浸式体验汽车行业解决方案';
            typeof changeURLStatic == 'function' && changeURLStatic(pageSearch, shareTitle, shareDesc);

            
            console.log("当前场景：" + sceneList[sceneIndex].name);
            console.log("危害点：", this.curAlertList);
            this.jieshuoSrc = sceneItem.jieshuo;
            jieshuo.pause();
            jieshuo.currentTime = 0;
            onPlayJieshuo();
        },
        onAlertClick(index) {
            this.alertIndex = index;
            let sceneItem = this.sceneList[this.sceneIndex],
                alertItem = this.curAlertList[index],
                spotArray = alertItem.spotArray,
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

            var title = '场景页面-汽车-' + sceneItem.name;
            var name = '场景页面-汽车-' + sceneItem.name + '-场景危害类型过滤';
            var attr1 = alertItem.name;
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);

        },
        goBack() {
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-汽车-' + sceneItem.name;
            var name = '场景页面-汽车-' + sceneItem.name + '-返回';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2, function () {
                history.go(-1);
            });
        },
        goGame() {
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-汽车-' + sceneItem.name;
            var name = '场景页面-汽车-' + sceneItem.name + '-3M虚拟空间';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2, function () {
                location.href = '../Game/index.html';
            });
        },
        goContenthub() {
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-汽车-' + sceneItem.name;
            var name = '场景页面-汽车-' + sceneItem.name + '-留资';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        closeAlertBox() {
            this.showAlertBox = false;

            var sceneItem = this.sceneList[this.sceneIndex];
            var curAlertItem = this.curAlertList[this.curAlertIndex];

            var title = '危害弹框-汽车-' + sceneItem.name;
            var name = '危害弹框-汽车-' + sceneItem.name + '-关闭';
            var attr1 = curAlertItem.name;
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onScenePreviewClick() {
            this.showScenePreview = !this.showScenePreview;

            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-汽车-' + sceneItem.name;
            var name = '场景页面-汽车-' + sceneItem.name + '-场景选择';
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

            var pageTitle = '危害弹框-汽车-' + sceneItem.name;
            typeof addOpenPageEvent == 'function' && addOpenPageEvent('防护解决方案弹框-' + curAlertItem.name + '-' + solutionItem.solutionName);

            var title = '危害弹框-汽车-' + sceneItem.name;
            var name = '危害弹框-汽车-' + sceneItem.name + '-查看防护方案';
            var attr1 = solutionItem.solutionName;
            var attr2 = curAlertItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onClickAlertProduct(index, productIndex) {
            console.log(">>>" + index + ",productIndex>>>" + productIndex);
            let curAlertIndex = this.curAlertIndex,
                curAlertList = this.curAlertList,
                curAlertInfos = curAlertList[curAlertIndex].alertInfos[index],
                curProductList = curAlertInfos.productList,
                curSolutionName = curAlertInfos.solutionName,
                curSolutionList = this.curSolutionList,
                curSolutionIndex = curSolutionList.findIndex(item => item.solutionName === curSolutionName);
            this.curSolutionIndex = curSolutionIndex;
            this.curProductList = curProductList;
            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;

            var sceneItem = this.sceneList[this.sceneIndex];
            var curAlertItem = this.curAlertList[this.curAlertIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var productItem = this.curProductList[index];
            var sceneName = sceneItem.name;

            var title = '危害弹框-汽车-' + sceneName;
            var name = '危害弹框-汽车-' + sceneName + '-查看产品详情';
            var attr1 = curAlertItem.name;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);

            var pageTitle = '危害弹框-汽车-' + sceneName;
            typeof addOpenPageEvent == 'function' && addOpenPageEvent('防护解决方案弹框-' + curAlertItem.name + '-' + solutionItem.solutionName);


            this.showProductInfo(productIndex);
            setTimeout(() => {
                updateSwiper();
                productListSwiper.slideTo(productIndex, 0, false);
                productPreviewSwiper.slideTo(productIndex, 0, false);
            }, 100)
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
            var title = '防护解决方案弹框-汽车-' + sceneItem.name;
            var name = '防护解决方案弹框-汽车-' + sceneItem.name + '-产品切换';
            var attr1 = solutionItem.solutionName;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onClickSolution(index) {
            this.curSolutionIndex = index;

            let sceneIndex = this.sceneIndex,
                sceneList = this.sceneList,
                curSolution = this.curSolutionList[this.curSolutionIndex];
            
            // this.curProductList = this.productList.filter(item => {
            //     return item.sceneName.includes(sceneName) && item.solutionName.includes(curSolution.solutionName)
            // })

            this.curProductList = [];
            curSolution.productIds.forEach(id => {
                this.curProductList.push(this.productMap.get(id))
            })

            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;
            this.showProductInfo(0);
            updateSwiper();
            productListSwiper.slideTo(0, 0, false);
            productPreviewSwiper.slideTo(0, 0, false);
            console.log("当前解决方案：", curSolution.solutionName);
            console.log("当前产品列表：", this.curProductList);

            var sceneItem = this.sceneList[this.sceneIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var title = '场景页面-汽车-' + sceneItem.name;
            var name = '场景页面-汽车-' + sceneItem.name + '-安全解决方案';
            var attr1 = solutionItem.solutionName;
            var attr2 = '';

            typeof addOpenPageEvent == 'function' && addOpenPageEvent(title + '-防护解决方案弹框-' + solutionItem.solutionName);
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onProductLinkClick(index) {
            var sceneItem = this.sceneList[this.sceneIndex];
            var productItem = this.curProductList[this.curProductIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var productLink = productItem.productLink[index];
            var title = '防护解决方案弹框-汽车-' + sceneItem.name;
            var name = '防护解决方案弹框-汽车-' + sceneItem.name + '-查看详情';
            var attr1 = solutionItem.solutionName;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        goJD(index) {
            var sceneItem = this.sceneList[this.sceneIndex];
            var productItem = this.curProductList[this.curProductIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var productLink = productItem.productLink[index];
            var title = '防护解决方案弹框-汽车-' + sceneItem.name;
            var name = '防护解决方案弹框-汽车-' + sceneItem.name + '-去商城看看';
            var attr1 = solutionItem.solutionName;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onCloseProductModal() {
            this.showProductModal = false;
            this.showScenePreview = true;

            var sceneItem = this.sceneList[this.sceneIndex];
            var productItem = this.curProductList[this.curProductIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var title = '防护解决方案弹框-汽车-' + sceneItem.name;
            var name = '防护解决方案弹框-汽车-' + sceneItem.name + '-关闭';
            var attr1 = solutionItem.solutionName;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);

            this.curSolutionIndex = -1;
        },
    },
})

const vm = app.mount("#app");