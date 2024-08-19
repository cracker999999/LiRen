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
            sceneIndex, // 左侧功能按钮选中的索引
            alertIndex: -1, // 解决方案按钮索引
            curSolutionIndex: -1, // 右侧危害索引
            curProductIndex: 0,//产品索引
            productType: 0,//产品类型索引
            showScenePreview: true,
            showDamageModal: false,
            showProductModal: false,
            jieshuoSrc: '',
            highLightArray: [],
            sceneList: [
                {
                    name: '政府',
                    previewImg: '../scene_preview/scene_zhengfu.png',
                    tour: 'tour0.xml?v20231211',
                    startScene: 'scene_0',
                    jieshuo: '../jieshuo/ZhengFuJiSheHuiZuZhi_ZhengFu.mp3',
                    solutions: ['产品供应 '],
                },
                {
                    name: '移动服务听力车',
                    previewImg: '../scene_preview/scene_yidongcetingchefuwuchangjing.png',
                    tour: 'tour1.xml?v20231211',
                    startScene: 'scene_1',
                    jieshuo: '../jieshuo/TingLiChe.mp3',
                    solutions: ['测听','验配','售后服务','市场用具','配件耗材'],
                },
                {
                    name: '社会组织',
                    previewImg: '../scene_preview/scene_shehuizuzhi.png',
                    tour: 'tour2.xml?v20231211',
                    startScene: 'scene_2',
                    jieshuo: '../jieshuo/ZhengFuJiSheHuiZuZhi_SheHuiZuZhi.mp3',
                    solutions: ['健康服务','产品供应'],
                },
                {
                    name: '高校及科研院所',
                    previewImg: '../scene_preview/scene_gaoxiaojikeyanyuansuo.png',
                    tour: 'tour3.xml?v20231211',
                    startScene: 'scene_3',
                    jieshuo: '../jieshuo/ZhengFuJiSheHuiZuZhi_GaoXiaoJiKeYanChangSuo.mp3',
                    solutions: ['科研场景','教培场景'],
                }
            ],
            alertList: [],
            curAlertIndex: 0,
            curAlertList: [],

            solutionList: [
                {
                    solutionName: '产品供应 ',
                    solutionIcon: 'assets/img/ChanPinGongYing.png?v20230222',
                    productIds: [96,3,40,49],
                },
                {
                    solutionName: '健康服务',
                    solutionIcon: 'assets/img/JianKangFuWu.png?v20230222',
                    productIds: [52,14,28,74,37],
                },
                {
                    solutionName: '产品供应',
                    solutionIcon: 'assets/img/ChanPinGongYing.png?v20230222',
                    productIds: [49,96],
                },
                {
                    solutionName: '科研场景',
                    solutionIcon: 'assets/img/KeYanChangJing.png?v20230222',
                    productIds: [26,57,45,93,62],
                },
                {
                    solutionName: '教培场景',
                    solutionIcon: 'assets/img/JiaoPeiChangJing.png?v20230222',
                    productIds: [97,98],
                },
                //听力车
                {
                    solutionName: '测听',
                    solutionIcon: 'assets/img/CeTing.png',
                    productIds: [74],
                },
                {
                    solutionName: '验配',
                    solutionIcon: 'assets/img/YanPei.png',
                    productIds: [3,8],
                },
                {
                    solutionName: '售后服务',
                    solutionIcon: 'assets/img/ShouHouFuwu.png',
                    productIds: [48,12,53],
                },
                {
                    solutionName: '市场用具',
                    solutionIcon: 'assets/img/ShiChangYongJu.png',
                    productIds: [5,16,75,76,77,78,79,80,81],
                },
                {
                    solutionName: '配件耗材',
                    solutionIcon: 'assets/img/PeiJianHaoCai.png',
                    productIds: [18,19,6,54,55,22,59,64, 17,99,100,101,102,103],
                },
            ],
            curSolutionList: [],

            productList: [],
            curProductList: [],
            curProductTypeIndex: 0,

            productTypeList: [
                {
                    name: '锚点连接件',
                    icon: 'assets/img/icon_maodian.png?v20230620',
                    text: '可以选择单个锚点或水平生命线。',
                    img: 'assets/img/damage_pandeng.png'
                },
                {
                    name: '安全带',
                    icon: 'assets/img/icon_anquandai.png?v20230620',
                    text: '按照作业类型选择适用的安全带：限位、定位、坠落制动。',
                    img: 'assets/img/damage_pandeng2.png'
                },
                {
                    name: '连接件',
                    icon: 'assets/img/icon_lianjiejian.png?v20230620',
                    text: '优先选择限位方案；其次考虑坠落制动：缓冲安全绳或临边速差器。',
                    img: 'assets/img/damage_pandeng.png'
                },
            ],
            curProductTypeList: [],
            showInstruction: true,
        }
    },
    created() {
        console.log('created');
        
        let _pub = window.$pubWin;
        var tempDate = _pub.getStorage('temp-gov-social-orgs-modal') || '';
        var currentDate = new Date().Format("yyyy-MM-dd");
        this.showInstruction = false;// (tempDate != currentDate);
        this.showInstruction = (tempDate != currentDate);

        var sceneItem = this.sceneList[this.sceneIndex];

        let alertList = this.alertList,
            curAlertList;

        
        this.curAlertList = curAlertList;

        this.curSolutionList = this.solutionList.filter(solution => {
            return sceneItem.solutions.includes(solution.solutionName)
        })
        
        this.jieshuoSrc = sceneItem.jieshuo;

        // this.curProductTypeList = this.curAlertList[this.curAlertIndex].productTypeList;
        // this.curProductList = this.productList;
        
        var targetName = '场景页面-建筑-' + sceneItem.name;
        typeof addClabTrackerCommon == 'function' && addClabTrackerCommon(targetName);

        var pageSearch = '?scene=' + sceneItem.tour + '&sceneIndex=' + this.sceneIndex;
        var shareTitle = '3M个人安全防护元宇宙｜建筑-' + sceneItem.name + '作业场景';
        var shareDesc = '沉浸式体验建筑行业解决方案';
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
            _pub.setStorage('temp-gov-social-orgs-modal', currentDate);
        },
        krpanoOnReady(krpanoInterface) {
            this.krpano = krpanoInterface;
            console.log('krpanoOnReady');
            window.krpano = krpanoInterface.get("global");
        },
        onSceneClick(index) {
            this.sceneIndex = index;
            hideSolution();
            this.newProductList = this.productList;
            this.curSolutionIndex = -1;
            this.alertIndex = -1;
            this.curAlertIndex = 0;
            this.curProductIndex = 0;
            this.productType = 0;
            this.curProductTypeIndex = 0;
            this.highLightArray = [];

            var sceneItem = this.sceneList[this.sceneIndex];
            let alertList = this.alertList,
                curAlertList = this.curAlertList,
                productList = this.productList;
            this.krpano.call('loadpano(' + sceneItem.tour + ', null, MERGE, BLEND(1));');
            this.krpano.call('loadscene(' + sceneItem.startScene + ');');
            // console.log("场景名：", this.sceneIndex, sceneItem.name);
            // console.log("现有作业：", curAlertList);

            this.curSolutionList = this.solutionList.filter(item => {
                return sceneItem.solutions.includes(item.solutionName)
            })

            var title = '场景页面-建筑-' + sceneItem.name;
            var name = '场景页面-建筑-' + sceneItem.name + '-场景切换';
            var attr1 = '建筑-' + sceneItem.name;
            var attr2 = '';
            var targetName = '场景页面-建筑-' + sceneItem.name;
            //typeof addOpenPageEvent == 'function' && addOpenPageEvent(targetName);
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
            var pageSearch = '?scene=' + sceneItem.tour + '&sceneIndex=' + this.sceneIndex;
            var shareTitle = '3M个人安全防护元宇宙｜建筑-' + sceneItem.name + '作业场景';
            var shareDesc = '沉浸式体验建筑行业解决方案';
            typeof changeURLStatic == 'function' && changeURLStatic(pageSearch, shareTitle, shareDesc);

            this.curAlertList = curAlertList;
            this.jieshuoSrc = sceneItem.jieshuo;
            jieshuo.pause();
            jieshuo.currentTime = 0;
            onPlayJieshuo();
            // console.log(this.jieshuoSrc + ",allowPlay: " + allowPlay + "，jieshuo pause : " + jieshuo.paused);
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


            var title = '场景页面-建筑-' + sceneItem.name;
            var name = '场景页面-建筑-' + sceneItem.name + '-场景危害类型过滤';
            var attr1 = alertItem.name;
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);

        },
        onScenePreviewClick() {
            this.showScenePreview = !this.showScenePreview;
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-建筑-' + sceneItem.name;
            var name = '场景页面-建筑-' + sceneItem.name + '-场景选择';
            var attr1 = this.showScenePreview ? '显示' : '隐藏';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        showProductList(modalType) {
            this.showDamageModal = false;
            this.showProductModal = true;
            let newProductList = this.newProductList,
                curAlertList = this.curAlertList,
                curAlertIndex = this.curAlertIndex,
                curAlert = curAlertList[curAlertIndex],
                curProductTypeList = this.curProductTypeList,
                curProductTypeIndex = this.curProductTypeIndex,
                curProductType = curProductTypeList[curProductTypeIndex].name;

            updateSwiper();
            productListSwiper.slideTo(0, 0, false);
            productPreviewSwiper.slideTo(0, 0, false);
            // console.log(this.curProductList);

            var sceneItem = this.sceneList[this.sceneIndex];
            var curProductTypeItem = this.curProductTypeList[this.curProductTypeIndex];
            var title = '';
            var name = '';
            var attr1 = curProductTypeItem.name;
            var attr2 = curAlert.name;
            switch (modalType) {
                case 2:
                    title = '危害弹框-建筑-' + sceneItem.name;
                    name = '危害弹框-建筑-' + sceneItem.name + '-查看产品';
                    typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);

                    var solutionItem = sceneItem.solutionList[this.curSolutionIndex];
                    var pageTitle = '危害弹框-建筑-' + sceneItem.name;
                    typeof addOpenPageEvent == 'function' && addOpenPageEvent('防护解决方案弹框-' + curAlert.name + '-' + solutionItem.solutionName);
    
                    break;

            }
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
            this.curProductIndex = index;
            let curProductList = this.curProductList,
                curProductIndex = this.curProductIndex;
            if (curProductList[curProductIndex].product360) {
                let src = curProductList[curProductIndex].product360.src,
                    num = curProductList[curProductIndex].product360.num;
                console.log(src, num);
                setTimeout(function () {
                    showProduct(src, num, 'productImgList-' + productId);
                }, 100)
            }
            updateSwiper();
            var sceneItem = this.sceneList[this.sceneIndex];

            var productItem = curProductList[this.curProductIndex];
            var title = '防护解决方案弹框-建筑-' + sceneItem.name;
            var name = '防护解决方案弹框-建筑-' + sceneItem.name + '-产品切换';
            var attr1 = productItem.type;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);

        },
        onClickSolution(index) {
            this.curSolutionIndex = index;
            this.productType = index;
            this.curProductIndex = 0;
            this.curProductTypeIndex = 0;
            this.newProductList = this.productList;

            let curSolution = this.curSolutionList[this.curSolutionIndex];
            this.curProductList = [];
            curSolution.productIds.forEach(id => {
                this.curProductList.push(this.productMap.get(id))
            })
            
            var sceneItem = this.sceneList[this.sceneIndex];
            
            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;
            this.showProductInfo(0);
            updateSwiper();
            productListSwiper.slideTo(0, 0, false);
            productPreviewSwiper.slideTo(0, 0, false);

            var title = '场景页面-建筑-' + sceneItem.name;
            var name = '场景页面-建筑-' + sceneItem.name + '-安全解决方案';
            var attr1 = curSolution.solutionName;
            var attr2 = '';

            typeof addOpenPageEvent == 'function' && addOpenPageEvent(title + '-防护解决方案弹框-' + curSolution.name);
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
    
        onClickProductType(index, modalType) {
            this.curProductTypeIndex = index;
            this.curProductIndex = 0;

            let sceneList = this.sceneList,
                curAlert = this.curAlertList[this.curAlertIndex],
                curProductTypeList = curAlert.productTypeList,
                curProductType = curProductTypeList[index].name;

            this.curProductTypeList = curProductTypeList;

            
            updateSwiper();
            productListSwiper.slideTo(0, 0, false);
            productPreviewSwiper.slideTo(0, 0, false);
            
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '';
            var name = '';
            var attr1 = curProductType;
            var attr2 = '';
            switch (modalType) {
                case 1:
                    title = '防护解决方案弹框-建筑-' + sceneItem.name;
                    name = '防护解决方案弹框-建筑-' + sceneItem.name + '-产品分类切换';
                    typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
                    break;
                case 2:
                    title = '危害弹框-建筑-' + sceneItem.name;
                    name = '危害弹框-建筑-' + sceneItem.name + '-产品分类切换';
                    typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
                    break;
            }

        },
        onCloseDamageModal() {
            this.showDamageModal = false;
            this.showScenePreview = true;
            var sceneItem = this.sceneList[this.sceneIndex];
            var curProductTypeItem = this.curProductTypeList[this.curProductTypeIndex]
            var title = '危害弹框-建筑' + sceneItem.name;
            var name = '危害弹框-建筑-' + sceneItem.name + '-关闭';
            var attr1 = curProductTypeItem.name;
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        goBack() {
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-建筑-' + sceneItem.name;
            var name = '场景页面-建筑-' + sceneItem.name + '-返回';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2, function () {
                history.go(-1);
            });
        },
        goGame() {
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-建筑-' + sceneItem.name;
            var name = '场景页面-建筑-' + sceneItem.name + '-3M虚拟空间';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2, function () {
                location.href = '../Game/index.html';
            });
        },
        goContenthub() {
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-建筑-' + sceneItem.name;
            var name = '场景页面-建筑-' + sceneItem.name + '-留资';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onProductLinkClick(index) {
            var sceneItem = this.sceneList[this.sceneIndex];
            var productItem = this.curProductList[this.curProductIndex];

            var productLink = productItem.productLink[index];
            var title = '防护解决方案弹框-建筑-' + sceneItem.name;
            var name = '防护解决方案弹框-建筑-' + sceneItem.name + '-查看详情';
            var attr1 = productItem.type;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        goJD(index) {
            var sceneItem = this.sceneList[this.sceneIndex];
            var productItem = this.curProductList[this.curProductIndex];

            var productLink = productItem.productLink[index];
            var title = '防护解决方案弹框-建筑-' + sceneItem.name;
            var name = '防护解决方案弹框-建筑-' + sceneItem.name + '-去商城看看';
            var attr1 = productItem.type;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onCloseProductModal() {
            this.showProductModal = false;
            this.showScenePreview = true;
            
            var sceneItem = this.sceneList[this.sceneIndex];
            var productItem = this.curProductList[this.curProductIndex];
            var title = '防护解决方案弹框-建筑-' + sceneItem.name;
            var name = '防护解决方案弹框-建筑-' + sceneItem.name + '-关闭';
            var attr1 = productItem.type;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
    },
})

const vm = app.mount("#app");
