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
let initScene = getUrlParam("scene") || 'tour4.xml?v20231211',
    sceneIndex = parseInt(getUrlParam("sceneIndex")) || 0,
    secondarySceneIndex = parseInt(getUrlParam("secondarySceneIndex")) || 0,
    jieshuoSrc = "./assets/img/jieshuo_fanyingfu.mp3";
switch (secondarySceneIndex) {
    case 0:
        switch (sceneIndex) {
            case 0:
                jieshuoSrc = "./assets/img/jieshuo_fanyingfu.mp3";
                break;
            case 1:
                jieshuoSrc = "./assets/img/jieshuo_lixinji.mp3";
                break;
            case 2:
                jieshuoSrc = "./assets/img/jieshuo_ganzao.mp3";
                break;
            case 3:
                jieshuoSrc = "./assets/img/jieshuo_dafen.mp3";
                break;
            case 4:
                jieshuoSrc = "./assets/img/jieshuo_shaifen.mp3";
                break;
            case 5:
                jieshuoSrc = "./assets/img/jieshuo_baozhuang.mp3";
                break;
            default:
                jieshuoSrc = "";
        }
        break;
    case 1:
        switch (sceneIndex) {
            case 0:
                jieshuoSrc = "./assets/img/jieshuo_chengzhong.mp3";
                break;
            case 1:
                jieshuoSrc = "./assets/img/jieshuo_zaoli.mp3";
                break;
            case 2:
                jieshuoSrc = "./assets/img/jieshuo_yapian.mp3";
                break;
            case 3:
                jieshuoSrc = "./assets/img/jieshuo_neibaozhuang.mp3";
                break;
            default:
                jieshuoSrc = "";
        }
        break;
    default:
        jieshuoSrc = "";
}

console.log(initScene, sceneIndex, secondarySceneIndex);

const app = Vue.createApp({
    data() {
        return {
            krpano: null, // 左侧选中的场景索引
            sceneIndex, // 左侧功能按钮选中的索引
            secondarySceneIndex, //一级菜单 “化学原料生产”， “制剂药片生产”
            curSceneList: [],
            alertIndex: -1, // 解决方案按钮索引
            curSolutionIndex: -1, // 解决方案索引
            curProductIndex: 0,//产品索引
            showScenePreview: true,
            showAlertBox: false,
            showProductModal: false,
            jieshuoSrc,
            highLightArray: [],
            secondarySceneList: [
                {
                    secondarySceneName: '化学原料生产',
                    sceneList: [
                        {
                            name: '反应釜投料',
                            previewImg: 'assets/img/scene_touliao.png',
                            tour: 'tour4.xml?v20231211',
                            startScene: 'scene_4',
                            alertList: ['粉尘', '液体飞溅', '有害气态物'],
                        },
                        {
                            name: '离心机卸料、清理',
                            previewImg: 'assets/img/scene_xieliao.png',
                            tour: 'tour5.xml?v20231211',
                            startScene: 'scene_5',
                            alertList: ['有害气态物'],
                        },
                        {
                            name: '干燥',
                            previewImg: 'assets/img/scene_ganzao.png',
                            tour: 'tour6.xml?v20231211',
                            startScene: 'scene_6',
                            alertList: ['粉尘'],
                        },
                        {
                            name: '打粉',
                            previewImg: 'assets/img/scene_dafen.png',
                            tour: 'tour7.xml?v20231211',
                            startScene: 'scene_7',
                            alertList: ['粉尘', '噪音',],
                        },
                        {
                            name: '筛分',
                            previewImg: 'assets/img/scene_shaifen.png',
                            tour: 'tour8.xml?v20231211',
                            startScene: 'scene_8',
                            alertList: ['噪音', '粉尘'],
                        },
                        {
                            name: '称重机',
                            previewImg: 'assets/img/scene_chengzhongji.png',
                            tour: 'tour9.xml?v20231211',
                            startScene: 'scene_9',
                            alertList: ['粉尘'],
                        },
                    ]
                },
                {
                    secondarySceneName: '制剂药片生产',
                    sceneList: [
                        {
                            name: '称重',
                            previewImg: 'assets/img/scene_chengzhong.png',
                            tour: 'tour0.xml?v20231211',
                            startScene: 'scene_0',
                            alertList: ['粉尘'],
                        },
                        {
                            name: '造粒',
                            previewImg: 'assets/img/scene_zaoli.png',
                            tour: 'tour2.xml?v20231211',
                            startScene: 'scene_2',
                            alertList: ['粉尘', '噪音'],
                        },
                        {
                            name: '压片',
                            previewImg: 'assets/img/scene_yapian.png',
                            tour: 'tour1.xml?v20231211',
                            startScene: 'scene_1',
                            alertList: ['粉尘', '噪音'],
                        },
                        {
                            name: '包装',
                            previewImg: 'assets/img/scene_baozhuang.png',
                            tour: 'tour3.xml?v20231211',
                            startScene: 'scene_3',
                            alertList: ['噪音'],
                        },
                    ]
                },
            ],
            alertList: [
                {
                    name: '粉尘',
                    btn: 'assets/img/btn_fc.png',
                    btnActive: 'assets/img/btn_fc_on.png',
                    solutionIcon: 'assets/img/solution_fenchen.png',
                    text: '药物性粉尘',
                    solutionName: '呼吸防护',
                    alertBoxIcon: 'assets/img/icon_fc.png',
                    spotArray: ['tl_fc1', 'gz_fc1', 'df_fc1', 'czj_fc1', 'czj_fc2', 'czj_fc3', 'czj_fc4', 'cz_fc1', 'zl_fc2', 'yp_fc2', 'sf_fc1', 'sf_fc2'],
                },
                {
                    name: '噪音',
                    btn: 'assets/img/btn_zy.png?v20230222',
                    btnActive: 'assets/img/btn_zy_on.png?v20230222',
                    solutionIcon: 'assets/img/solution_zaoyin.png',
                    text: '机器运转时发出的噪音',
                    solutionName: '听力防护',
                    alertBoxIcon: 'assets/img/icon_zy.png',
                    spotArray: ['df_zy1', 'sf_zy1', 'zl_zy1', 'yp_zy1', 'yp_zy2', 'bz_zy1', 'bz_zy2', 'bz_zy3', 'bz_zy4'],
                },
                {
                    name: '有害气态物',
                    btn: 'assets/img/btn_qitaiwu.png',
                    btnActive: 'assets/img/btn_qitaiwu_on.png',
                    solutionIcon: 'assets/img/solution_youhaiqiti.png',
                    text: '有害气体或蒸气',
                    solutionName: '呼吸防护',
                    alertBoxIcon: 'assets/img/icon_qitaiwu.png',
                    spotArray: ['tl_qitaiwu1', 'xl_qitaiwu1',],
                },
                {
                    name: '液体飞溅',
                    btn: 'assets/img/btn_feijian.png',
                    btnActive: 'assets/img/btn_feijian_on.png',
                    solutionIcon: 'assets/img/solution_yetifeijian.png',
                    text: '液体泼溅',
                    solutionName: '眼面防护',
                    alertBoxIcon: 'assets/img/icon_feijian.png',
                    spotArray: ['tl_cjw1'],
                },
            ],
            curAlertIndex: -1,
            curAlertList: [],
            solutionList: [
                {
                    solutionName: '呼吸防护',
                    solutionTitle: '药物性粉尘防护',
                    solutionIcon: 'assets/img/icon_mask.png',
                    solutionText: '制药生产过程可能存在药物性粉尘、有毒有害气体及蒸气危害。选择合适的3M呼吸防护产品，可以有效防护这些危害。',
                },
                {
                    solutionName: '听力防护',
                    solutionTitle: '听力防护',
                    solutionIcon: 'assets/img/icon_earmuff.png',
                    solutionText: '制药生产过程中会使用大量设备（如空气压缩机、粉碎机、风机等），高强度的噪声易引起噪声聋等危害。选择合适的3M听力防护产品，可以有效降低噪声危害。',
                },
                {
                    solutionName: '眼面防护',
                    solutionTitle: '眼面防护',
                    solutionIcon: 'assets/img/icon_hat.png',
                    solutionText: '制药生产会接触药物粉尘及化学品飞溅危害，选择合适的3M眼面防护具，可以有效避免化学品飞溅及粉尘对眼部带来的刺激和伤害。',
                },
            ],
            curSolutionList: [],
            productList: [
                {
                    name: '3M™ 防颗粒物口罩 9502+',
                    id: 5,
                    alertList: ['粉尘'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['干燥', '打粉', '称重机', '称重', '造粒', '压片', '筛分'],
                    img: 'assets/img/products/9502.png',
                    productDesc: '用于防护颗粒物，对非油性颗粒物的过滤效率在95%以上。',
                    productLink: [
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101327035/',
                            text: '查看详情'
                        },
                    ],
                    product360: {src: '9502Plus', num: 24},
                },
                {
                    name: '3M™ 硅胶半面型防护面罩 6502 中号',
                    id: 1,
                    alertList: ['粉尘', '有害气态物'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['反应釜投料'],
                    img: 'assets/img/products/6502.png',
                    productDesc: '3M™ 6500系列半面具面罩具有坚实、略带纹理的硅质表面密封，本体构造结实，有助于提升舒适度、耐用性和稳定性。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301647/',
                        text: '查看详情'
                    }],
                    product360: {src: '6502-6006CN-5N11CN', num: 24},
                },
                /*{
                    name: '1621 防化学液体飞溅防护眼罩',
                    id: 2,
                    alertList: ['液体飞溅', '粉尘'],
                    solutionName: ['眼面防护', '呼吸防护'],
                    sceneName: ['反应釜投料', '干燥', '包装'],
                    img: 'assets/img/products/1621.png',
                    productDesc: '通过LA认证，间接通风口设计可有效防止镜片起雾, 乙烯镜框，易弯折，提供良好的佩戴适合度。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000547578/',
                        text: '查看详情'
                    }],
                    product360: {src: '1621', num: 24},
                },*/
                {
                    name: '3M™ 1621AF 防护眼罩',
                    id: 10,
                    alertList: ['粉尘', '液体飞溅'],
                    solutionName: ['呼吸防护', '眼面防护'],
                    sceneName: ['反应釜投料', '干燥', '打粉', '筛分', '称重', '造粒', '压片', '称重机'],
                    img: 'assets/img/products/1621AF.png',
                    productDesc: '1621AF防化学护目镜，防尘、防化学液体喷溅；间接通风口设计，防雾涂层，有效防止镜片起雾。',
                    productLink: [
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000465773/',
                            text: '查看详情'
                        },
                    ],
                },
                {
                    name: '3M™ 1623AF 防雾防化学护目镜',
                    id: 3,
                    alertList: ['液体飞溅', '粉尘'],
                    solutionName: ['眼面防护', '呼吸防护'],
                    sceneName: ['反应釜投料', '干燥', '打粉', '筛分', '称重机', '称重', '造粒', '压片', '包装'],
                    img: 'assets/img/products/1623AF.png',
                    productDesc: '通过LA认证，防雾涂层加上间接通风口设计可有效防止镜片起雾, 适合亚洲人脸型，柔软的面框和鼻垫，贴合好，舒适度高',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000491584/',
                        text: '查看详情'
                    }],
                    product360: {src: '1623', num: 24},
                },
                {
                    name: '3M™ 长管供气式呼吸器',
                    id: 4,
                    alertList: ['有害气态物'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['离心机卸料、清理'],
                    img: 'assets/img/products/V300.png',
                    productDesc: '1. 直接呼吸室外洁净空气，防护级别高、防护效果好； \n' +
                        '2. 可进行升温、降温调节，佩戴舒适； \n' +
                        '3. 呼吸畅通，利于长时间佩戴； \n' +
                        '4. 可选配不同类型的软头罩/硬头盔/面具，同时进行有效的眼面部和头部防护',
                    product360: {src: 'W2806-W2929-V300-BT30-S533L', num: 18},
                },
                {
                    name: '3M™ Versaflo™ TR-600动力送风过滤式呼吸器',
                    id: 6,
                    alertList: ['粉尘'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['干燥', '打粉', '筛分', '称重机', '称重', '造粒', '压片'],
                    img: 'assets/img/products/TR600.png',
                    productDesc: '不仅可以提供高防护等级的呼吸保护，还可以提供头部、眼部、面部、听力和皮肤综合防护，同时在长时间连续工作中提供舒适体验。',
                    productLink: [
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/worker-health-safety-cn/tr600-powered-air-respirators/',
                            text: '查看详情'
                        },
                    ],
                    product360: {src: 'TR600', num: 24},
                },
                {
                    name: '318-1005 免揉搓泡棉型耳塞',
                    id: 7,
                    alertList: ['噪音'],
                    solutionName: ['听力防护'],
                    sceneName: ['打粉', '筛分', '造粒', '压片', '包装'],
                    img: 'assets/img/products/318-1005.png?v20230222',
                    productDesc: '兼具泡棉耳塞和预成型耳塞的优点，无需搓揉耳塞，佩戴方便卫生 不可水洗，脏污后废弃。',
                    productLink: [
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000177818/',
                            text: '查看详情'
                        },
                    ],
                    product360: {src: '318-1005', num: 20,},
                },
                {
                    name: '3M™ PELTOR™ Optime™ 95 H6A 头戴式耳罩',
                    id: 8,
                    alertList: ['噪音'],
                    solutionName: ['听力防护'],
                    sceneName: ['打粉', '筛分', '造粒', '压片', '包装'],
                    img: 'assets/img/products/H6A.png',
                    productDesc: '适用于达到95dBA的中度噪声环境，产品重量轻，体积小，佩戴舒适。',
                    productLink: [
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000062872/',
                            text: '查看详情'
                        },
                    ],
                    product360: {src: 'H6A', num: 24,},
                },
                {
                    name: '3M™ Versaflo™ TR-800动力送风过滤式呼吸器',
                    id: 9,
                    alertList: ['有害气态物', '粉尘'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['反应釜投料', '干燥'],
                    img: 'assets/img/products/TR800.png',
                    productDesc: '3M Versaflo TR-800动力送风过滤式呼吸器配备了最新款本质安全防爆主机，TR-800动力送风过滤式呼吸器系统可同时搭配滤棉和滤毒盒，个性化的搭配满足您不同场合的需求。',
                    productLink: [
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/worker-health-safety-cn/tr800-powered-air-respirators/',
                            text: '查看详情'
                        },
                    ],
                },

            ],
            curProductList: [],
            showInstruction: false,
        }
    },
    created() {
        let _pub = window.$pubWin;
        var tempDate = _pub.getStorage('temp-preparation-tablet-modal') || '';
        var currentDate = new Date().Format("yyyy-MM-dd");
        this.showInstruction = false;// (tempDate != currentDate);
        this.showInstruction = (tempDate != currentDate);

        this.curSceneList = this.secondarySceneList[secondarySceneIndex].sceneList;

        let curAlertNames = this.secondarySceneList[secondarySceneIndex].sceneList[sceneIndex].alertList;
        this.curAlertList = this.alertList.filter(item => {
            return curAlertNames.includes(item.name);
        });

        let solutionNames = this.curAlertList.map(item => item.solutionName);
        this.curSolutionList = this.solutionList.filter(item => {
            return solutionNames.includes(item.solutionName);
        });

        var secondarySceneItem = this.secondarySceneList[this.secondarySceneIndex];
        var sceneItem = secondarySceneItem.sceneList[this.sceneIndex];
        var targetName = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
        typeof addClabTrackerCommon == 'function' && addClabTrackerCommon(targetName);

        var pageSearch = '?scene=' + sceneItem.tour + '&sceneIndex=' + this.sceneIndex + '&secondarySceneIndex=' + this.secondarySceneIndex;
        var shareTitle = '3M个人安全防护元宇宙｜制药-' + sceneItem.name + '作业场景';
        var shareDesc = '沉浸式体验制药行业解决方案';
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
            _pub.setStorage('temp-preparation-tablet-modal', currentDate);
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
                secondarySceneIndex = this.secondarySceneIndex,
                secondarySceneList = this.secondarySceneList,
                curSceneList = secondarySceneList[secondarySceneIndex].sceneList,
                curScene = curSceneList[sceneIndex],
                curAlertNames = curScene.alertList;

            var secondarySceneItem = this.secondarySceneList[this.secondarySceneIndex];
            var sceneItem = secondarySceneItem.sceneList[this.sceneIndex];

            this.krpano.call('loadpano(' + sceneItem.tour + ', null, MERGE, BLEND(1));');
            this.krpano.call('loadscene(' + sceneItem.startScene + ');');

            this.curAlertList = this.alertList.filter(item => {
                return curAlertNames.includes(item.name);
            });

            let solutionNames = this.curAlertList.map(item => item.solutionName);
            this.curSolutionList = this.solutionList.filter(item => {
                return solutionNames.includes(item.solutionName);
            });

            this.showAlertBox = false;
            this.showProductModal = false;
            this.showScenePreview = true;
            this.alertIndex = -1;
            this.curAlertIndex = -1;
            this.curProductIndex = 0;
            this.highLightArray = [];

            var title = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            var name = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name + '-场景切换';
            var attr1 = '制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            var attr2 = '';
            var targetName = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            //typeof addOpenPageEvent == 'function' && addOpenPageEvent(targetName);
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
            console.log("二级：" + this.secondarySceneIndex + "，场景Index：" + this.sceneIndex + ",产品：" + this.curProductIndex);

            var pageSearch = '?scene=' + sceneItem.tour + '&sceneIndex=' + this.sceneIndex + '&secondarySceneIndex=' + this.secondarySceneIndex;
            var shareTitle = '3M个人安全防护元宇宙｜制药-' + sceneItem.name + '作业场景';
            var shareDesc = '沉浸式体验制药行业解决方案';
            typeof changeURLStatic == 'function' && changeURLStatic(pageSearch, shareTitle, shareDesc);

            switch (secondarySceneIndex) {
                case 0:
                    switch (sceneIndex) {
                        case 0:
                            jieshuoSrc = "./assets/img/jieshuo_fanyingfu.mp3";
                            break;
                        case 1:
                            jieshuoSrc = "./assets/img/jieshuo_lixinji.mp3";
                            break;
                        case 2:
                            jieshuoSrc = "./assets/img/jieshuo_ganzao.mp3";
                            break;
                        case 3:
                            jieshuoSrc = "./assets/img/jieshuo_dafen.mp3";
                            break;
                        case 4:
                            jieshuoSrc = "./assets/img/jieshuo_shaifen.mp3";
                            break;
                        case 5:
                            jieshuoSrc = "./assets/img/jieshuo_baozhuang.mp3";
                            break;
                        default:
                            return;
                    }
                    break;
                case 1:
                    switch (sceneIndex) {
                        case 0:
                            jieshuoSrc = "./assets/img/jieshuo_chengzhong.mp3";
                            break;
                        case 1:
                            jieshuoSrc = "./assets/img/jieshuo_zaoli.mp3";
                            break;
                        case 2:
                            jieshuoSrc = "./assets/img/jieshuo_yapian.mp3";
                            break;
                        case 3:
                            jieshuoSrc = "./assets/img/jieshuo_neibaozhuang.mp3";
                            break;
                        default:
                            return;
                    }
                    break;
                default:
                    return;
            }
            this.jieshuoSrc = jieshuoSrc;
            jieshuo.pause();
            jieshuo.currentTime = 0;
            onPlayJieshuo();
        },
        onSecondarySceneClick(index) {
            this.secondarySceneIndex = index;
            this.sceneIndex = 0;
            this.curSolutionIndex = -1;

            updateSwiper();

            let sceneIndex = this.sceneIndex,
                secondarySceneIndex = this.secondarySceneIndex,
                secondarySceneList = this.secondarySceneList,
                curSceneList = secondarySceneList[secondarySceneIndex].sceneList,
                curScene = curSceneList[sceneIndex],
                curAlertNames = curScene.alertList;

            var secondarySceneItem = this.secondarySceneList[this.secondarySceneIndex];
            var sceneItem = secondarySceneItem.sceneList[this.sceneIndex];

            this.krpano.call('loadpano(' + sceneItem.tour + ', null, MERGE, BLEND(1));');
            this.krpano.call('loadscene(' + sceneItem.startScene + ');');

            this.curSceneList = curSceneList;
            this.curAlertList = this.alertList.filter(item => {
                return curAlertNames.includes(item.name);
            });

            let solutionNames = this.curAlertList.map(item => item.solutionName);
            this.curSolutionList = this.solutionList.filter(item => {
                return solutionNames.includes(item.solutionName);
            });

            this.showAlertBox = false;
            this.showProductModal = false;
            this.showScenePreview = true;
            this.alertIndex = -1;
            this.curAlertIndex = -1;
            this.curProductIndex = 0;
            this.highLightArray = [];

            var title = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            var name = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name + '-场景分类选择';
            var attr1 = secondarySceneItem.secondarySceneName;
            var attr2 = '';
            var targetName = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            //typeof addOpenPageEvent == 'function' && addOpenPageEvent(targetName);
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);

            switch (secondarySceneIndex) {
                case 0:
                    jieshuoSrc = "./assets/img/jieshuo_fanyingfu.mp3";
                    break;
                case 1:
                    jieshuoSrc = "./assets/img/jieshuo_chengzhong.mp3";
                    break;
                default:
                    return;
            }
            this.jieshuoSrc = jieshuoSrc;
            jieshuo.pause();
            jieshuo.currentTime = 0;
            onPlayJieshuo();
        },
        onAlertClick(index) {
            this.alertIndex = index;
            let sceneIndex = this.sceneIndex,
                secondarySceneIndex = this.secondarySceneIndex,
                secondarySceneList = this.secondarySceneList[secondarySceneIndex],
                sceneList = secondarySceneList.sceneList[sceneIndex],
                curAlert = this.curAlertList[index];

            var secondarySceneItem = this.secondarySceneList[this.secondarySceneIndex],
                sceneItem = secondarySceneItem.sceneList[this.sceneIndex],
                alertItem = curAlert,
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

            var title = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            var name = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name + '-场景危害类型过滤';
            var attr1 = alertItem.name;
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        closeAlertBox() {
            this.showAlertBox = false;

            var sceneIndex = this.sceneIndex,
                secondarySceneIndex = this.secondarySceneIndex,
                secondarySceneItem = this.secondarySceneList[secondarySceneIndex],
                secondarySceneName = secondarySceneItem.secondarySceneName,
                sceneItem = secondarySceneItem.sceneList[sceneIndex],
                sceneName = sceneItem.name;

            var title = '危害弹框-制药-' + secondarySceneName + '-' + sceneName;
            var name = '危害弹框-制药-' + secondarySceneName + '-' + sceneName + '-关闭';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onScenePreviewClick() {
            this.showScenePreview = !this.showScenePreview;

            var secondarySceneItem = this.secondarySceneList[this.secondarySceneIndex];
            var sceneItem = secondarySceneItem.sceneList[this.sceneIndex];

            var title = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            var name = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name + '-场景选择';
            var attr1 = this.showScenePreview ? '显示' : '隐藏';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        showProductList(index, curSolutionName) {
            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;

            let curAlertIndex = this.curAlertIndex,
                curAlertList = this.curAlertList,
                curSolutionList = this.curSolutionList,
                curSolutionIndex = curSolutionList.findIndex(item => item.solutionName === curSolutionName);

            this.curSolutionIndex = curSolutionIndex;
            this.curProductList = this.curProductList.filter(item => item.solutionName.includes(curSolutionName));
            this.showProductInfo(0);
            updateSwiper();
            productListSwiper.slideTo(0, 0, false);
            productPreviewSwiper.slideTo(0, 0, false);

            var sceneIndex = this.sceneIndex,
                secondarySceneIndex = this.secondarySceneIndex,
                secondarySceneItem = this.secondarySceneList[secondarySceneIndex],
                secondarySceneName = secondarySceneItem.secondarySceneName,
                sceneItem = secondarySceneItem.sceneList[sceneIndex],
                sceneName = sceneItem.name,
                curAlertItem = curAlertList[curAlertIndex],
                solutionItem = curSolutionList[curAlertIndex];

            var pageTitle = '危害弹框-制药-' + secondarySceneName + '-' + sceneName;
            typeof addOpenPageEvent == 'function' && addOpenPageEvent('防护解决方案弹框-' + curAlertItem.name + '-' + solutionItem.solutionName);

            var title = '危害弹框-制药-' + secondarySceneName + '-' + sceneName;
            var name = '危害弹框-制药-' + secondarySceneName + '-' + sceneName + '-查看防护方案';
            var attr1 = solutionItem.solutionName;
            var attr2 = curAlertItem.name;

            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onClickAlertProduct(index){
            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;

            let curAlertIndex = this.curAlertIndex,
                curAlertList = this.curAlertList,
                curSolutionList = this.curSolutionList,
                curAlertItem = curAlertList[curAlertIndex];
                curSolutionName = curAlertList[curAlertIndex].solutionName,
                curSolutionIndex = curSolutionList.findIndex(item => item.solutionName === curSolutionName);
            console.log(">>>>" , this.curProductList)
            this.curSolutionIndex = curSolutionIndex;

            var sceneIndex = this.sceneIndex,
                secondarySceneIndex = this.secondarySceneIndex,
                secondarySceneItem = this.secondarySceneList[secondarySceneIndex],
                secondarySceneName = secondarySceneItem.secondarySceneName,
                sceneItem = secondarySceneItem.sceneList[sceneIndex],
                sceneName = sceneItem.name,
                solutionItem = this.curSolutionList[this.curSolutionIndex],
                productItem = this.curProductList[index];

            var title = '危害弹框-制药-' + secondarySceneName + '-' + sceneName;
            var name = '危害弹框-制药-' + secondarySceneName + '-' + sceneName + '-查看产品详情';
            var attr1 = curAlertItem.name;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);

            var pageTitle = '危害弹框-制药-' + secondarySceneName + '-' + sceneName;
            typeof addOpenPageEvent == 'function' && addOpenPageEvent('防护解决方案弹框-' + curAlertItem.name + '-' + solutionItem.solutionName);
            
            this.showProductInfo(index);
            setTimeout(() => {
                updateSwiper();
                productListSwiper.slideTo(index, 0, false);
                productPreviewSwiper.slideTo(index, 0, false);
            }, 100);
        },
        showProductInfo(index) {
            this.curProductIndex = index;
            let curProductList = this.curProductList,
                curProductIndex = this.curProductIndex,
                curProduct = curProductList[curProductIndex],
                curSolution = this.curSolutionList[this.curSolutionIndex];
            if (curProductList[curProductIndex].product360) {
                let src = curProductList[curProductIndex].product360.src,
                    num = curProductList[curProductIndex].product360.num;
                console.log(src, num);
                setTimeout(function () {
                    showProduct(src, num, 'productImgList-' + curProductIndex);
                }, 100)
            }
            updateSwiper();

            if (curSolution.solutionName == '呼吸防护') {
                if (curProduct.name == '1621 防化学液体飞溅防护眼罩' || curProduct.name == '3M™ 1623AF 防雾防化学护目镜' || curProduct.name == '3M™ 1621AF 防护眼罩') {
                    curSolution.solutionText = '制药生产会接触药物粉尘及化学品飞溅危害，选择合适的3M眼面防护具，可以有效避免化学品飞溅及粉尘对眼部带来的刺激和伤害。'
                } else {
                    curSolution.solutionText = '制药生产过程可能存在药物性粉尘、有毒有害气体及蒸气危害。选择合适的3M呼吸防护产品，可以有效防护这些危害。'
                }
            }
        },
        onProductClick(index) {
            this.showProductInfo(index);
            var secondarySceneItem = this.secondarySceneList[this.secondarySceneIndex],
                sceneItem = secondarySceneItem.sceneList[this.sceneIndex],
                solutionItem = this.curSolutionList[this.curSolutionIndex],
                productItem = this.curProductList[this.curProductIndex];

            var title = '防护解决方案弹框-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            var name = '防护解决方案弹框-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name + '-产品切换';
            var attr1 = solutionItem.solutionName;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onClickSolution(index) {
            this.curAlertIndex = index;
            this.curProductIndex = 0;

            let sceneIndex = this.sceneIndex,
                secondarySceneIndex = this.secondarySceneIndex,
                secondarySceneList = this.secondarySceneList,
                curSceneList = secondarySceneList[secondarySceneIndex].sceneList,
                sceneName = curSceneList[sceneIndex].name,
                curAlertIndex = this.curAlertIndex,
                curAlertList = this.curAlertList,
                curAlert = curAlertList[curAlertIndex],
                curAlertName = curAlert.name;

                

            let filterAlert = curAlertList.find(alert => alert.name === curAlertName);
            if (filterAlert) {
                let solution = this.curSolutionList.find(solution => solution.solutionName === filterAlert.solutionName);
                if (solution) {
                    let solutionIndex = this.curSolutionList.indexOf(solution);
                    this.curSolutionIndex = solutionIndex
                }
            } else {
                this.curSolutionIndex = -1
            }

            if (sceneName == '反应釜投料' && curAlertName == '粉尘') {
                this.curProductList = this.productList.filter(item => {
                    return item.sceneName.includes(sceneName) && item.alertList.includes(curAlertName) && item.name != '1621 防化学液体飞溅防护眼罩';
                })
            } else {
                this.curProductList = this.productList.filter(item => {
                    return item.sceneName.includes(sceneName) && item.alertList.includes(curAlertName);
                });
            }

            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;
            this.showProductInfo(0);
            updateSwiper();
            productListSwiper.slideTo(0, 0, false);
            productPreviewSwiper.slideTo(0, 0, false);

            var secondarySceneItem = this.secondarySceneList[this.secondarySceneIndex];
            var sceneItem = secondarySceneItem.sceneList[this.sceneIndex];

            let curSolutionIndex = this.curSolutionIndex,
                curSolutionList = this.curSolutionList,
                curSolution = curSolutionList[curSolutionIndex];
            var curAlertItem = this.curAlertList[this.curAlertIndex];

            var title = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            var name = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name + '-安全解决方案';
            var attr1 = curSolution.solutionName;
            var attr2 = curAlertItem.name;

            typeof addOpenPageEvent == 'function' && addOpenPageEvent(title + '-防护解决方案弹框-' + curAlertItem.name + '-' + curSolution.solutionName);
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onProductLinkClick(index) {
            var secondarySceneItem = this.secondarySceneList[this.secondarySceneIndex];
            var sceneItem = secondarySceneItem.sceneList[this.sceneIndex];
            var curProduct = this.curProductList[this.curProductIndex];
            var productLink = curProduct.productLink[index];
            var title = '防护解决方案弹框-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            var name = '防护解决方案弹框-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name + '-查看详情';
            var attr1 = productLink.text;
            var attr2 = curProduct.name;
            addPageEvent(title, name, attr1, attr2);
        },
        goJD(index) {
            var secondarySceneItem = this.secondarySceneList[this.secondarySceneIndex];
            var sceneItem = secondarySceneItem.sceneList[this.sceneIndex];
            var productItem = this.curProductList[this.curProductIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var productLink = productItem.productLink[index];
            var title = '防护解决方案弹框-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            var name = '防护解决方案弹框-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name + '-去京东看看';
            var attr1 = solutionItem.solutionName;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onCloseProductModal() {
            this.showProductModal = false;
            this.showScenePreview = true;

            var secondarySceneItem = this.secondarySceneList[this.secondarySceneIndex];
            var sceneItem = secondarySceneItem.sceneList[this.sceneIndex];
            var productItem = this.curProductList[this.curProductIndex];
            var solutionItem = this.curSolutionList[this.curSolutionIndex];
            var title = '防护解决方案弹框-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            var name = '防护解决方案弹框-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name + '-关闭';
            var attr1 = solutionItem.solutionName;
            var attr2 = productItem.name;
            addPageEvent(title, name, attr1, attr2);

            this.curSolutionIndex = -1;
            this.curAlertIndex = -1;
        },
        goBack() {
            var secondarySceneItem = this.secondarySceneList[this.secondarySceneIndex];
            var sceneItem = secondarySceneItem.sceneList[this.sceneIndex];

            var title = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            var name = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name + '-返回';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2, function () {
                history.go(-1);
            });
        },
        goGame() {
            var secondarySceneItem = this.secondarySceneList[this.secondarySceneIndex];
            var sceneItem = secondarySceneItem.sceneList[this.sceneIndex];

            var title = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            var name = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name + '-3m虚拟空间';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2, function () {
                location.href = '../Game/index.html';
            });
        },
        goContenthub() {
            var secondarySceneItem = this.secondarySceneList[this.secondarySceneIndex];
            var sceneItem = secondarySceneItem.sceneList[this.sceneIndex];

            var title = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name;
            var name = '场景页面-制药-' + secondarySceneItem.secondarySceneName + '-' + sceneItem.name + '-留资';
            var attr1 = '';
            var attr2 = '';
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
    },
})

const vm = app.mount("#app");
