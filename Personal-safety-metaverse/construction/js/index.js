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

//跳转页面
function toJump(path) {
    var urlArgs = '';//"?v=" + window.Version;//js参数,用于控制js版本
    window.location.href = path + urlArgs;//跳转页面
}

let initScene = getUrlParam("scene") || 'tour0.xml?v20231211',
    sceneIndex = parseInt(getUrlParam("sceneIndex")) || 0,
    jieshuoSrc = "./assets/img/jieshuo_jianzhugongdi.mp3";
switch (sceneIndex){
    case 0:
        jieshuoSrc = "./assets/img/jieshuo_jianzhugongdi.mp3";
        break;
    case 1:
        jieshuoSrc = "./assets/img/jieshuo_shinei.mp3";
        break;
    case 2:
        jieshuoSrc = "./assets/img/jieshuo_louding.mp3";
        break;
    case 3:
        jieshuoSrc = "./assets/img/jieshuo_louding.mp3";
        break;
    default:
        jieshuoSrc = "";
}
console.log(initScene, sceneIndex);

const app = Vue.createApp({
    data() {
        return {
            krpano: null, // 左侧选中的场景索引
            sceneIndex, // 左侧功能按钮选中的索引
            alertIndex: -1, // 解决方案按钮索引
            solutionIndex: -1, // 右侧危害索引
            curProductIndex: 0,//产品索引
            productType: 0,//产品类型索引
            showScenePreview: true,
            showDamageModal: false,
            showProductModal: false,
            jieshuoSrc,
            highLightArray: [],
            sceneList: [
                //室内作业
                {
                    name: '政府',
                    previewImg: 'assets/img/scene_shinei.png',
                    tour: 'tour0.xml?v20231211',
                    startScene: 'scene_0', // 解决方案按钮
                    solutionList: [
                        {
                            btn: 'assets/img/icon_fall.png',
                            name: '坠落防护',
                            text: '???',
                        },
                    ],
                },
                //建筑工地
                {
                    name: '移动服务听力车',
                    previewImg: 'assets/img/scene_jianzhu.png',
                    tour: 'tour1.xml?v20231211',
                    startScene: 'scene_1', // 解决方案按钮
                    solutionList: [
                        {
                            btn: 'assets/img/icon_fall.png',
                            name: '坠落防护',
                            text: '???',
                        },
                    ],
                },
                //楼顶操作
                {
                    name: '社会组织',
                    previewImg: 'assets/img/scene_louding.png',
                    tour: 'tour2.xml?v20231211',
                    startScene: 'scene_2', // 解决方案按钮
                    solutionList: [
                        {
                            btn: 'assets/img/icon_fall.png',
                            name: '坠落防护',
                            text: '???',
                        },
                    ],
                },
                //高校
                {
                    name: '高校及科研院所',
                    previewImg: 'assets/img/scene_louding.png',
                    tour: 'tour3.xml?v20231211',
                    startScene: 'scene_3', // 解决方案按钮
                    solutionList: [
                        {
                            btn: 'assets/img/icon_fall.png',
                            name: '坠落防护11',
                            text: '???',
                        },
                    ],
                    alertList:[

                    ]
                }
            ],
            alertList: [
                {
                    name: '洞口作业',
                    btn: 'assets/img/btn_dongkou.png',
                    btnActive: 'assets/img/btn_dongkou_on.png',
                    text: '在地面、楼面、屋面和墙面等有可能使人和物料坠落，其坠落高度大于或等于2m的洞口处的高处作业。',
                    spotArray: ['sn_dongkou1', 'sn_dongkou2', 'ld_dongkou'],
                    productTypeList: [
                        {
                            name: '锚点连接件',
                            icon: 'assets/img/icon_maodian.png?v20230620',
                            text: '根据洞口周围建筑结构的类型选择适用的锚点连接件，例如：3M织带锚点、3M 混凝土锚点或3M门窗框锚点等。',
                            img: 'assets/img/damage_dongkou_maodian.png?v20230522'
                        },
                        {
                            name: '安全带',
                            icon: 'assets/img/icon_anquandai.png?v20230620',
                            text: '全身式安全带，并配备前胸、后背D型环。',
                            img: 'assets/img/damage_dongkou_anquandai.png?v20230522'
                        },
                        {
                            name: '连接件',
                            icon: 'assets/img/icon_lianjiejian.png?v20230620',
                            text: '3M双钩缓冲安全绳，或3M REBEL双钩小型速差器。',
                            img: 'assets/img/damage_dongkou_lianjiejian.png?v20230522'
                        },
                    ],
                    solutionDesc: '楼梯口、电梯口及设备安装预留口，施工需要预留的通道口、施工口等。',
                },
                {
                    name: '临边作业',
                    btn: 'assets/img/btn_linbian.png',
                    btnActive: 'assets/img/btn_linbian_on.png',
                    text: '在工作面边沿无围护或围护设施高度低于800mm的高处作业。',
                    spotArray: ['sn_linbian1', 'sn_linbian2', 'ld_linbian1', 'ld_linbian2'],
                    productTypeList: [
                        {
                            name: '锚点连接件',
                            icon: 'assets/img/icon_maodian.png?v20230620',
                            text: '根据临边作业建筑结构的类型选择适用的锚点连接件，例如：3M织带锚点、3M钢缆锚点、3M临时水平生命线和3M工字钢锚点等。',
                            img: 'assets/img/damage_linbian_lianjiejian.png'
                        },
                        {
                            name: '安全带',
                            icon: 'assets/img/icon_anquandai.png?v20230620',
                            text: '按照作业类型选择适用于限位或坠落悬挂的3M全身式安全带。',
                            img: 'assets/img/damage_linbian_anquandai.png'
                        },
                        {
                            name: '连接件',
                            icon: 'assets/img/icon_lianjiejian.png?v20230620',
                            text: '首选限位安全绳，或临边速差器，或双钩缓冲安全绳。',
                            img: 'assets/img/damage_linbian_lianjiejian.png'
                        },
                    ],
                    solutionDesc: '尚未安装栏杆的阳台周边，无外架防护的层面周边，框架工程楼层周边等。',
                },
                {
                    name: '攀登作业',
                    btn: 'assets/img/btn_pandeng.png',
                    btnActive: 'assets/img/btn_pandeng_on.png',
                    text: '借助登高用具或登高设施进行的高处作业。',
                    spotArray: ['jz_pandeng', 'ld_pandeng'],
                    productTypeList: [
                        {
                            name: '锚点连接件',
                            icon: 'assets/img/icon_maodian.png?v20230620',
                            text: '根据攀登作业建筑结构的类型选择适用的锚点连接件，例如：3M钢缆锚点、3M Lad-saf垂直生命线、3M临时垂直生命线等。',
                            img: 'assets/img/damage_pandeng_lianjiejian.png?v20230522'
                        },
                        {
                            name: '安全带',
                            icon: 'assets/img/icon_anquandai.png?v20230620',
                            text: '全身式安全带，并配备前胸、后背D型环。',
                            img: 'assets/img/damage_pandeng_anquandai.png?v20230522'
                        },
                        {
                            name: '连接件',
                            icon: 'assets/img/icon_lianjiejian.png?v20230620',
                            text: '首选速差器或双钩缓冲安全绳。',
                            img: 'assets/img/damage_pandeng_lianjiejian.png?v20230522'
                        },
                    ],
                    solutionDesc: '在建筑物周围张挂安全网，拆装塔机，搭建钢结构等。',
                },
                {
                    name: '悬空作业',
                    btn: 'assets/img/btn_xuankong.png',
                    btnActive: 'assets/img/btn_xuankong_on.png',
                    text: '在周边无任何防护设施或防护设施不能满足防护要求的临空状态下进行的高处作业。',
                    spotArray: ['jz_xuankong1', 'jz_xuankong2'],
                    productTypeList: [
                        {
                            name: '锚点连接件',
                            icon: 'assets/img/icon_maodian.png?v20230620',
                            text: '根据悬空作业建筑结构的类型选择适用的锚点连接件，例如：3M织带锚点、3M钢缆锚点和3M悬臂系统等。',
                            img: 'assets/img/damage_xuankong_lianjiejian.png'
                        },
                        {
                            name: '安全带',
                            icon: 'assets/img/icon_anquandai.png?v20230620',
                            text: '全身式安全带，并配备前胸、后背、和腰侧D型环。',
                            img: 'assets/img/damage_xuankong_anquandai.png'
                        },
                        {
                            name: '连接件',
                            icon: 'assets/img/icon_lianjiejian.png?v20230620',
                            text: '速差器，或者带有绞盘功能的3-Way速差器，或双钩缓冲安全绳。',
                            img: 'assets/img/damage_xuankong_lianjiejian.png'
                        },
                    ],
                    solutionDesc: '构件吊装，吊篮作业，悬空梁板、雨棚搭建等。',
                },
                {
                    name: '操作平台',
                    btn: 'assets/img/btn_pingtai.png',
                    btnActive: 'assets/img/btn_pingtai_on.png',
                    text: '由钢管、型钢及其他等效性能材料等组装搭设制作的供施工现场高处作业和载物的平台，包括移动式、落地式、悬挑式等平台。',
                    spotArray: ['jz_pingtai', 'sn_pingtai', 'ld_pingtai'],
                    productTypeList: [
                        {
                            name: '锚点连接件',
                            icon: 'assets/img/icon_maodian.png?v20230620',
                            text: '根据操作平台建筑结构的类型选择适用的锚点连接件，例如：3M织带锚点、3M钢缆锚点等。',
                            img: 'assets/img/damage_caozuopingtai_lianjiejian.png'
                        },
                        {
                            name: '安全带',
                            icon: 'assets/img/icon_anquandai.png?v20230620',
                            text: '全身式安全带，并配备前胸、后背D型环。',
                            img: 'assets/img/damage_caozuopingtai_anquandai.png'
                        },
                        {
                            name: '连接件',
                            icon: 'assets/img/icon_lianjiejian.png?v20230620',
                            text: '首选可低挂高用的3M双钩缓冲安全绳，或3M Nano-Lok小型速差器。',
                            img: 'assets/img/damage_caozuopingtai_lianjiejian.png'
                        },
                    ],
                    solutionDesc: '移动式、落地式、悬挑式等平台，脚手架作业等。',
                },
                {
                    name: '交叉作业',
                    btn: 'assets/img/btn_jiaocha.png',
                    btnActive: 'assets/img/btn_jiaocha_on.png',
                    text: '垂直空间贯通状态下，可能造成人员或物体坠落，并处于坠落半径范围内、上下左右不同层面的立体作业。',
                    spotArray: ['jz_jiaocha'],
                    productTypeList: [
                        {
                            name: '锚点连接件',
                            icon: 'assets/img/icon_maodian.png?v20230620',
                            text: '根据交叉作业建筑结构的类型选择适用的锚点连接件，例如：3M织带锚点、3M钢缆锚点或3M脚手架锚点等。',
                            img: 'assets/img/damage_jiaocha_lianjiejian.png'
                        },
                        {
                            name: '安全带',
                            icon: 'assets/img/icon_anquandai.png?v20230620',
                            text: '首选醒目荧光色的全身式安全带。',
                            img: 'assets/img/damage_jiaocha_anquandai.png?v20230803'
                        },
                        {
                            name: '连接件',
                            icon: 'assets/img/icon_lianjiejian.png?v20230620',
                            text: '首选选择坠落制动距离较小的3M Nano-Lok双钩小型速差器，或3M双钩缓冲安全绳。',
                            img: 'assets/img/damage_jiaocha_lianjiejian.png'
                        },
                    ],
                    solutionDesc: '上方人员搭建脚手架或吊运物料，下方的人员同时在搬运物料、制作钢筋等。',
                },
            ],
            curAlertIndex: 0,
            curAlertList: [],
            productList: [
                {
                    id: 1,
                    type: '锚点连接件',
                    alertList: ['洞口作业', '临边作业', '悬空作业', '操作平台', '交叉作业'],
                    img: 'assets/img/products/1003000.png',
                    name: '3M™ DBI-SALA® 固定织带 1003000',
                    productDesc: '我们的锚点连接件以优质材质制成，可确保高强度和耐久度，经得起极端环境的考验。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100324535/', text: '查看固定织带1003000详情'
                    }],
                },
                {
                    id: 2,
                    type: '锚点连接件',
                    alertList: ['临边作业', '攀登作业', '操作平台', '交叉作业', '悬空作业'],
                    img: 'assets/img/products/5900550.png',
                    name: '3M™ DBI-SALA®固定钢缆5900550',
                    productDesc: '我们的锚点连接件以优质材质制成，可确保高强度和耐久度，经得起极端环境的考验。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100324551/', text: '查看固定钢缆5900550详情'
                    }],
                },
                {
                    id: 3,
                    type: '安全带',
                    alertList: ['洞口作业', '临边作业', '攀登作业', '悬空作业', '操作平台', '交叉作业'],
                    img: 'assets/img/products/1103591.png',
                    name: '3M™ DBI-SALA® ExoFit™ Lite 全身式安全带 1103591',
                    productDesc: '全身式安全带是作业人员进行高空作业时最重要的防护设备。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101091035/', text: '查看ExoFit™ Lite 全身式安全带 1103591详情'
                    }],
                },
                {
                    id: 4,
                    type: '安全带',
                    alertList: ['洞口作业', '临边作业', '攀登作业', '悬空作业', '操作平台', '交叉作业'],
                    img: 'assets/img/products/P200.png',
                    name: '3M™ PROTECTA® 保泰特P200五点式全身式安全带 1161730',
                    productDesc: '全身式安全带是作业人员进行高空作业时最重要的防护设备。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101091034/',
                        text: '查看3M™ PROTECTA® 保泰特P200五点式全身式安全带 1161730详情'
                    }],
                },
                {
                    id: 5,
                    type: '连接件',
                    alertList: ['洞口作业', '临边作业', '攀登作业', '悬空作业', '操作平台',],
                    img: 'assets/img/products/DBI-SALA.png',
                    name: '3M™ DBI-SALA® 弹性伸缩安全绳',
                    productDesc: '3M安全绳包含缓冲包，缓冲包可减少冲击力，在坠落制动事件中限制坠落对身体的作用力，以降低伤害提高安全性。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101124860/', text: '查看3M™ DBI-SALA® 弹性伸缩安全绳详情'
                    }],
                },
                {
                    id: 7,
                    type: '连接件',
                    alertList: ['操作平台',],
                    img: 'assets/img/products/Nano-Lok.png',
                    name: '3M™ DBI-SALA® Nano-Lok™快速连接自锁速差器',
                    productDesc: 'Nano Lok™采用经济设计，使用方便，适合直接连接大多数安全带。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000433826/',
                        text: '查看3M™ DBI-SALA® Nano-Lok™快速连接自锁速差器详情'
                    }],
                },
                {
                    id: 8,
                    type: '连接件',
                    alertList: ['临边作业'],
                    img: 'assets/img/products/AL420C2.png',
                    name: '3M™ PROTECTA® PRO™ 绳式限位安全绳AL420C2',
                    productDesc: '我们的PROTECTA缓冲安全绳以经济实惠的价格实现高质量合规，深受作业人员们的信任。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100324903/',
                        text: '查看3M™ PROTECTA® PRO™ 绳式限位安全绳AL420C2详情'
                    }],
                },
                {
                    id: 9,
                    type: '连接件',
                    alertList: ['临边作业'],
                    img: 'assets/img/products/3503802.png',
                    name: '3M™ DBI-SALA® 智能磁力回收速差器 3503802',
                    productDesc: '在3M坠落防护，我们的目标不仅是保护员工在高空作业时的安全，而且还会借助先进、可靠的救援系统使他们安全地回到地面。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100610092/',
                        text: '查看3M™ DBI-SALA® 智能磁力回收速差器 3503802详情'
                    }],
                },
                {
                    id: 10,
                    type: '锚点连接件',
                    alertList: ['攀登作业'],
                    img: 'assets/img/products/Lad-Saf.png',
                    name: 'Lad-Saf垂直生命线',
                    productDesc: '在3M坠落防护，我们的目标不仅是保护员工在高空作业时的安全，而且还会借助先进、可靠的救援系统使他们安全地回到地面。',
                    productLink: [{
                        // link: 'https://www.3m.com.cn/wps/wcm/connect/694f01d7-a432-4ff1-b313-ad77718df1bf/3M_Fall_Protection_Vertical+Lifeline+Systems_Lad-Saf_410x200.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-694f01d7-a432-4ff1-b313-ad77718df1bf-nFhtOB9',
                        text: '查看Lad-Saf垂直生命线详情'
                    }],
                },
                {
                    id: 11,
                    type: '连接件',
                    alertList: ['悬空作业'],
                    img: 'assets/img/products/3400923.png',
                    name: '3M™ DBI-SALA® Sealed-Blok™自锁速差器',
                    productDesc: 'Sealed Blok™自动回缩式救生索（SRL）采用特殊概念设计，将包括电机弹簧、刹车系统在内的所有动态组件隔离开来，使其免受油渍、潮气、尘土等外部异物的侵扰。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000433888/',
                        text: '查看3M™ DBI-SALA® Sealed-Blok™自锁速差器详情'
                    }],
                },
                {
                    id: 12,
                    type: '安全带',
                    alertList: ['洞口作业', '临边作业', '悬空作业', '操作平台', '交叉作业'],
                    img: 'assets/img/products/1390000.png',
                    name: '3M™ PROTECTA® FIRST™背心式均码安全带1390000',
                    productDesc: 'PROTECTA的FIRST系列安全带以经济实惠的价格提供简单易用的坠落防护设备，适用于高空安全设备初次使用者或低频用户。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000306311/',
                        text: '查看3M™ PROTECTA® FIRST™背心式均码安全带详情'
                    }],
                },
                {
                    id: 13,
                    type: '连接件',
                    alertList: ['洞口作业', '攀登作业', '悬空作业', '操作平台', '交叉作业'],
                    img: 'assets/img/products/1390235.png',
                    name: '3M™ PROTECTA® First™双腿减震安全绳1390235',
                    productDesc: '我们的FIRST™包式缓冲安全绳以经济实惠的价格实现高质量合规，深受作业人员们的信任。它们特有的耐用织带和镀合金钢件具有强度高、耐腐蚀的特点。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000306313/',
                        text: '查看3M™ PROTECTA® First™双腿减震安全绳详情'
                    }],
                },
                {
                    id: 14,
                    type: '锚点连接件',
                    alertList: ['悬空作业'],
                    img: 'assets/img/products/8518000.png',
                    name: '3M™ DBI-SALA® Advanced™ 5件式8518000',
                    productDesc: 'Advanced™系列举升系统设计用于检查井和有限空间进入/回收应用。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000431608/',
                        text: '查看3M™ DBI-SALA® Advanced™ 5件式详情'
                    }],
                },
                {
                    id: 15,
                    type: '锚点连接件',
                    alertList: ['悬空作业', '攀登作业'],
                    img: 'assets/img/products/AC202-03.png',
                    name: '3M™ PROTECTA® Cobra™抓绳器, 带扩展带AC202/03',
                    productDesc: 'Cobra抓绳器有三种款式可选，适合各类应用。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100324861/',
                        text: '查看3M™ PROTECTA® Cobra™抓绳器详情'
                    }],
                },
                {
                    id: 16,
                    type: '连接件',
                    alertList: ['悬空作业', '攀登作业'],
                    img: 'assets/img/products/3590616.png',
                    name: 'Protecta® Rebel™ 速差自控器3590616',
                    productDesc: '镀锌钢缆绳，6m\n' +
                        '可旋转式挂钩，自锁挂钩连接\n' +
                        '另有CE版本产品3590520',
                },
                {
                    id: 17,
                    type: '锚点连接件',
                    alertList: ['临边作业'],
                    img: 'assets/img/products/2108406.png',
                    name: '3M™ DBI-SALA®固定横梁锚点连接件2108406',
                    productDesc: '我们的锚点连接件以优质材质制成，可确保高强度和耐久度，经得起极端环境的考验。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000431254/',
                        text: '查看3M™ DBI-SALA®固定横梁锚点连接件详情'
                    }],
                },
                {
                    id: 18,
                    type: '安全带',
                    alertList: ['攀登作业'],
                    img: 'assets/img/products/1390024.png',
                    name: '3M™ PROTECTA® FIRST™背心式攀爬安全带1390024',
                    productDesc: 'PROTECTA®的FIRST™系列坠落防护产品的设计围绕一个简单的理念：打造超值的基础坠落防护产品系列。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000306312/',
                        text: '查看3M™ PROTECTA® FIRST™背心式攀爬安全带详情'
                    }],
                },
                {
                    id: 19,
                    type: '锚点连接件',
                    alertList: ['交叉作业'],
                    img: 'assets/img/products/1201390.png',
                    name: '3M™ DBI-SALA®织带脚手架拴环1201390',
                    productDesc: '我们的锚点连接件以优质材质制成，可确保高强度和耐久度，经得起极端环境的考验。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000431257/',
                        text: '查看3M™ DBI-SALA®织带脚手架拴环详情'
                    }],
                },
                {
                    id: 20,
                    type: '连接件',
                    alertList: ['交叉作业'],
                    img: 'assets/img/products/3101316.png',
                    name: 'DBI-SALA® Nano-Lok™小型速差自控器3101316',
                    productDesc: '配有单个自锁挂钩连接器\n' +
                        '配有两个挂钩\n' +
                        ' 2.0m涤纶织带缆绳，热塑性外壳',
                },
                {
                    id: 21,
                    type: '锚点连接件',
                    alertList: ['洞口作业'],
                    img: 'assets/img/products/2104560.png',
                    name: '3M™ DBI-SALA®混凝土用D型环锚点连接件2104560',
                    productDesc: '我们的锚点连接件以优质材质制成，可确保高强度和耐久度，经得起极端环境的考验。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000431200/',
                        text: '查看3M™ DBI-SALA®混凝土用D型环锚点连接件详情'
                    }],
                },
                {
                    id: 22,
                    type: '锚点连接件',
                    alertList: ['洞口作业'],
                    img: 'assets/img/products/2100080.png',
                    name: '3M™ DBI-SALA®门窗侧柱锚点连接件2100080',
                    productDesc: '我们的锚点连接件以优质材质制成，可确保高强度和耐久度，经得起极端环境的考验。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000431281/',
                        text: '查看3M™ DBI-SALA®门窗侧柱锚点连接件详情'
                    }],
                },
                {
                    id: 23,
                    type: '连接件',
                    alertList: ['洞口作业'],
                    img: 'assets/img/products/3100422.png',
                    name: '3M™ PROTECTA® Rebel™ 2米织带 3100422',
                    productDesc: 'Rebel™织带救生索代表经济自锁速差器（SRL）的重大提升。为追求经济实惠，雇主可以用功能多样且更为安全的11英尺（3.3米）SRL替代简单安全绳。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100323975/',
                        text: '查看3M™ PROTECTA® Rebel™ 2米织带详情'
                    }],
                },
                {
                    id: 24,
                    type: '锚点连接件',
                    alertList: ['临边作业'],
                    img: 'assets/img/products/7602060.png',
                    name: '3M™ DBI-SALA® Sayfline™钢缆水平生命线系统7602060',
                    productDesc: 'Sayfline™钢缆系统极为便携，适用于焊接施工、火花溅射或环境恶劣的情形，或存在低净空的场所。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000434147/',
                        text: '查看3M™ DBI-SALA® Sayfline™钢缆水平生命线系统详情'
                    }],
                },
            ],
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
        var tempDate = _pub.getStorage('temp-construction-modal') || '';
        var currentDate = new Date().Format("yyyy-MM-dd");
        this.showInstruction = false;// (tempDate != currentDate);
        this.showInstruction = (tempDate != currentDate);

        let alertList = this.alertList,
            curAlertList;

        switch (sceneIndex) {
            case 0:
                curAlertList = alertList.filter(item => {
                    if (item.name == '攀登作业') {
                        item.productTypeList = [
                            {
                                name: '锚点连接件',
                                icon: 'assets/img/icon_maodian.png?v20230620',
                                text: '根据攀登作业建筑结构的类型选择适用的锚点连接件，例如：3M钢缆锚点、3M Lad-saf垂直生命线、3M临时垂直生命线等。',
                                img: 'assets/img/damage_pandeng_lianjiejian.png?v20230522'
                            },
                            {
                                name: '安全带',
                                icon: 'assets/img/icon_anquandai.png?v20230620',
                                text: '全身式安全带，并配备前胸、后背D型环。',
                                img: 'assets/img/damage_pandeng_anquandai.png?v20230522'
                            },
                            {
                                name: '连接件',
                                icon: 'assets/img/icon_lianjiejian.png?v20230620',
                                text: '首选速差器或双钩缓冲安全绳。',
                                img: 'assets/img/damage_pandeng_lianjiejian.png?v20230522'
                            },
                        ]
                    }
                    return item.name === '攀登作业' || item.name === '悬空作业' || item.name === '操作平台' || item.name === '交叉作业'
                });
                break;
            case 1:
                curAlertList = alertList.filter(item => {
                    return item.name === '洞口作业' || item.name === '临边作业' || item.name === '操作平台'
                });
                break;
            case 2,3:
                curAlertList = alertList.filter(item => {
                    if (item.name == '攀登作业') {
                        item.productTypeList = [
                            {
                                name: '锚点连接件',
                                icon: 'assets/img/icon_maodian.png?v20230620',
                                text: '根据攀登作业建筑结构的类型选择适用的锚点连接件，例如：3M钢缆锚点、3M Lad-saf垂直生命线、3M临时垂直生命线等。',
                                img: 'assets/img/damage_chuizhi_lianjiejian.png'
                            },
                            {
                                name: '安全带',
                                icon: 'assets/img/icon_anquandai.png?v20230620',
                                text: '全身式安全带，并配备前胸、后背D型环。',
                                img: 'assets/img/damage_chuizhi_anquandai.png'
                            },
                            {
                                name: '连接件',
                                icon: 'assets/img/icon_lianjiejian.png?v20230620',
                                text: '首选速差器或双钩缓冲安全绳。',
                                img: 'assets/img/damage_chuizhi_lianjiejian.png'
                            },
                        ]
                    }
                    return item.name === '洞口作业' || item.name === '临边作业' || item.name === '操作平台' || item.name === '攀登作业'
                });
                break;
            default:
                return;
        }
        this.curAlertList = curAlertList;

        this.curProductTypeList = this.curAlertList[this.curAlertIndex].productTypeList;
        this.curProductList = this.productList;
        var sceneItem = this.sceneList[this.sceneIndex];
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
            _pub.setStorage('temp-construction-modal', currentDate);
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
            this.solutionIndex = -1;
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

            switch (this.sceneIndex) {
                case 0:
                    jieshuoSrc = "./assets/img/jieshuo_jianzhugongdi.mp3";
                    curAlertList = alertList.filter(item => {
                        if (item.name == '攀登作业') {
                            item.productTypeList = [
                                {
                                    name: '锚点连接件',
                                    icon: 'assets/img/icon_maodian.png?v20230620',
                                    text: '根据攀登作业建筑结构的类型选择适用的锚点连接件，例如：3M钢缆锚点、3M Lad-saf垂直生命线、3M临时垂直生命线等。',
                                    img: 'assets/img/damage_pandeng_lianjiejian.png?v20230522'
                                },
                                {
                                    name: '安全带',
                                    icon: 'assets/img/icon_anquandai.png?v20230620',
                                    text: '全身式安全带，并配备前胸、后背D型环。',
                                    img: 'assets/img/damage_pandeng_anquandai.png?v20230522'
                                },
                                {
                                    name: '连接件',
                                    icon: 'assets/img/icon_lianjiejian.png?v20230620',
                                    text: '首选速差器或双钩缓冲安全绳。',
                                    img: 'assets/img/damage_pandeng_lianjiejian.png?v20230522'
                                },
                            ]
                        }
                        return item.name === '攀登作业' || item.name === '悬空作业' || item.name === '操作平台' || item.name === '交叉作业'
                    });
                    break;
                case 1:
                    jieshuoSrc = "./assets/img/jieshuo_shinei.mp3";
                    curAlertList = alertList.filter(item => {
                        return item.name === '洞口作业' || item.name === '临边作业' || item.name === '操作平台'
                    });
                    break;
                case 2:
                    jieshuoSrc = "./assets/img/jieshuo_louding.mp3";
                    curAlertList = alertList.filter(item => {
                        if (item.name == '攀登作业') {
                            item.productTypeList = [
                                {
                                    name: '锚点连接件',
                                    icon: 'assets/img/icon_maodian.png?v20230620',
                                    text: '根据攀登作业建筑结构的类型选择适用的锚点连接件，例如：3M钢缆锚点、3M Lad-saf垂直生命线、3M临时垂直生命线等。',
                                    img: 'assets/img/damage_chuizhi_lianjiejian.png'
                                },
                                {
                                    name: '安全带',
                                    icon: 'assets/img/icon_anquandai.png?v20230620',
                                    text: '全身式安全带，并配备前胸、后背D型环。',
                                    img: 'assets/img/damage_chuizhi_anquandai.png'
                                },
                                {
                                    name: '连接件',
                                    icon: 'assets/img/icon_lianjiejian.png?v20230620',
                                    text: '首选速差器或双钩缓冲安全绳。',
                                    img: 'assets/img/damage_chuizhi_lianjiejian.png'
                                },
                            ]
                        }
                        return item.name === '洞口作业' || item.name === '临边作业' || item.name === '操作平台' || item.name === '攀登作业'
                    });
                    // jieshuoSrc = "./assets/img/jieshuo_jiaohua.mp3?v20230329";
                    break;
                default:
                    // jieshuoSrc = "";
                    return;
            }
            // console.log("场景名2：", this.sceneIndex, sceneList.name);
            // console.log("现有作业2：", curAlertList);

            this.curAlertList = curAlertList;
            this.jieshuoSrc = jieshuoSrc;
            jieshuo.pause();
            jieshuo.currentTime = 0;
            onPlayJieshuo();
            console.log(this.jieshuoSrc + ",allowPlay: " + allowPlay + "，jieshuo pause : " + jieshuo.paused);
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
        onSolutionClick(index) {
            this.solutionIndex = index;
            this.productType = index;
            this.curProductIndex = 0;
            this.curProductTypeIndex = 0;
            this.newProductList = this.productList;
            this.showScenePreview = false;
            var sceneItem = this.sceneList[this.sceneIndex];
            var solutionItem = sceneItem.solutionList[this.solutionIndex];
            this.showProductList();
            var title = '场景页面-建筑-' + sceneItem.name;
            var name = '场景页面-建筑-' + sceneItem.name + '-安全解决方案';
            var attr1 = solutionItem.name;
            var attr2 = '';

            typeof addOpenPageEvent == 'function' && addOpenPageEvent(title + '-防护解决方案弹框-' + solutionItem.name);
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
            switch (curProductType) {
                case '锚点连接件':
                    this.curProductList = newProductList.filter(item => {
                        return item.type === '锚点连接件'
                    });
                    break;
                case '安全带':
                    this.curProductList = newProductList.filter(item => {
                        return item.type === '安全带'
                    });
                    break;
                case '连接件':
                    this.curProductList = newProductList.filter(item => {
                        return item.type === '连接件'
                    });
                    break;
                default:
                    this.curProductList = newProductList.filter(item => {
                        return item.type === '锚点连接件'
                    });
            }

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

                    var solutionItem = sceneItem.solutionList[this.solutionIndex];
                    var pageTitle = '危害弹框-建筑-' + sceneItem.name;
                    typeof addOpenPageEvent == 'function' && addOpenPageEvent('防护解决方案弹框-' + curAlert.name + '-' + solutionItem.solutionName);
    
                    break;

            }
        },
        onClickProductType(index, modalType) {
            this.curProductTypeIndex = index;
            this.curProductIndex = 0;

            let sceneList = this.sceneList,
                productList = this.productList,
                curProductList = this.curProductList,
                newProductList = this.newProductList,
                curAlertList = this.curAlertList,
                curAlertIndex = this.curAlertIndex,
                curAlert = curAlertList[curAlertIndex],
                curProductTypeList = curAlert.productTypeList,
                curProductType = curProductTypeList[index].name;

            this.curProductTypeList = curProductTypeList;

            switch (curProductType) {
                case '锚点连接件':
                    this.curProductList = newProductList.filter(item => {
                        return item.type === '锚点连接件'
                    });
                    break;
                case '安全带':
                    this.curProductList = newProductList.filter(item => {
                        return item.type === '安全带'
                    });
                    break;
                case '连接件':
                    this.curProductList = newProductList.filter(item => {
                        return item.type === '连接件'
                    });
                    break;
                default:
                    this.curProductList = newProductList;
            }
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
            var name = '防护解决方案弹框-建筑-' + sceneItem.name + '-去京东看看';
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
