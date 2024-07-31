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
    jieshuoSrc = "./assets/img/jieshuo_xuankuang.mp3?v20230329";
switch (sceneIndex) {
    case 0:
        jieshuoSrc = "./assets/img/jieshuo_xuankuang.mp3?v20230329";
        break;
    case 1:
        jieshuoSrc = "./assets/img/jieshuo_shaojie.mp3?v20230329";
        break;
    case 2:
        jieshuoSrc = "./assets/img/jieshuo_jiaohua.mp3?v20230329";
        break;
    case 3:
        jieshuoSrc = "./assets/img/jieshuo_liantie.mp3?v20230329";
        break;
    case 4:
        jieshuoSrc = "./assets/img/jieshuo_liangang.mp3?v20230329";
        break;
    case 5:
        jieshuoSrc = "./assets/img/jieshuo_zhagang.mp3?v20230329";
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
            showScenePreview: true,
            showAlertBox: false,
            showProductModal: false,
            jieshuoSrc,
            highLightArray: [],
            sceneList: [
                {
                    name: '选矿',
                    previewImg: 'assets/img/scene_xuankuang.png?v20230222',
                    tour: 'tour0.xml?v20231211',
                    startScene: 'scene_0',
                    alertList: [
                        {
                            name: '粉尘',
                            text: '采矿中的颗粒物',
                            solutionName: '呼吸防护',
                            solutionText: '防颗粒物 *铁矿粉中含有如As，Pb等有害重金属元素，所以建议使用KN95及以上防颗粒物口罩或滤棉',
                            btn: 'assets/img/btn_fc.png?v20230629',
                            btnActive: 'assets/img/btn_fc_on.png?v20230629',
                            alertBoxIcon: 'assets/img/icon_fc.png',
                            spotArray: ['xk_fc1', 'xk_fc2', 'xk_fc3'],
                        },
                        {
                            name: '噪音',
                            text: '设备运转过程中产生的高分贝噪声',
                            solutionName: '听力防护',
                            solutionText: '防高分贝噪声。采矿厂粉尘大，环境脏，建议使用不需要揉搓的耳塞或耳罩',
                            btn: 'assets/img/btn_zy.png?v20230222',
                            btnActive: 'assets/img/btn_zy_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_zy.png',
                            spotArray: ['xk_zaoyin1', 'xk_zaoyin2', 'xk_zaoyin3'],
                        },
                        {
                            name: '冲击物',
                            text: '选矿中有矿石飞溅',
                            solutionName: '眼面防护',
                            solutionText: '防颗粒飞溅物、粉尘。考虑现场环境情况，当选择眼罩时，建议选择具备卓越防雾功能的眼罩',
                            btn: 'assets/img/btn_cjw.png?v20230222',
                            btnActive: 'assets/img/btn_cjw_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_cjw.png',
                            spotArray: ['xk_cjw1', 'xk_cjw2', 'xk_cjw3'],
                        },
                    ],
                },
                {
                    name: '烧结',
                    previewImg: 'assets/img/scene_shaojie.png?v20230222',
                    tour: 'tour1.xml?v20231211',
                    startScene: 'scene_1',
                    alertList: [
                        {
                            name: '粉尘',
                            text: '烧结原料中的粉尘',
                            solutionName: '呼吸防护',
                            solutionText: '铁矿粉中含有如As,Pb等有害重金属元素，所以建议使用KN95及以上防颗粒物口罩或滤棉',
                            btn: 'assets/img/btn_fc.png?v20230629',
                            btnActive: 'assets/img/btn_fc_on.png?v20230629',
                            alertBoxIcon: 'assets/img/icon_fc.png',
                            spotArray: ['sj_fc1', 'sj_fc2', 'sj_fc3'],
                        },
                        {
                            name: '有害气体',
                            text: '烧结过程中产生的煤气、酸性气体',
                            solutionName: '呼吸防护',
                            solutionText: '铁矿粉中含有如As,Pb等有害重金属元素，所以建议使用KN95及以上防颗粒物口罩或滤棉',
                            btn: 'assets/img/btn_yhqt.png?v20230222',
                            btnActive: 'assets/img/btn_yhqt_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_hyqt.png',
                            spotArray: ['sj_yhqt1'],
                        },
                        {
                            name: '噪音',
                            text: '设备运转过程中产生的高分贝噪声',
                            solutionName: '听力防护',
                            solutionText: '防高分贝噪声。采矿厂粉尘大，环境脏，建议使用不需要揉搓的耳塞或耳罩',
                            btn: 'assets/img/btn_zy.png?v20230222',
                            btnActive: 'assets/img/btn_zy_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_zy.png',
                            spotArray: ['sj_zaoyin1', 'sj_zaoyin2', 'sj_zaoyin3', 'sj_zaoyin4'],
                        },
                        {
                            name: '冲击物',
                            text: '烧结过程中的颗粒物飞溅、烟尘冲击等',
                            solutionName: '眼面防护',
                            solutionText: '防飞溅物、粉尘',
                            btn: 'assets/img/btn_cjw.png?v20230222',
                            btnActive: 'assets/img/btn_cjw_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_cjw.png',
                            spotArray: ['sj_cjw1', 'sj_cjw2'],
                        },
                    ],
                },
                {
                    name: '焦化',
                    previewImg: 'assets/img/scene_jiaohua.png?v20230222',
                    tour: 'tour2.xml?v20231211',
                    startScene: 'scene_2',
                    alertList: [
                        {
                            name: '有害气体',
                            text: '焦化过程中产生的煤气、酸性气体',
                            solutionName: '呼吸防护',
                            solutionText: '防油性颗粒物 、有机气体、酸性气体、碱性气体。焦化厂环境恶劣，所以建议使用全硅胶面罩，不易受腐蚀，舒适度高',
                            btn: 'assets/img/btn_yhqt.png?v20230222',
                            btnActive: 'assets/img/btn_yhqt_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_hyqt.png',
                            spotArray: ['jh_yhqt1'],
                        },
                        {
                            name: '粉尘',
                            text: '焦化中的烟尘、煤尘等颗粒物：焦炉逸散物、煤焦油沥青挥发物等',
                            solutionName: '呼吸防护',
                            solutionText: '防油性颗粒物 、有机气体、酸性气体、碱性气体。焦化厂环境恶劣，所以建议使用全硅胶面罩，不易受腐蚀，舒适度高',
                            btn: 'assets/img/btn_fc.png?v20230629',
                            btnActive: 'assets/img/btn_fc_on.png?v20230629',
                            alertBoxIcon: 'assets/img/icon_fc.png',
                            spotArray: ['jh_fc1', 'jh_fc2', 'jh_fc3'],
                        },
                        {
                            name: '噪音',
                            text: '设备运转过程中产生的高分贝噪声',
                            solutionName: '听力防护',
                            solutionText: '防高分贝噪声。由于焦化厂环境很脏，所以建议不要使用揉搓式的泡棉耳塞',
                            btn: 'assets/img/btn_zy.png?v20230222',
                            btnActive: 'assets/img/btn_zy_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_zy.png',
                            spotArray: ['jh_zaoyin1', 'jh_zaoyin2'],
                        },
                        {
                            name: '冲击物',
                            text: '焦化中烟尘、煤尘颗粒、危害液体飞溅、热辐射等',
                            solutionName: '眼面防护',
                            solutionText: '防有机/酸性/碱性的液体、粉尘、热辐射',
                            btn: 'assets/img/btn_cjw.png?v20230222',
                            btnActive: 'assets/img/btn_cjw_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_cjw.png',
                            spotArray: ['jh_cjw1', 'jh_cjw2'],
                        },
                    ],
                },
                {
                    name: '炼铁',
                    previewImg: 'assets/img/scene_liantie.png?v20230222',
                    tour: 'tour3.xml?v20231211',
                    startScene: 'scene_3',
                    alertList: [
                        {
                            name: '有害气体',
                            text: '炼铁过程中产生的煤气、酸性气体',
                            solutionName: '呼吸防护',
                            solutionText: '防颗粒物 、酸性气体、其他有害气体，炼铁炼钢厂高温环境，还有酸性气体，所以建议使用全硅胶面罩，不易受腐蚀，舒适度高',
                            btn: 'assets/img/btn_yhqt.png?v20230222',
                            btnActive: 'assets/img/btn_yhqt_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_hyqt.png',
                            spotArray: ['lt_yhqt1', 'lt_yhqt2', 'lt_yhqt3'],
                        },
                        {
                            name: '噪音',
                            text: '设备运转过程中产生的高分贝噪声',
                            solutionName: '听力防护',
                            solutionText: '防高分贝噪声，由于炼铁炼钢厂环境很脏，所以建议不要使用揉搓式的泡棉耳塞',
                            btn: 'assets/img/btn_zy.png?v20230222',
                            btnActive: 'assets/img/btn_zy_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_zy.png',
                            spotArray: ['lt_zaoyin1', 'lt_zaoyin2'],
                        },
                        {
                            name: '冲击物',
                            text: '炼铁炼钢过程中的高温熔融物、烟尘颗粒物、热辐射等',
                            solutionName: '眼面防护',
                            solutionText: '防烟气、粉尘、热辐射、高温熔融物',
                            btn: 'assets/img/btn_cjw.png?v20230222',
                            btnActive: 'assets/img/btn_cjw_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_cjw.png',
                            spotArray: ['lt_cjw1', 'lt_cjw2'],
                        },
                    ],
                },
                {
                    name: '炼钢',
                    previewImg: 'assets/img/scene_liangang.png?v20230222',
                    tour: 'tour4.xml?v20231211',
                    startScene: 'scene_4',
                    alertList: [
                        {
                            name: '有害气体',
                            text: '炼钢过程中产生的煤气、酸性气体',
                            solutionName: '呼吸防护',
                            solutionText: '防颗粒物 、酸性气体、其他有害气体，炼铁炼钢厂高温环境，还有酸性气体，所以建议使用全硅胶面罩，不易受腐蚀，舒适度高',
                            btn: 'assets/img/btn_yhqt.png?v20230222',
                            btnActive: 'assets/img/btn_yhqt_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_hyqt.png',
                            spotArray: ['lg_yhqt1', 'lg_yhqt2'],
                        },
                        {
                            name: '粉尘',
                            text: '炼铁、炼钢产生的烟尘、辅料粉尘等颗粒物',
                            solutionName: '呼吸防护',
                            solutionText: '防颗粒物 、酸性气体、其他有害气体，炼铁炼钢厂高温环境，还有酸性气体，所以建议使用全硅胶面罩，不易受腐蚀，舒适度高',
                            btn: 'assets/img/btn_fc.png?v20230629',
                            btnActive: 'assets/img/btn_fc_on.png?v20230629',
                            alertBoxIcon: 'assets/img/icon_fc.png',
                            spotArray: ['lg_fc1'],
                        },
                        {
                            name: '噪音',
                            text: '设备运转过程中产生的高分贝噪声',
                            solutionName: '听力防护',
                            solutionText: '防高分贝噪声，由于炼铁炼钢厂环境很脏，所以建议不要使用揉搓式的泡棉耳塞',
                            btn: 'assets/img/btn_zy.png?v20230222',
                            btnActive: 'assets/img/btn_zy_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_zy.png',
                            spotArray: ['lg_zaoyin1', 'lg_zaoyin2', 'lg_zaoyin3', 'lg_zaoyin4'],
                        },
                        {
                            name: '冲击物',
                            text: '炼铁炼钢过程中的高温熔融物、烟尘颗粒物、热辐射等',
                            solutionName: '眼面防护',
                            solutionText: '防烟气、粉尘、热辐射、高温熔融物',
                            btn: 'assets/img/btn_cjw.png?v20230222',
                            btnActive: 'assets/img/btn_cjw_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_cjw.png',
                            spotArray: ['lg_cjw1', 'lg_cjw2'],
                        },
                    ],
                },
                {
                    name: '轧钢',
                    previewImg: 'assets/img/scene_zhagang.png?v20230222',
                    tour: 'tour5.xml?v20231211',
                    startScene: 'scene_5',
                    alertList: [
                        {
                            name: '有害气体',
                            text: '轧钢生产工艺过程中的酸性气体等',
                            solutionName: '呼吸防护',
                            solutionText: '作业环境中存在金属烟尘和金属粉尘，且环境温度高， 建议使用带呼气阀的KN95等级颗粒物防护口罩对金属烟尘和粉尘进行防护。',
                            btn: 'assets/img/btn_yhqt.png?v20230222',
                            btnActive: 'assets/img/btn_yhqt_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_hyqt.png',
                            spotArray: ['zg_yhqt1', 'zg_yhqt2'],
                        },
                        {
                            name: '粉尘',
                            text: '热轧、冷轧中产生的金属烟尘',
                            solutionName: '呼吸防护',
                            solutionText: '作业环境中存在金属烟尘和金属粉尘，且环境温度高， 建议使用带呼气阀的KN95等级颗粒物防护口罩对金属烟尘和粉尘进行防护。',
                            btn: 'assets/img/btn_fc.png?v20230629',
                            btnActive: 'assets/img/btn_fc_on.png?v20230629',
                            alertBoxIcon: 'assets/img/icon_fc.png',
                            spotArray: ['zg_fc1'],
                        },
                        {
                            name: '噪音',
                            text: '设备运转过程中产生的高分贝噪声',
                            solutionName: '听力防护',
                            solutionText: '防高分贝噪声，由于轧钢厂环境较脏，所以建议不要使用揉搓式的泡棉耳塞',
                            btn: 'assets/img/btn_zy.png?v20230222',
                            btnActive: 'assets/img/btn_zy_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_zy.png',
                            spotArray: ['zg_zaoyin1', 'zg_zaoyin2', 'zg_zaoyin3', 'zg_zaoyin4'],
                        },
                        {
                            name: '冲击物',
                            text: '炼铁炼钢过程中的高温熔融物、烟尘颗粒物、热辐射等',
                            solutionName: '眼面防护',
                            solutionText: '防烟气、粉尘、热辐射、冲击物',
                            btn: 'assets/img/btn_cjw.png?v20230222',
                            btnActive: 'assets/img/btn_cjw_on.png?v20230222',
                            alertBoxIcon: 'assets/img/icon_cjw.png',
                            spotArray: ['zg_cjw1', 'zg_cjw2', 'zg_cjw3'],
                        },
                    ],
                }
            ],
            curAlertIndex: 0,
            curAlertList: [],
            solutionList: [
                {
                    solutionName: '呼吸防护',
                    solutionIcon: 'assets/img/icon_mask.png?v20230222',
                },
                {
                    solutionName: '听力防护',
                    solutionIcon: 'assets/img/icon_earmuff.png?v20230222',
                },
                {
                    solutionName: '眼面防护',
                    solutionIcon: 'assets/img/icon_hat.png?v20230222',
                },
            ],
            curSolutionList: [],
            productList: [
                {
                    name: '7502 + 6002CN + 501+ 5N11CN',
                    id: 18,
                    alertList: ['有害气体', '粉尘'],
                    sceneName: ['轧钢'],
                    solutionName: ['呼吸防护'],
                    img: 'assets/img/products/7502-6006CN-2091CN-502.png?v20230905',
                    thumbImg: 'assets/img/products/thumb/7502-6006CN-2091CN-502.png?v20230905',
                    productDesc: '高级硅胶，舒适耐用。3M™ 冷流呼气阀。双模式头带方便调节。',
                    productLink: [
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301641/',
                            text: '查看7502面罩详情'
                        },
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301650/',
                            text: '查看6002CN详情'
                        },
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301632/',
                            text: '查看501详情'
                        },
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301652/',
                            text: '查看5N11CN详情'
                        },
                    ]
                },
                {
                    name: '3M™ 9502V+防颗粒物口罩',
                    id: 1,
                    alertList: ['粉尘', '有害气体'],
                    sceneName: ['选矿', '烧结', '轧钢'],
                    solutionName: ['呼吸防护'],
                    thumbImg: 'assets/img/products/thumb/9502V.png?v20230904',
                    productDesc: '防颗粒物，通过中国LA认证 (GB2626-2019 KN95级别）。专为中国人脸型设计，冷流呼气阀，佩戴更舒适。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100010565/', text: '查看详情'
                    }],
                    product360: {src: '9502VPlus', num: 24,},
                },
                {
                    name: '3200+3700+3701CN',
                    id: 2,
                    alertList: ['粉尘'],
                    sceneName: ['选矿'],
                    solutionName: ['呼吸防护'],
                    thumbImg: 'assets/img/products/thumb/3200.png?v20230904',
                    productDesc: '半面罩配滤棉，防颗粒物，滤棉为通过中国LA认证 (GB2626-2019 KN95级别），硅胶呼气阀，佩戴更舒适。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000504397/', text: '查看3200面罩详情'
                    }, {
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000516401/', text: '查看3700滤棉承接座详情'
                    }, {
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000465765/', text: '查看3701CN滤棉详情'
                    },],
                    product360: {src: '3200-3700-3701CN', num: 24,},
                },
                {
                    name: 'HF50+1700+1705CN',
                    id: 3,
                    alertList: ['粉尘'],
                    sceneName: ['选矿'],
                    solutionName: ['呼吸防护'],
                    img: 'assets/img/products/HF50.png?v20230905',
                    thumbImg: 'assets/img/products/thumb/HF50.png?v20230905',
                    productDesc: '半面罩配滤棉，防颗粒物，滤棉为通过中国LA认证 (GB2626-2019 KN95级别），罩体为全硅胶材质，佩戴更舒适。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000519249/', text: '查看HF50面罩详情'
                    }, {
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000547537/', text: '查看1700滤棉承接座详情'
                    }, {
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000547533/', text: '查看1705CN滤棉详情'
                    },]
                },
                {
                    name: '340-4004 预成型耳塞',
                    id: 4,
                    alertList: ['噪音'],
                    sceneName: ['选矿', '烧结', '焦化', '炼铁', '炼钢', '轧钢'],
                    solutionName: ['听力防护'],
                    thumbImg: 'assets/img/products/thumb/340-4004.png?v20230904',
                    productDesc: '三层裙边设计，贴合耳道的椭圆形状，佩戴舒适，密合良好，降噪值高，适用于高噪声环境。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000057717/', text: '查看详情'
                    }],
                    product360: {src: '340-4004', num: 20,},
                },
                {
                    name: '318-1005 免揉搓泡棉型耳塞',
                    id: 5,
                    alertList: ['噪音'],
                    sceneName: ['选矿', '烧结', '焦化', '炼铁', '炼钢', '轧钢'],
                    solutionName: ['听力防护'],
                    thumbImg: 'assets/img/products/thumb/318-1005.png?v20230904',
                    productDesc: '兼具泡棉耳塞和预成型耳塞的优点，无需搓揉耳塞，佩戴方便卫生 不可水洗，脏污后废弃。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000177818/', text: '查看详情'
                    }],
                    product360: {src: '318-1005', num: 20,},
                },
                {
                    name: 'X3P3安全帽式耳罩',
                    id: 6,
                    alertList: ['噪音'],
                    sceneName: ['选矿', '烧结', '焦化', '炼铁', '炼钢', '轧钢'],
                    solutionName: ['听力防护'],
                    img: 'assets/img/products/X3P3.png?v20230905',
                    thumbImg: 'assets/img/products/thumb/X3P3.png?v20230905',
                    productDesc: '此轻便耳罩可针对高等级工业噪音和其他尖锐声音作业提供防护。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000137012/', text: '查看详情'
                    }],
                    // product360: {src: 'X4P3E', num: 24},
                },
                {
                    name: 'H7B颈带式耳罩',
                    id: 7,
                    alertList: ['噪音'],
                    sceneName: ['选矿', '烧结', '焦化', '炼铁', '炼钢', '轧钢'],
                    solutionName: ['听力防护'],
                    thumbImg: 'assets/img/products/thumb/H7B.png?v20230904',
                    productDesc: '独特的杯罩设计，适用于达到101dBA的高度噪音环境，非常适合配合安全帽使用。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000057726/', text: '查看详情'
                    }],
                    product360: {src: 'H7B', num: 24},
                },
                {
                    name: 'GA500 防护眼罩',
                    id: 8,
                    alertList: ['冲击物'],
                    sceneName: ['选矿', '烧结', '焦化', '炼铁', '炼钢', '轧钢'],
                    solutionName: ['眼面防护'],
                    img: 'assets/img/products/GA500.png?v20230904',
                    thumbImg: 'assets/img/products/thumb/GA500.png?v20230904',
                    productDesc: '超强防雾涂层。通过D3防液体飞溅及D4防尘测试要求。产品兼容性更好。舒适度更高。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101340348/', text: '查看详情'
                    }],
                    product360: {src: 'GA501', num: 24},
                },
                {
                    name: '10436中国款安全眼镜',
                    id: 9,
                    alertList: ['冲击物'],
                    sceneName: ['选矿'],
                    solutionName: ['眼面防护'],
                    img: 'assets/img/products/10436.png?v20230905',
                    thumbImg: 'assets/img/products/thumb/10436.png?v20230905',
                    productDesc: '动感时尚设计外观，适合中国人脸型。防刮擦涂层。室内/外反光镜片，适合频繁进出人员。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100667835/', text: '查看详情'
                    }]
                },
                {
                    name: 'SF301AF安全眼镜',
                    id: 10,
                    alertList: ['冲击物'],
                    sceneName: ['选矿', '烧结', '焦化', '炼铁', '炼钢', '轧钢'],
                    solutionName: ['眼面防护'],
                    thumbImg: 'assets/img/products/thumb/SF301AF.png',
                    productDesc: '亚洲款系列根据亚洲人头型脸型设计，更适合中国客户使用。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100662084/', text: '查看详情'
                    }],
                    product360: {src: 'SF301AF', num: 24},
                },
                {
                    name: '3M™ 8576CN 减除酸性异味及防颗粒物口罩',
                    id: 11,
                    alertList: ['粉尘', '有害气体'],
                    sceneName: ['烧结', '轧钢'],
                    solutionName: ['呼吸防护'],
                    img: 'assets/img/products/8576.png?v20230905',
                    thumbImg: 'assets/img/products/thumb/8576.png?v20230905',
                    productDesc: '具有减除酸性气体异味功能， 通过中国LA认证（GB2626-2019 KP95级别）和美国NIOSH认证（P95级别）， 3M™ 冷流呼气阀，降低呼气阻力，减少口罩内的热量和湿气积聚，佩戴更舒适。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000057516/',
                        text: '查看详情'
                    }]
                },
                {
                    name: '6200 + 6002CN + 5N11CN + 501',
                    id: 12,
                    alertList: ['粉尘', '有害气体'],
                    sceneName: ['烧结'],
                    solutionName: ['呼吸防护'],
                    img: 'assets/img/products/6200-6002CN-5N11CN-501.png?v20230905',
                    thumbImg: 'assets/img/products/thumb/6200-6002CN-5N11CN-501.png?v20230905',
                    productDesc: '产品通过中国LA认证和美国NIOSH认证，多种NIOSH认证滤毒盒或滤棉可供选择，可用于防护多种气体、蒸气和颗粒物，使用范围广，双罐式面罩，呼吸阻力低，梯形滤毒盒设计，重心后摆，佩戴舒适。',
                    productLink: [
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301643/',
                            text: '查看6200面罩详情'
                        },
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301650/',
                            text: '查看6002CN滤毒盒详情'
                        },
                    ]
                },
                {
                    name: '7502 + 6006CN + 2091CN + 502',
                    id: 14,
                    alertList: ['有害气体', '粉尘'],
                    sceneName: ['焦化'],
                    solutionName: ['呼吸防护'],
                    img: 'assets/img/products/7502-6006CN-2091CN-502.png?v20230905',
                    thumbImg: 'assets/img/products/thumb/7502-6006CN-2091CN-502.png?v20230905',
                    productDesc: '高级硅胶，舒适耐用。3M™ 冷流呼气阀。双模式头带方便调节。',
                    productLink: [
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301641/',
                            text: '查看7502面罩详情'
                        },
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301629/',
                            text: '查看6006CN滤毒盒详情'
                        },
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301632/',
                            text: '查看P100颗粒物滤棉 2091CN详情'
                        },
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000057393/',
                            text: '查看502 滤棉承接座详情'
                        },
                    ]
                },
                {
                    name: '82585 防护面屏+3M™ 82520镀铝面屏支架',
                    id: 15,
                    alertList: ['冲击物'],
                    sceneName: ['焦化', '炼铁', '炼钢', '轧钢'],
                    solutionName: ['眼面防护'],
                    thumbImg: 'assets/img/products/thumb/82585.png',
                    productDesc: '通过LA认证，符合美国ANSI Z87.1-2015标准，表面镀铝, 用于反射辐射热，阻隔99.9%紫外线和80%辐射热， 适用于熔炉观察、铸造等场所。',
                    productLink: [
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100669488/',
                            text: '查看82585防护面屏详情'
                        },
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000057691/',
                            text: '查看3M™ 82520镀铝面屏支架详情'
                        },
                    ],
                    product360: {src: '82520', num: 24},
                },
                {
                    name: '7502 + 6006CN + 5N11CN + 501',
                    id: 16,
                    alertList: ['有害气体', '粉尘'],
                    sceneName: ['炼铁', '炼钢'],
                    solutionName: ['呼吸防护'],
                    img: 'assets/img/products/7502-6006CN-2091CN-502.png?v20230905',
                    thumbImg: 'assets/img/products/thumb/7502-6006CN-2091CN-502.png?v20230905',
                    productDesc: '高级硅胶，舒适耐用。3M™ 冷流呼气阀。双模式头带方便调节。',
                    productLink: [
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301641/',
                            text: '查看7502面罩详情'
                        },
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301629/',
                            text: '查看6006CN滤毒盒详情'
                        },
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301652/',
                            text: '查看5N11CN详情'
                        },
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301632/',
                            text: '查看501详情'
                        },
                    ],
                    product360: {src: '7502-6006CN-5N11CN-501', num: 24},
                },
                {
                    name: 'TR-600动力送风系统+放辐射热套装+M400头罩',
                    id: 17,
                    alertList: ['有害气体', '粉尘'],
                    sceneName: ['炼铁', '炼钢'],
                    solutionName: ['呼吸防护'],
                    img: 'assets/img/products/TR600.png?v20230905',
                    thumbImg: 'assets/img/products/thumb/TR600.png?v20230905',
                    productDesc: '不仅可以提供高防护等级的呼吸保护，还可以提供头部、眼部、面部、听力和皮肤综合防护，同时在长时间连续工作中提供舒适体验。',
                    productLink: [
                        {
                            link: 'https://www.3m.com.cn/3M/zh_CN/worker-health-safety-cn/tr600-powered-air-respirators/',
                            text: '查看详情'
                        },
                    ],
                },
                {
                    name: '3M™ ELSA逃生呼吸器',
                    id: 13,
                    alertList: ['粉尘', '有害气体'],
                    sceneName: ['烧结', '焦化', '炼铁', '炼钢'],
                    solutionName: ['呼吸防护'],
                    thumbImg: 'assets/img/products/thumb/ELSA.png',
                    productDesc: '超长耐用，可反复充气；留有胡须或戴眼镜的人均可适用；防静电易清洁；轻盈醒目易携带；快捷穿戴；15分钟逃生时间；3D头罩视野宽阔。',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101340348/',
                        text: '查看详情'
                    }],
                    product360: {src: 'ELSA', num: 24},
                },
            ],
            curProductList: [],
            showInstruction: false,
        }
    },
    created() {
        let _pub = window.$pubWin;
        var tempDate = _pub.getStorage('temp-steel-making-ppe-modal') || '';
        var currentDate = new Date().Format("yyyy-MM-dd");
        this.showInstruction = false;// (tempDate != currentDate);
        this.showInstruction = (tempDate != currentDate);

        this.curAlertList = this.sceneList[this.sceneIndex].alertList;
        let solutionNames = this.curAlertList.map(item => item.solutionName);
        this.curSolutionList = this.solutionList.filter(item => {
            return solutionNames.includes(item.solutionName)
        });

        var sceneItem = this.sceneList[this.sceneIndex];
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
            _pub.setStorage('temp-steel-making-ppe-modal', currentDate);
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
            let solutionNames = this.curAlertList.map(item => item.solutionName);
            this.curSolutionList = this.solutionList.filter(item => {
                return solutionNames.includes(item.solutionName)
            });

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

            switch (this.sceneIndex) {
                case 0:
                    jieshuoSrc = "./assets/img/jieshuo_xuankuang.mp3?v20230329";
                    break;
                case 1:
                    jieshuoSrc = "./assets/img/jieshuo_shaojie.mp3?v20230329";
                    break;
                case 2:
                    jieshuoSrc = "./assets/img/jieshuo_jiaohua.mp3?v20230329";
                    break;
                case 3:
                    jieshuoSrc = "./assets/img/jieshuo_liantie.mp3?v20230329";
                    break;
                case 4:
                    jieshuoSrc = "./assets/img/jieshuo_liangang.mp3?v20230329";
                    break;
                case 5:
                    jieshuoSrc = "./assets/img/jieshuo_zhagang.mp3?v20230329";
                    break;
                default:
                    jieshuoSrc = "";
                    return;
            }
            this.jieshuoSrc = jieshuoSrc;
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
                curAlertList = this.curAlertList,
                curSolutionList = this.curSolutionList,
                curSolutionIndex = curSolutionList.findIndex(item => item.solutionName === curSolutionName);

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
                curAlertList = this.curAlertList,
                curSolutionName = curAlertList[curAlertIndex].solutionName,
                curSolutionList = this.curSolutionList,
                curSolutionIndex = curSolutionList.findIndex(item => item.solutionName === curSolutionName);
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
        showProductInfo(index) {
            this.curProductIndex = index;
            let curProductList = this.curProductList,
                curProductIndex = this.curProductIndex,
                sceneList = this.sceneList,
                sceneIndex = this.sceneIndex,
                curScene = sceneList[sceneIndex].name,
                curProduct = curProductList[curProductIndex].name,
                curAlertList = this.curAlertList,
                curAlertIndex = this.alertIndex,
                curAlert = curAlertList[curAlertIndex];

            if (curProductList[curProductIndex].product360) {
                let src = curProductList[curProductIndex].product360.src,
                    num = curProductList[curProductIndex].product360.num;
                console.log(src, num);
                setTimeout(function () {
                    showProduct(src, num, 'productImgList-' + curProductIndex);
                }, 100)
            }
            updateSwiper();

            switch (curScene) {
                case '烧结':
                    curAlert = curAlertList.find(item => item.name == '冲击物');
                    if (curProduct == 'GA500 防护眼罩') {
                        curAlert.solutionText = '防飞溅物、粉尘';
                    } else {
                        curAlert.solutionText = '防颗粒飞溅物、粉尘。考虑现场环境情况，当选择眼罩时，建议选择具备卓越防雾功能的眼罩';
                    }
                    break;
                case '焦化':
                    curAlert = curAlertList.find(item => item.name == '冲击物');
                    if (curProduct == 'SF301AF安全眼镜') {
                        curAlert.solutionText = '防颗粒飞溅物、粉尘。考虑现场环境情况，当选择眼罩时，建议选择具备卓越防雾功能的眼罩';
                    } else {
                        curAlert.solutionText = '防有机/酸性/碱性的液体、粉尘、热辐射';
                    }
                    break;
                case '炼铁':
                    curAlert = curAlertList.find(item => item.name == '冲击物');
                    if (curProduct == 'GA500 防护眼罩') {
                        curAlert.solutionText = '防烟气、粉尘、热辐射、高温熔融物';
                    } else {
                        curAlert.solutionText = '超强防雾涂层。通过D3防液体飞溅及D4防尘测试要求。产品兼容性更好。舒适度更高。';
                    }
                    break;
                case '炼钢':
                    curAlert = curAlertList.find(item => item.name == '冲击物');
                    if (curProduct == 'GA500 防护眼罩') {
                        curAlert.solutionText = '防烟气、粉尘、热辐射、高温熔融物';
                    } else {
                        curAlert.solutionText = '超强防雾涂层。通过D3防液体飞溅及D4防尘测试要求。产品兼容性更好。舒适度更高。';
                    }
                    break;
                case '轧钢':
                    if (curAlert = curAlertList.find(item => item.name == '有害气体')) {
                        if (curProduct == '3M™ 9502V+防颗粒物口罩') {
                            curAlert.solutionText = '作业环境中存在金属烟尘和金属粉尘，且环境温度高， 建议使用带呼气阀的KN95等级颗粒物防护口罩对金属烟尘和粉尘进行防护。';
                        } else {
                            curAlert.solutionText = '防颗粒物 、酸性气体、其他有害气体。轧钢厂高温环境，所以建议使用全硅胶面罩，耐用性强，舒适度高';
                        }
                    }
                    if (curAlert = curAlertList.find(item => item.name == '噪音')) {
                        if (curProduct == 'X3P3安全帽式耳罩') {
                            curAlert.solutionText = '防高分贝噪声。采矿厂粉尘大，环境脏，建议使用不需要揉搓的耳塞或耳罩';
                        } else {
                            curAlert.solutionText = '防高分贝噪声，由于轧钢厂环境较脏，所以建议不要使用揉搓式的泡棉耳塞';
                        }
                    }
                    break;
                default:
                    return;
            }
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
            this.curAlertIndex = curAlertIndex;
            this.showAlertBox = false;
            this.showScenePreview = false;
            this.showProductModal = true;
            this.showProductInfo(0);
            updateSwiper();
            productListSwiper.slideTo(0, 0, false);
            productPreviewSwiper.slideTo(0, 0, false);

            var sceneItem = sceneList[sceneIndex];
            var solutionItem = curSolution;
            var curAlertItem = this.curAlertList[this.curAlertIndex];

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