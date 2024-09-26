/// <reference path="../../js/common.js" />
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
            showAlertBox: false, //pointDisplay.js中设为true
            showDamageModal: false,
            showProductModal: false, //显示产品弹窗
            jieshuoSrc: '',
            curHotspot: '',
            highLightArray: [],
            sceneList: [
                {
                    name: '制程',
                    previewImg: '../scene_preview/scene_zhicheng.png', // 下方预览图
                    tour: 'tour0.xml?v20231211',
                    startScene: 'scene_0', // 解决方案按钮
                    jieshuo: '../jieshuo/ZhuTingQiZhiZaoShang_ZhiCheng.mp3',
                    solutions: ['3D制造'],
                    alertList: [],
                },
                {
                    name: '移动测听车服务场景',
                    previewImg: '../scene_preview/scene_yidongcetingchefuwuchangjing.png',
                    tour: 'tour1.xml?v20231211',
                    startScene: 'scene_1',
                    jieshuo: '../jieshuo/TingLiChe.mp3',
                    solutions: ['测听','验配','售后服务','市场用具','配件耗材'],
                    alertList: [],
                },
                {
                    name: '配套方案',
                    previewImg: '../scene_preview/scene_peitaofangan.png',
                    tour: 'tour2.xml?v20231211',
                    startScene: 'scene_2',
                    jieshuo: '../jieshuo/ZhuTingQiZhiZaoShang_PeiTaoFangAn.mp3',
                    solutions: ['生产','市场','助听器产品'],
                    alertList: [],
                },
            ],
            curAlertIndex: 0,
            curAlertList: [],
            solutionList: [ //该版块所有的解决方案
                {
                    solutionName: '3D制造',
                    solutionIcon: 'assets/img/3DZhiZao.png',
                    productIds: [1,2],
                },
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
                    solutionIcon: 'assets/img/ShouHouFuWu.png',
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
                {
                    solutionName: '生产',
                    solutionIcon: 'assets/img/ShengChan.png',
                    productIds: [56,57,13,26],
                },
                {
                    solutionName: '市场',
                    solutionIcon: 'assets/img/ShiChang.png',
                    productIds: [19,48,12, 16,75,76,77,78,79,80,81, 27, 3,14,28, 18,82],
                },
                {
                    solutionName: '助听器产品',
                    solutionIcon: 'assets/img/ZhuTingQiBiaoPeiChanPin.png',
                    productIds: [29,30,6,55,63, 29,30,6,58],
                },
            ],
            curSolutionList: [], //当前场景的解决方案
            productList: [], //从配置读取
            curProductList: [], // 单个解决方案下的产品列表
            curProductTypeIndex: 0,
            productTypeList: [ // 产品页面的左侧分类
                {
                    name: '锚点连接件',
                    icon: 'assets/img/icon_maodian.png?v20230904',
                },
                {
                    name: '安全带',
                    icon: 'assets/img/icon_anquandai.png?v20230904',
                },
                {
                    name: '连接件',
                    icon: 'assets/img/icon_lianjiejian.png?v20230904',
                },
                {
                    name: '水平生命线',
                    icon: 'assets/img/icon_shuipingshengmingxian.png',
                },
                {
                    name: '呼吸',
                    icon: 'assets/img/icon_huxi.png',
                },
            ],
            curProductTypeList: [],
            showInstruction: false,
        }
    },
    created() {
        let _pub = window.$pubWin;
        var tempDate = _pub.getStorage('temp-aid-makers-modal') || '';
        var currentDate = new Date().Format("yyyy-MM-dd");
        this.showInstruction = false;// (tempDate != currentDate);
        this.showInstruction = (tempDate != currentDate);

        var sceneItem = this.sceneList[this.sceneIndex];

        //当前场景的alert
        this.curAlertList = this.sceneList[this.sceneIndex].alertList;
        //把字段solutionName搞到一个新array
        // let solutionNames = this.curAlertList.map(item => item.solutionName);
        //从所有的解决方案里面筛选出 当前场景的解决方案
        // this.curSolutionList = this.solutionList.filter(item => {
        //     return solutionNames.includes(item.solutionName)
        // })
        
        //leen+
        this.curSolutionList = this.solutionList.filter(item => {
            return sceneItem.solutions.includes(item.solutionName)
        })

        this.jieshuoSrc = sceneItem.jieshuo;
        
        var targetName = '场景页面-化工-' + sceneItem.name;
        typeof addClabTrackerCommon == 'function' && addClabTrackerCommon(targetName);

        var pageSearch = '?scene=' + sceneItem.tour + '&sceneIndex=' + this.sceneIndex;
        var shareTitle = '3M个人安全防护元宇宙｜化工-' + sceneItem.name + '作业场景';
        var shareDesc = '沉浸式体验化工行业解决方案';
        typeof changeURLStatic == 'function' && changeURLStatic(pageSearch, shareTitle, shareDesc);

        // this.loadProductConfig();
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

    watch:{
        isConfigLoaded(newValue){
            if(newValue){
                this.$nextTick(() => {
                    console.log('isConfigLoaded');
                })
            }
        }
    },
    methods: {
        // loadProductConfig() {
        //     fetch('../product.json')
        //         .then(response => response.json())
        //         .then(data => {
        //             this.productList = data;
        //             console.log('产品总数: '+this.productList.length);

        //             //把productList转成map key为id value为对象
        //             this.productMap = new Map();
        //             this.productList.forEach(item => {
        //                 this.productMap.set(parseInt(item.id), item);
        //             });

        //             this.isConfigLoaded = true;
        //         })
        //         .catch(error => {
        //             console.error('Error loading config:', error);
        //         });
        // },
        onInstructionClick() {
            this.showInstruction = false;
            let _pub = window.$pubWin;
            var currentDate = new Date().Format("yyyy-MM-dd");
            _pub.setStorage('temp-aid-makers-modal', currentDate);
        },
        krpanoOnReady(krpanoInterface) {
            this.krpano = krpanoInterface;
            console.log('krpanoOnReady');
            window.krpano = krpanoInterface.get("global");
        },
        onSceneClick(index) {
            if (index === this.sceneIndex) {
                return;
            }
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
            // let solutionNames = this.curAlertList.map(item => item.solutionName);
            // this.curSolutionList = this.solutionList.filter(item => {
            //     return solutionNames.includes(item.solutionName)
            // })

            //leen+
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

            var title = '场景页面-化工-' + sceneItem.name;
            var name = '场景页面-化工-' + sceneItem.name + '-场景切换';
            var attr1 = '化工-' + sceneItem.name;
            var attr2 = '';
            var targetName = '场景页面-化工-' + sceneItem.name;
            //typeof addOpenPageEvent == 'function' && addOpenPageEvent(targetName);
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
            var pageSearch = '?scene=' + sceneItem.tour + '&sceneIndex=' + this.sceneIndex;
            var shareTitle = '3M个人安全防护元宇宙｜化工-' + sceneItem.name + '作业场景';
            var shareDesc = '沉浸式体验化工行业解决方案';
            typeof changeURLStatic == 'function' && changeURLStatic(pageSearch, shareTitle, shareDesc);

            console.log("当前场景：" + sceneList[sceneIndex].name);
            console.log("危害点：", this.curAlertList);
            this.jieshuoSrc = sceneItem.jieshuo;//leen+
            jieshuo.pause();
            jieshuo.currentTime = 0;
            onPlayJieshuo();
        },
        //点击 右侧竖排按扭
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

            var title = '场景页面-化工-' + sceneItem.name;
            var name = '场景页面-化工-' + sceneItem.name + '-场景危害类型过滤';
            var attr1 = alertItem.name;
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);

        },
        goBack() {
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-化工-' + sceneItem.name;
            var name = '场景页面-化工-' + sceneItem.name + '-返回';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2, function () {
                history.go(-1);
            });
        },
        goGame() {
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-化工-' + sceneItem.name;
            var name = '场景页面-化工-' + sceneItem.name + '-3M虚拟空间';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2, function () {
                location.href = '../Game/index.html';
            });
        },
        //联系我们
        goContenthub() {
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-化工-' + sceneItem.name;
            var name = '场景页面-化工-' + sceneItem.name + '-留资';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        closeAlertBox() {
            this.showAlertBox = false;
            var sceneItem = this.sceneList[this.sceneIndex];
            var curAlertItem = this.curAlertList[this.curAlertIndex];
            console.log(">>>>" + curAlertItem);

            var title = '危害弹框-化工-' + sceneItem.name;
            var name = '危害弹框-化工-' + sceneItem.name + '-关闭';
            var attr1 = curAlertItem.name;
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onScenePreviewClick() {
            this.showScenePreview = !this.showScenePreview;
            var sceneItem = this.sceneList[this.sceneIndex];
            var title = '场景页面-化工-' + sceneItem.name;
            var name = '场景页面-化工-' + sceneItem.name + '-场景选择';
            var attr1 = this.showScenePreview ? '显示' : '隐藏';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        //点击 危害弹窗中的 查看解决方案
        showProductList(index) {
            console.log(index);
            
            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;

            let curAlertIndex = this.curAlertIndex,
                curAlertList = this.curAlertList,
                curSolutionName = curAlertList[curAlertIndex].solutionName,
                curSolutionList = this.curSolutionList,
                curSolutionIndex = curSolutionList.findIndex(item => item.solutionName === curSolutionName),
                curProductList = this.curProductList,
                productTypeList = this.productTypeList,
                curProductTypeList = curProductList.map(item => item.productType);

            console.log('curProductTypeList=>', JSON.stringify(curProductTypeList));
            if(curProductTypeList.length > 0){
                this.curProductList = this.curProductList.filter(item =>{
                    return item.productType === curProductTypeList[0];
                });
            }

            this.curSolutionIndex = curSolutionIndex;
            this.showProductInfo(0);
            updateSwiper();
            productListSwiper.slideTo(0, 0, false);
            productPreviewSwiper.slideTo(0, 0, false);


            var sceneItem = this.sceneList[this.sceneIndex];
            var curAlertItem = this.curAlertList[this.curAlertIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];

            var pageTitle = '危害弹框-化工-' + sceneItem.name;
            typeof addOpenPageEvent == 'function' && addOpenPageEvent('防护解决方案弹框-' + curAlertItem.name + '-' + solutionItem.solutionName);

            var title = '危害弹框-化工-' + sceneItem.name;
            var name = '危害弹框-化工-' + sceneItem.name + '-查看防护方案';
            var attr1 = solutionItem.solutionName;
            var attr2 = curAlertItem.name;

            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        //点击危害弹窗中的某个产品 index为curProductList
        onClickAlertProduct(index) {
            let curAlertIndex = this.curAlertIndex,
                curAlertList = this.curAlertList,
                curSolutionName = curAlertList[curAlertIndex].solutionName,
                curSolutionList = this.curSolutionList,
                curSolutionIndex = curSolutionList.findIndex(item => item.solutionName === curSolutionName),
                curProductList = this.curProductList,
                productTypeList = this.productTypeList,
                curProductTypeList = curProductList.map(item => item.productType);

            this.curSolutionIndex = curSolutionIndex;
            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;

            var sceneItem = this.sceneList[this.sceneIndex];
            var curAlertItem = this.curAlertList[this.curAlertIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var productItem = this.curProductList[index];
            var sceneName = sceneItem.name;

            var title = '危害弹框-化工-' + sceneName;
            var name = '危害弹框-化工-' + sceneName + '-查看产品详情';
            var attr1 = curAlertItem.name;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);

            var pageTitle = '危害弹框-化工-' + sceneName;
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
        //显示产品
        showProductInfo(index) {
            if(index === -1) return;
            
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
        //点击 产品弹窗下面的小icon
        onProductClick(index) {
            this.showProductInfo(index);
            
            var sceneItem = this.sceneList[this.sceneIndex];
            var productItem = this.curProductList[this.curProductIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var title = '防护解决方案弹框-化工-' + sceneItem.name;
            var name = '防护解决方案弹框-化工-' + sceneItem.name + '-产品切换';
            var attr1 = solutionItem.solutionName;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        //点击屏幕底部 解决方案
        onClickSolution(index) {
            this.curSolutionIndex = index;
            this.curHotspot = '';

            let sceneIndex = this.sceneIndex,
                sceneName = this.sceneList[this.sceneIndex].name,
                curAlertIndex = this.curAlertIndex,
                curAlertList = this.curAlertList,
                curSolution = this.curSolutionList[this.curSolutionIndex];

            // this.curProductList = this.productList.filter(item => {
            //     return item.sceneName.includes(sceneName) && item.solutionName.includes(curSolution.solutionName)
            // })

            //leen+
            this.curProductList = [];
            curSolution.productIds.forEach(id => {
                this.curProductList.push(this.productMap.get(id))
            })

            curAlertIndex = curAlertList.findIndex(item => item.solutionName === curSolution.solutionName);

            let productTypeList = this.productTypeList,
                curProductTypeList = this.curProductList.map(item => item.productType);

            this.curProductTypeList = productTypeList.filter(item => {
                return curProductTypeList.includes(item.name)
            });

            this.modalSceneName = sceneName;
            this.curAlertIndex = curAlertIndex;
            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;

            if (this.curProductTypeList.length > 0) {
                this.onClickProductType(0);
            }
            this.showProductInfo(0);
            updateSwiper();
            productListSwiper.slideTo(0, 0, false);
            productPreviewSwiper.slideTo(0, 0, false);
            console.log("当前解决方案：", curSolution.solutionName);
            
            var sceneItem = this.sceneList[this.sceneIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var title = '场景页面-化工-' + sceneItem.name;
            var name = '场景页面-化工-' + sceneItem.name + '-安全解决方案';
            var attr1 = solutionItem.solutionName;
            var attr2 = '';

            typeof addOpenPageEvent == 'function' && addOpenPageEvent(title + '-防护解决方案弹框-' + solutionItem.solutionName);
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onClickProductType(index, modalType) {
            this.curProductTypeIndex = index;
            this.curProductIndex = 0;

            let sceneList = this.sceneList,
                sceneIndex = this.sceneIndex,
                sceneName = sceneList[sceneIndex].name,
                curHotspot = this.curHotspot,
                productList = this.productList,
                curProductList = this.curProductList,
                curAlertList = this.curAlertList,
                curAlertIndex = this.curAlertIndex,
                curAlert = curAlertList[curAlertIndex],
                curProductTypeList = this.curProductTypeList,
                curProductTypeIndex = this.curProductTypeIndex,
                curProductType = curProductTypeList[curProductTypeIndex].name;
            console.log('危害：' + curAlert.name);
            console.log('产品类型：' + curProductType);

            switch (curProductType) {
                case '锚点连接件':
                    curProductList = productList.filter(item => {
                        return item.productType === '锚点连接件'
                    });
                    if(curHotspot == 'zxh_zhuiluo1'){
                        curProductList = curProductList.filter(item => {
                            return item.sceneName.includes(sceneName) && item.alertList.includes('高空坠落') && item.name != '3M™ DBI-SALA®横梁滑车2103143';
                        });
                    }
                    if(curHotspot == 'zxh_zhuiluo2'){
                        curProductList = curProductList.filter(item => {
                            return item.sceneName.includes(sceneName) && item.alertList.includes('高空坠落') && item.name != '3M™ DBI-SALA® 固定织带 1003000';
                        });
                    }
                    break;
                case '安全带':
                    curProductList = productList.filter(item => {
                        return item.productType === '安全带'
                    });
                    break;
                case '连接件':
                    curProductList = productList.filter(item => {
                        if (curHotspot === 'jxdz_zhuiluo2') {
                            return item.productType === '连接件' && item.name != '3M™ DBI-SALA® Nano-Lok™双腿快速连接自锁速差器'
                        } else {
                            return item.productType === '连接件'
                        }
                    });
                    break;
                case '水平生命线':
                    curProductList = productList.filter(item => {
                        return item.productType === '水平生命线'
                    });
                    break;
                case '呼吸':
                    curProductList = productList.filter(item => {
                        return item.productType === '呼吸'
                    });
                default:
                    curProductList = curProductList;
            }

            this.curProductList = curProductList
            this.curProductList = this.curProductList.filter(item => {
                return item.sceneName.includes(sceneName)
            })
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
                    title = '防护解决方案弹框-化工-' + sceneItem.name;
                    name = '防护解决方案弹框-化工-' + sceneItem.name + '-产品分类切换';
                    typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
                    break;
                case 2:
                    title = '危害弹框-化工-' + sceneItem.name;
                    name = '危害弹框-化工-' + sceneItem.name + '-产品分类切换';
                    typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
                    break;
            }

            console.log('当前产品列表：', curProductList);
        },
        onProductLinkClick(index) {
            var sceneItem = this.sceneList[this.sceneIndex];
            var productItem = this.curProductList[this.curProductIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var productLink = productItem.productLink[index];
            var title = '防护解决方案弹框-化工-' + sceneItem.name;
            var name = '防护解决方案弹框-化工-' + sceneItem.name + '-查看详情';
            var attr1 = solutionItem.solutionName;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        goJD(index) {
            var sceneItem = this.sceneList[this.sceneIndex];
            var productItem = this.curProductList[this.curProductIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var productLink = productItem.productLink[index];
            var title = '防护解决方案弹框-化工-' + sceneItem.name;
            var name = '防护解决方案弹框-化工-' + sceneItem.name + '-去商城看看';
            var attr1 = solutionItem.solutionName;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        // 关闭产品弹框
        onCloseProductModal() {
            this.showProductModal = false;
            this.showScenePreview = true;
            var sceneItem = this.sceneList[this.sceneIndex];
            var productItem = this.curProductList[this.curProductIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var title = '防护解决方案弹框-化工-' + sceneItem.name;
            var name = '防护解决方案弹框-化工-' + sceneItem.name + '-关闭';
            var attr1 = solutionItem.solutionName;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);

            this.curSolutionIndex = -1;
        },
    },
})

const vm = app.mount("#app");
