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


let initScene = getUrlParam("scene") || 'tour0.xml?v20231211',
    sceneIndex = parseInt(getUrlParam("sceneIndex")) || 0;
jieshuoSrc = "./assets/img/jieshuo_zhuangxiehuo.mp3";
switch (sceneIndex) {
    case 0:
        jieshuoSrc = "./assets/img/jieshuo_zhuangxiehuo.mp3";
        break;
    case 1:
        jieshuoSrc = "./assets/img/jieshuo_richangzuoye.mp3";
        break;
    case 2:
        jieshuoSrc = "./assets/img/jieshuo_jianxiudiaozhuang.mp3";
        break;
    case 3:
        jieshuoSrc = "./assets/img/jieshuo_hanjiedamo.mp3";
        break;
    case 4:
        jieshuoSrc = "./assets/img/jieshuo_wushuichuli.mp3";
        break;
    case 5:
        jieshuoSrc = "./assets/img/jieshuo_yingjixiangying.mp3";
        break;
    default:
        jieshuoSrc = "";
}
console.log(initScene, sceneIndex);

const app = Vue.createApp({
    data() {
        return {
            krpano: null, // 左侧选中的场景索引
            sceneIndex, // 场景索引
            alertIndex: -1, // 危害点索引
            curSolutionIndex: -1, //解决方案索引
            curProductIndex: 0,//产品索引
            productType: 0,//产品类型索引
            showScenePreview: true,
            showAlertBox: false,
            showDamageModal: false,
            showProductModal: false,
            jieshuoSrc,
            curHotspot: '',
            highLightArray: [],
            sceneList: [
                //装卸货
                {
                    name: '制程',
                    previewImg: 'assets/img/scene_zhuangxiehuo.png', // 下方预览图
                    tour: 'tour0.xml?v20231211',
                    startScene: 'scene_0', // 解决方案按钮
                    alertList: [ 
                        {
                            name: '高空坠落',
                            btn: 'assets/img/btn_zhuiluo.png', //右侧按扭
                            btnActive: 'assets/img/btn_zhuiluo_on.png', //右侧按扭
                            text: '槽罐车卸货前取样检测时，作业人员需要站在槽罐车上方，存在高空坠落风险', //点击红点后的弹窗文字
                            solutionName: '坠落防护',
                            alertBoxIcon: 'assets/img/icon_zlfh.png', //弹窗图标
                            spotArray: ['zxh_zhuiluo1', 'zxh_zhuiluo2'], //tour.xml中的hotspot
                        },
                        {
                            name: '有害气态物',
                            btn: 'assets/img/btn_qitaiwu.png',
                            btnActive: 'assets/img/btn_qitaiwu_on.png',
                            text: '槽罐车卸货前取样检测时，存在有害气态物的危害',
                            solutionName: '呼吸防护',
                            alertBoxIcon: 'assets/img/icon_qitaiwu.png',
                            spotArray: ['zxh_qitaiwu1'],
                        },
                        {
                            name: '液体喷溅',
                            btn: 'assets/img/btn_penjian.png',
                            btnActive: 'assets/img/btn_penjian_on.png',
                            text: '槽罐车卸货前取样检测时，存在液体喷溅的风险',
                            solutionName: '眼面防护',
                            alertBoxIcon: 'assets/img/icon_penjian.png',
                            spotArray: ['zxh_penjian1'],
                        },
                    ],
                },
                //日常作业
                {
                    name: '移动测听车服务场景',
                    previewImg: 'assets/img/scene_richangzuoye.png',
                    tour: 'tour1.xml?v20231211',
                    startScene: 'scene_1', // 解决方案按钮
                    alertList: [
                        {
                            name: '有害气态物',
                            btn: 'assets/img/btn_qitaiwu.png',
                            btnActive: 'assets/img/btn_qitaiwu_on.png',
                            text: '巡检或者采样时，装置可能有泄露风险，产生有机蒸气等有害气态物',
                            solutionName: '呼吸防护',
                            alertBoxIcon: 'assets/img/icon_qitaiwu.png',
                            spotArray: ['rczy_qitaiwu1', 'rczy_qitaiwu2'],
                        },
                        {
                            name: '噪音',
                            btn: 'assets/img/btn_zy.png',
                            btnActive: 'assets/img/btn_zy_on.png',
                            text: '巡检过程中，装置处于运行状态，周边存在高噪声危害',
                            solutionName: '听力防护',
                            alertBoxIcon: 'assets/img/icon_zy.png',
                            spotArray: ['rczy_zaoyin1', 'rczy_zaoyin2'],
                        },
                        {
                            name: '液体飞溅',
                            btn: 'assets/img/btn_feijian.png',
                            btnActive: 'assets/img/btn_feijian_on.png',
                            text: '装置采样时，可能存在液体飞溅的风险',
                            solutionName: '眼面防护',
                            alertBoxIcon: 'assets/img/icon_feijian.png',
                            spotArray: ['rczy_feijian1'],
                        },
                    ],
                },
                //应急响应
                {
                    name: '配套方案',
                    previewImg: 'assets/img/scene_yingjixiangying.png',
                    tour: 'tour2.xml?v20231211',
                    startScene: 'scene_2', // 解决方案按钮
                    alertList: [
                        {
                            name: '应急救援装备',
                            btn: 'assets/img/btn_yingjijiuyuan.png',
                            btnActive: 'assets/img/btn_yingjijiuyuan_on.png',
                            text: '应急救援人员在进入现场或某些装置时，可能面临高空坠落风险或IDLH环境',
                            solutionName: '应急救援',
                            alertBoxIcon: 'assets/img/icon_yingjijiuyuan.png',
                            spotArray: ['yjxy_jiuyuanzhuangbei1'],
                        },
                    ],
                },
                //高处作业
                // {
                //     name: '高处作业',
                //     previewImg: 'assets/img/scene_diaozhuangzuoye.png',
                //     tour: 'tour3.xml?v20231211',
                //     startScene: 'scene_3', // 解决方案按钮
                //     alertList: [
                //         {
                //             name: '高空坠落',
                //             btn: 'assets/img/btn_zhuiluo.png',
                //             btnActive: 'assets/img/btn_zhuiluo_on.png',
                //             text: '装置检修时，作业人员需要攀爬脚手架或者在管廊结构上作业，存在高空坠落风险',
                //             solutionName: '坠落防护',
                //             alertBoxIcon: 'assets/img/icon_zlfh.png',
                //             spotArray: ['jxdz_zhuiluo1', 'jxdz_zhuiluo2', 'jxdz_zhuiluo3'],
                //         },
                //         {
                //             name: '冲击物',
                //             btn: 'assets/img/btn_cjw.png',
                //             btnActive: 'assets/img/btn_cjw_on.png',
                //             text: '检修作业时，需要使用工具从事机械作业，存在飞溅物冲击眼面部的风险',
                //             solutionName: '眼面防护',
                //             alertBoxIcon: 'assets/img/icon_cjw.png',
                //             spotArray: ['jxdz_cjw1'],
                //         },
                //     ],
                // },
                //焊接打磨
                // {
                //     name: '焊接打磨',
                //     previewImg: 'assets/img/scene_hanjiedamo.png',
                //     tour: 'tour4.xml?v20231211',
                //     startScene: 'scene_4', // 解决方案按钮
                //     alertList: [
                //         {
                //             name: '焊烟',
                //             btn: 'assets/img/btn_hanyan.png',
                //             btnActive: 'assets/img/btn_hanyan_on.png',
                //             text: '焊接作业时会产生大量焊烟',
                //             solutionName: '呼吸防护',
                //             alertBoxIcon: 'assets/img/icon_hanyan.png',
                //             spotArray: ['hjdm_hanyan1'],
                //         },
                //         {
                //             name: '焊接弧光',
                //             btn: 'assets/img/btn_hanjiehuguang.png',
                //             btnActive: 'assets/img/btn_hanjiehuguang_on.png',
                //             text: '焊接作业会产生强烈弧光，会对眼睛产生严重危害',
                //             solutionName: '眼面防护',
                //             alertBoxIcon: 'assets/img/icon_hanjiehuguang.png',
                //             spotArray: ['hjdm_hanjiehuguang1'],
                //         },
                //         {
                //             name: '金属飞溅物',
                //             btn: 'assets/img/btn_jinshufeijian.png',
                //             btnActive: 'assets/img/btn_jinshufeijian_on.png',
                //             text: '打磨作业会产生高速碎屑，可能对眼面部产生冲击危害',
                //             solutionName: '眼面防护',
                //             alertBoxIcon: 'assets/img/icon_jinshufeijian.png',
                //             spotArray: ['hjdm_jinshufeijian1', 'hjdm_jinshufeijian2'],
                //         },
                //         {
                //             name: '噪音',
                //             btn: 'assets/img/btn_zy.png',
                //             btnActive: 'assets/img/btn_zy_on.png',
                //             text: '打磨及焊接作业过程中会伴随高分贝噪音',
                //             solutionName: '听力防护',
                //             alertBoxIcon: 'assets/img/icon_zy.png',
                //             spotArray: ['hjdm_zaoyin1', 'hjdm_zaoyin2'],
                //         },
                //         {
                //             name: '粉尘',
                //             btn: 'assets/img/btn_fc.png',
                //             btnActive: 'assets/img/btn_fc_on.png',
                //             text: '在大修现场，焊接打磨作业非常普遍，伴随着焊接打磨会产生大量有害粉尘，像焊烟、金属粉尘等。吸入这些有害粉尘可能导致各类急性和长期的健康影响，因此必须采用正确有效的呼吸防护。',
                //             solutionName: '呼吸防护',
                //             alertBoxIcon: 'assets/img/icon_fc.png',
                //             spotArray: ['hjdm_fenchen1'],
                //         },
                //     ],
                // },
                //有限空间
                // {
                //     name: '有限空间',
                //     previewImg: 'assets/img/scene_wushuichuli.png',
                //     tour: 'tour5.xml?v20231211',
                //     startScene: 'scene_5', // 解决方案按钮
                //     alertList: [
                //         {
                //             name: '有害气态物',
                //             btn: 'assets/img/btn_qitaiwu.png',
                //             btnActive: 'assets/img/btn_qitaiwu_on.png',
                //             text: '有限空间内，可能存在高浓度的有害气态物或缺氧',
                //             solutionName: '呼吸防护',
                //             alertBoxIcon: 'assets/img/icon_qitaiwu.png',
                //             spotArray: ['wscl_qitaiwu1'],
                //         },
                //         {
                //             name: '高空坠落',
                //             btn: 'assets/img/btn_zhuiluo.png',
                //             btnActive: 'assets/img/btn_zhuiluo_on.png',
                //             text: '当作业人员需要进出有限空间时，存在高空坠落风险',
                //             solutionName: '坠落防护',
                //             alertBoxIcon: 'assets/img/icon_zlfh.png',
                //             spotArray: ['wscl_zhuiluo1'],
                //         },
                //     ],
                // },
            ],
            curAlertIndex: 0,
            curAlertList: [],
            solutionList: [ //最下面一栏是解决方案
                {
                    solutionName: '呼吸防护',
                    solutionIcon: 'assets/img/icon_mask.png',
                },
                {
                    solutionName: '听力防护',
                    solutionIcon: 'assets/img/icon_earmuff.png',
                },
                {
                    solutionName: '眼面防护',
                    solutionIcon: 'assets/img/icon_hat.png',
                },
                {
                    solutionName: '坠落防护',
                    solutionIcon: 'assets/img/icon_fall.png',
                },
                {
                    solutionName: '应急救援',
                    solutionIcon: 'assets/img/icon_jiuyuan.png',
                },
            ],
            curSolutionList: [],
            productList: [
                {
                    name: '3M™ DBI-SALA®横梁滑车2103143',
                    id: 1,
                    alertList: ['高空坠落'],
                    solutionName: ['坠落防护'],
                    sceneName: ['装卸货'],
                    productType: '锚点连接件',
                    img: 'assets/img/products/2103143.png',
                    productDesc: '我们的锚点连接件以优质材质制成，可确保高强度和耐久度，经得起极端环境的考验。',
                    productLink: [
                        {link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000431279/', text: '查看详情'},
                    ],
                },
                {
                    name: '3M™ PROTECTA® Rebel™自锁速差器',
                    id: 2,
                    alertList: ['高空坠落'],
                    solutionName: ['坠落防护'],
                    sceneName: ['装卸货'],
                    productType: '连接件',
                    img: 'assets/img/products/3590511.png',
                    productDesc: 'Rebel™自锁速差器（SRL）具有超强且轻量的合成壳体，经久耐用，可在不牺牲性能或安全的前提下提供经济实惠的坠落防护解决方案。',
                    productLink: [
                        {link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100323976/', text: '查看详情'},
                    ],
                },
                {
                    name: '3M™ DBI-SALA® ExoFit™ Lite 全身式安全带 1103591',
                    id: 3,
                    alertList: ['高空坠落', '应急救援装备'],
                    solutionName: ['坠落防护', '应急救援'],
                    sceneName: ['装卸货', '高处作业', '有限空间', '应急响应'],
                    productType: '安全带',
                    img: 'assets/img/products/1103591.png',
                    productDesc: '全身式安全带是作业人员进行高空作业时最重要的防护设备。安全带提供的舒适性和可靠性，直接影响员工的工作生产效率。',
                    productLink: [
                        {link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101091035/', text: '查看详情'},
                    ],
                },
                {
                    name: '3M™ HF-802扬声器振动膜版硅胶半面型防护面罩',
                    id: 4,
                    alertList: ['有害气态物', '粉尘'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['装卸货', '日常作业', '焊接打磨'],
                    img: 'assets/img/products/HF-802SD.png',
                    productDesc: '创新HF-800系列可重复使用半面罩，能提供可靠方便的呼吸保护，便捷的装配体验，更低的呼吸阻力，有助于防颗粒物以及各种气体和蒸气的侵袭，并保证佩戴及使用的舒适性。',
                    productLink: [
                        {link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101086261/', text: '查看详情'},
                    ],
                },
                {
                    name: '3M™ D8006CN 多种气体/蒸气滤毒盒',
                    id: 5,
                    alertList: ['有害气态物', '焊烟'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['装卸货', '日常作业'],
                    img: 'assets/img/products/D8006CN.png',
                    productDesc: '多用气体/蒸气滤毒盒能够在一系列不同环境下提供防气体和蒸气保护。推荐应用包括装配、分批加料、化学品清理、化学品迁移、清洁、有害废物的操作、喷漆、熔融金属浇注。由于此滤毒盒适用于多种不同应用，以降低安全设备的库存需求和培训要求。',
                    productLink: [
                        {link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101079002/', text: '查看详情'},
                    ],
                },
                {
                    name: '3M™ 硅胶全面型防护面罩 6800',
                    id: 6,
                    alertList: ['有害气态物'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['装卸货'],
                    img: 'assets/img/products/6800.png',
                    productDesc: '如结合适当的3M™ 颗粒物过滤器或滤盒，可以增强防护能力，防颗粒物和/或一系列气体和蒸气的侵袭。3M™ 6000系列全面具面罩有助于防某些空气污染物的侵袭。',
                    productLink: [
                        {link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301656/', text: '查看详情'},
                    ],
                },
                {
                    name: '3M™ 6006多用气体/蒸气滤毒盒',
                    id: 7,
                    alertList: ['有害气态物'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['装卸货'],
                    img: 'assets/img/products/6006.png',
                    productDesc: '3M™ 6006多用气体/蒸气滤毒盒能够在一系列不同环境下提供防气体和蒸气保护。',
                    productLink: [
                        {link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301629/', text: '查看详情'},
                    ],
                },
                {
                    name: '3M™ GA500超强防雾防护眼罩 GA501 透明',
                    id: 8,
                    alertList: ['液体喷溅', '液体飞溅', '冲击物'],
                    solutionName: ['眼面防护'],
                    sceneName: ['装卸货', '日常作业'],
                    img: 'assets/img/products/GA501.png',
                    productDesc: '3M™ GA501防尘防液体飞溅护目镜（无色镜片，超强防雾）优异的防雾性能，使您工作时的视野更清晰，从而确保您工作的安全性。',
                    productLink: [
                        {link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101340348/', text: '查看详情'},
                    ],
                },
                {
                    name: '3M™ 82520-10000 H24M 铝制面屏支架',
                    id: 9,
                    alertList: ['液体喷溅', '焊接弧光', '冲击物', '金属飞溅物'],
                    solutionName: ['眼面防护'],
                    sceneName: ['装卸货', '焊接打磨'],
                    img: 'assets/img/products/82520.png',
                    productDesc: '多用途面屏支架，可与大多数3M™面屏配合使用，以提供面部防护。经设计可适配市场上大部分安全帽产品，不会对大多数安全帽上配置的耳罩造成干扰。',
                    productLink: [
                        {link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000057691/', text: '查看详情'},
                    ],
                },
                {
                    name: '3M™ 82701-00000 WP96 防化学透明聚碳酸酯面屏',
                    id: 10,
                    alertList: ['液体喷溅', '焊接弧光', '冲击物', '金属飞溅物'],
                    solutionName: ['眼面防护'],
                    sceneName: ['装卸货', '焊接打磨'],
                    img: 'assets/img/products/82701.png',
                    productDesc: '聚碳酸酯面屏提供针对高速粒子及飞溅物的面部防护；需要与3M头箍搭配使用，安装方便简单。需要另外配备安全眼镜对眼部进行防护。',
                    productLink: [
                        {link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000057733/', text: '查看详情'},
                    ],
                },
                {
                    name: '3M™ PELTOR™ X4P3E 挂安全帽式耳罩',
                    id: 11,
                    alertList: ['噪音'],
                    solutionName: ['听力防护'],
                    sceneName: ['日常作业', '焊接打磨'],
                    img: 'assets/img/products/X4P3.png',
                    productDesc: '1. 标称降噪值SNR为32dB\n' +
                        '2. 挂安全帽使用，解决同时佩戴安全帽和耳罩的兼容性问题\n' +
                        '3. 具有现代感的人体工程学设计，头带版于金属配件上包覆绝缘材料，安全且提供长时间佩戴的舒适度以及产品耐用度\n' +
                        '4. 可搭配3M E-A-Rfit 双耳防护验证系统测试个人声衰减值（PAR）',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000137014/', text: '查看详情'
                    }],
                    product360: {src: 'X4P3E', num: 24,},
                },
                {
                    name: '3M™ E-A-R™ Push-Ins™ 318-1005 带线耳塞',
                    id: 12,
                    alertList: ['噪音'],
                    solutionName: ['听力防护'],
                    sceneName: ['日常作业', '焊接打磨'],
                    img: 'assets/img/products/318-1005.png',
                    productDesc: '3M™ E-A-R™ Push-Ins™ 免揉搓带线泡棉耳塞集舒适性、便利性与保护功能为一体。这类耳塞采用3M™ E-A-Rform™ 泡棉制成，拥有免揉搓设计与蓝色手柄，便于迅速而轻松地佩戴。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000177818/',
                        text: '查看详情'
                    }],
                    product360: {src: '318-1005', num: 20,},
                },
                {
                    name: '3M™ DBI-SALA® 弹性伸缩安全绳',
                    id: 13,
                    alertList: ['高空坠落'],
                    solutionName: ['坠落防护'],
                    sceneName: ['高处作业'],
                    productType: '连接件',
                    img: 'assets/img/products/DBI-SALA.png',
                    productDesc: '3M安全绳包含缓冲包，缓冲包可减少冲击力，在坠落制动事件中限制坠落对身体的作用力，以降低伤害提高安全性。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101124860/', text: '查看详情'
                    }],
                },
                {
                    name: '3M™ DBI-SALA® EZ-Line™可回收水平生命线系统7605060',
                    id: 14,
                    alertList: ['高空坠落'],
                    solutionName: ['坠落防护'],
                    sceneName: ['高处作业'],
                    productType: '水平生命线',
                    img: 'assets/img/products/EZ-Line.png',
                    productDesc: 'EZ Line™是当今市面上用户友好度高且安装、移除、存储便捷的水平救生索系统。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000434256/', text: '查看详情'
                    }],
                },
                {
                    name: '3M™ DBI-SALA® Nano-Lok™双腿快速连接自锁速差器',
                    id: 15,
                    alertList: ['高空坠落'],
                    solutionName: ['坠落防护'],
                    sceneName: ['高处作业'],
                    productType: '连接件',
                    img: 'assets/img/products/3101280.png',
                    productDesc: 'Nano Lok™采用经济设计，使用方便，适合直接连接大多数安全带。极其小巧轻量的设计在背后几乎无法察觉，不影响作业人员作业，是理想的安全绳替代品。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000433926/?preselect=329002072', text: '查看详情'
                    }],
                },
                /*{
                    name: '3M™ SecureFit™ 300中国款防刮擦防护眼镜 SF301AS',
                    id: 16,
                    alertList: ['冲击物'],
                    solutionName: ['眼面防护'],
                    sceneName: ['高处作业'],
                    img: 'assets/img/products/SF301AS.png',
                    productDesc: '3M™ SecureFit™ SF300亚洲款系列根据亚洲人头型脸型设计，更适合中国客户使用；专利3M™压力扩散镜腿技术（专利号：CN201230418652.9），该技术可将压力扩散至耳部，从而提升镜框舒适度并保证多种作用力下的贴合稳定性，具有柔软的可调节式鼻垫，更舒适。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100662083/', text: '查看详情'
                    }],
                    product360: {src: 'SF301AF', num: 24,},
                },*/
                {
                    name: '3M™ Speedglas™ G5-01TW Adflo 焊接呼吸防护套装',
                    id: 17,
                    alertList: ['焊烟', '焊接弧光', '金属飞溅物'],
                    solutionName: ['呼吸防护', '眼面防护'],
                    sceneName: ['焊接打磨'],
                    img: 'assets/img/products/G5-01.png',
                    productDesc: '这款配有Adflo电动送风净化呼吸器（颗粒过滤）的Speedglas G5-01集呼吸防护和卓越视觉于一身，并采用可掀起式设计，点焊模式极大地舒缓焊接眼部疲劳。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100827281/', text: '查看详情'
                    }],
                },
                {
                    name: '3M™ DBI-SALA® Advanced™ 5件式8518000',
                    id: 19,
                    alertList: ['高空坠落', '应急救援装备'],
                    solutionName: ['坠落防护', '应急救援'],
                    sceneName: ['有限空间', '应急响应'],
                    productType: '锚点连接件',
                    img: 'assets/img/products/8518000.png',
                    productDesc: 'Advanced™系列举升系统设计用于检查井和有限空间进入/回收应用。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000431608/', text: '查看详情'
                    }],
                },
                {
                    name: '3M™ DBI-SALA®铝合金三脚架8000010',
                    id: 18,
                    alertList: ['高空坠落', '应急救援装备'],
                    solutionName: ['坠落防护', '应急救援'],
                    sceneName: ['有限空间', '应急响应'],
                    productType: '锚点连接件',
                    img: 'assets/img/products/8000010.png',
                    productDesc: '在进入有限空间或在有限空间实施救援时，设备运行必须有效而迅速。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000358341/', text: '查看详情'
                    }],
                },
                {
                    name: '3M™ DBI-SALA® Advanced™绞盘8518558',
                    id: 20,
                    alertList: ['高空坠落', '应急救援装备'],
                    solutionName: ['坠落防护', '应急救援'],
                    sceneName: ['有限空间', '应急响应'],
                    productType: '连接件',
                    img: 'assets/img/products/8518558.png',
                    productDesc: '绞盘，带60英尺（18米）的3/16英寸（5毫米）不锈钢钢丝绳、旋转弹簧钩、安装支架。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000431753/', text: '查看详情'
                    }],
                },
                {
                    name: '3M™ DBI-SALA® Sealed-Blok™自锁速差器',
                    id: 21,
                    alertList: ['高空坠落', '应急救援装备'],
                    solutionName: ['坠落防护', '应急救援'],
                    sceneName: ['有限空间', '应急响应'],
                    productType: '连接件',
                    img: 'assets/img/products/Sealed-Blok.png',
                    productDesc: '50英尺（15米）的3/16英寸（5毫米）不锈钢钢丝绳，带旋转弹簧钩、3向回缩绞盘和安装支架、锚点安全钩，4英尺（1.2米）钢缆系挂适配器。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000433954/', text: '查看详情'
                    }],
                },
                {
                    name: 'Scott CG-7供气式长管呼吸器',
                    id: 23,
                    alertList: ['有害气态物'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['有限空间'],
                    img: 'assets/img/products/CG-7.png',
                    productDesc: '3MTM ScottTM CG-7 长管呼吸器，秉承模块化设计理念，由移动气源小车和供气小车两部分组成。产品配置灵活，紧凑便携，使用方便，可满足不同用户在不同环境下的呼吸保护或应急逃生之需。',
                },
                {
                    name: 'Scott iPak/3265E',
                    id: 22,
                    alertList: ['有害气态物', '应急救援装备'],
                    solutionName: ['呼吸防护', '应急救援'],
                    sceneName: ['应急响应', '有限空间'],
                    productType: '',
                    img: 'assets/img/products/3266E.png',
                    productDesc: 'iPak 20正压式消防空气呼吸器增加了压力平视显示装置 (HUD)、同伴指示灯等创新设计，同时具备性能卓越的供气阀以及特有的振动报警功能。使用安全、佩戴舒适、配置灵活、功能强大，可广泛应用于消防、缺氧、有毒有害气体场所的安全防护、救援与逃生。',
                },
                /* {
                     name: '3M™ DBI-SALA固定织带1002002',
                     id: 24,
                     alertList: ['高空坠落'],
                     solutionName: ['坠落防护'],
                     sceneName: ['装卸货'],
                     productType: '锚点连接件',
                     img: 'assets/img/products/1002002.png',
                     productDesc: '我们的锚点连接件以优质材质制成，可确保高强度和耐久度，经得起极端环境的考验。',
                     productLink: [{
                         link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000431178/', text: '查看详情'
                     }],
                 },*/
                /* {
                     name: 'Uni8水平生命线系统',
                     id: 25,
                     alertList: ['高空坠落'],
                     solutionName: ['坠落防护'],
                     sceneName: ['装卸货'],
                     productType: '锚点连接件',
                     img: 'assets/img/products/Uni8.png',
                     productDesc: 'Uni8水平生命线系统：永久性水平生命线系统可用于区域限制或坠落悬挂，适合多种应用。这些系统采用模块化、多基座设计，可容纳各种钢梁和混凝土梁。通过连接安全绳，允许用户完全自动地移动。',
                 },*/
                {
                    name: '3M™ DBI-SALA® 固定织带 1003000',
                    id: 33,
                    alertList: ['高空坠落'],
                    solutionName: ['坠落防护'],
                    sceneName: ['装卸货'],
                    productType: '锚点连接件',
                    img: 'assets/img/products/1003000.png',
                    productDesc: '我们的锚点连接件以优质材质制成，可确保高强度和耐久度，经得起极端环境的考验。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100324535/', text: '查看详情'
                    }],
                },
                {
                    name: '3M™ 8515CN N95 焊接用防颗粒物口罩',
                    id: 26,
                    alertList: ['焊烟'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['焊接打磨'],
                    img: 'assets/img/products/8515CN.png',
                    productDesc: '焊接防护口罩，适用于焊接、铜焊、金属铸造切割',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000547505/', text: '查看详情'
                    }],
                },
                {
                    name: '3M™ D3091CN P100颗粒物滤棉',
                    id: 27,
                    alertList: ['粉尘'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['焊接打磨'],
                    img: 'assets/img/products/D3091CN.png',
                    productDesc: '经NIOSH批准，可用于含有某些油性和非油性颗粒物的环境。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100809924/', text: '查看详情'
                    }],
                },
                {
                    name: '3M™ 9334CN+ FFP3防颗粒物口罩',
                    id: 28,
                    alertList: ['粉尘'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['焊接打磨'],
                    img: 'assets/img/products/9334CNPlus.png',
                    productDesc: '适合油性和非油性颗粒物防护，包括焊接、切割、铸造、打磨、装袋、清扫等各类作业，更适合高毒和放射性颗粒物的防护。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100663848/', text: '查看详情'
                    }],
                },
                {
                    name: '3M™ SecureFit300中国款防雾防护眼镜 SF301AF 透明',
                    id: 29,
                    alertList: ['金属飞溅物', '冲击物'],
                    solutionName: ['眼面防护'],
                    sceneName: ['焊接打磨', '高处作业'],
                    img: 'assets/img/products/SF301AF.png',
                    productDesc: '3M™ SecureFit™ SF300亚洲款系列根据亚洲人头型脸型设计，更适合中国客户使用。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100662084/', text: '查看详情'
                    }],
                    product360: {src: 'SF301AF', num: 24,},
                },
                {
                    name: '3M™ SF3701ASGAF-BLU 中国款OTG安全眼镜',
                    id: 30,
                    alertList: ['金属飞溅物'],
                    solutionName: ['眼面防护'],
                    sceneName: ['焊接打磨'],
                    img: 'assets/img/products/SF3701ASGAF.png',
                    productDesc: '1.“一镜两用”设计，既可以单独使用，也可以佩戴在近视眼镜外使用\n' +
                        '2. 压力扩散镜腿技术最大限度的减少安全眼镜配戴后对耳部附近造成的压力，提高佩戴舒适度，确保稳定性\n' +
                        '3.Scotchgard™超强防雾涂层同时具有防雾\n' +
                        '和防刮擦性能。\n' +
                        '4. 聚碳酸酯镜片，可阻隔99.9%的UVA和UVB紫外线， 符合ANSI Z87.1-2015的抗冲击标准\n' +
                        '5. 镜腿可调节，可调节多个角度，使用者可以根据自己的脸型和眼镜佩戴位置调节镜片角度。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101070144/', text: '查看详情'
                    }],
                },
                {
                    name: '3M™ SF3701AAS-BLU 中国款OTG安全眼镜',
                    id: 32,
                    alertList: ['冲击物'],
                    solutionName: ['眼面防护'],
                    sceneName: ['高处作业'],
                    img: 'assets/img/products/SF3701AAS.png',
                    productDesc: '3M™ SecureFit 3700 OTG 系列安全眼镜为客户需求而生。最常见的困扰来自于安全眼镜和矫视眼镜的相互刮擦和佩戴不舒适。因此3M研发了3M SecureFit3700OTG系列中国款安全眼镜。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101070142/', text: '查看详情'
                    }],
                },
            ],
            curProductList: [],
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
        var tempDate = _pub.getStorage('temp-chemical-industry-modal') || '';
        var currentDate = new Date().Format("yyyy-MM-dd");
        this.showInstruction = false;// (tempDate != currentDate);
        this.showInstruction = (tempDate != currentDate);

        this.curAlertList = this.sceneList[this.sceneIndex].alertList;
        let solutionNames = this.curAlertList.map(item => item.solutionName);
        this.curSolutionList = this.solutionList.filter(item => {
            return solutionNames.includes(item.solutionName)
        })
        var sceneItem = this.sceneList[this.sceneIndex];
        var targetName = '场景页面-化工-' + sceneItem.name;
        typeof addClabTrackerCommon == 'function' && addClabTrackerCommon(targetName);

        var pageSearch = '?scene=' + sceneItem.tour + '&sceneIndex=' + this.sceneIndex;
        var shareTitle = '3M个人安全防护元宇宙｜化工-' + sceneItem.name + '作业场景';
        var shareDesc = '沉浸式体验化工行业解决方案';
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
            _pub.setStorage('temp-chemical-industry-modal', currentDate);
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
            let solutionNames = this.curAlertList.map(item => item.solutionName);
            this.curSolutionList = this.solutionList.filter(item => {
                return solutionNames.includes(item.solutionName)
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

            switch (this.sceneIndex) {
                case 0:
                    jieshuoSrc = "./assets/img/jieshuo_zhuangxiehuo.mp3";
                    break;
                case 1:
                    jieshuoSrc = "./assets/img/jieshuo_richangzuoye.mp3";
                    break;
                case 2:
                    jieshuoSrc = "./assets/img/jieshuo_jianxiudiaozhuang.mp3";
                    break;
                case 3:
                    jieshuoSrc = "./assets/img/jieshuo_hanjiedamo.mp3";
                    break;
                case 4:
                    jieshuoSrc = "./assets/img/jieshuo_wushuichuli.mp3";
                    break;
                case 5:
                    jieshuoSrc = "./assets/img/jieshuo_yingjixiangying.mp3";
                    break;
                default:
                    jieshuoSrc = "";
                    return;
            }
            console.log("当前场景：" + sceneList[sceneIndex].name);
            console.log("危害点：", this.curAlertList);
            this.jieshuoSrc = jieshuoSrc;
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
        showProductList(index) {
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
            var title = '防护解决方案弹框-化工-' + sceneItem.name;
            var name = '防护解决方案弹框-化工-' + sceneItem.name + '-产品切换';
            var attr1 = solutionItem.solutionName;
            var attr2 = productItem.name;
            typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
        },
        onClickSolution(index) {
            this.curSolutionIndex = index;
            this.curHotspot = '';

            let sceneIndex = this.sceneIndex,
                sceneList = this.sceneList,
                sceneName = sceneList[sceneIndex].name,
                curAlertIndex = this.curAlertIndex,
                curAlertList = this.curAlertList,
                curSolutionIndex = this.curSolutionIndex,
                curSolutionList = this.curSolutionList,
                curSolution = curSolutionList[curSolutionIndex];

            this.curProductList = this.productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.solutionName.includes(curSolution.solutionName)
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
            console.log("当前产品列表：", this.curProductList);
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
            var name = '防护解决方案弹框-化工-' + sceneItem.name + '-去京东看看';
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
