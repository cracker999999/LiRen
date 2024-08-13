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
jieshuoSrc = "./assets/img/jieshuo_pack.mp3";
switch (sceneIndex) {
    case 0:
        jieshuoSrc = "./assets/img/jieshuo_pack.mp3";
        break;
    case 1:
        jieshuoSrc = "./assets/img/jieshuo_chongyachejian.mp3";
        break;
    case 2:
        jieshuoSrc = "./assets/img/jieshuo_hanjiechejian.mp3";
        break;
    case 3:
        jieshuoSrc = "./assets/img/jieshuo_tuzhuangchejian.mp3";
        break;
    case 4:
        jieshuoSrc = "./assets/img/jieshuo_donglizongcheng.mp3";
        break;
    case 5:
        jieshuoSrc = "./assets/img/jieshuo_zongzhuangchejian.mp3";
        break;
    case 6:
        jieshuoSrc = "./assets/img/jieshuo_jianceshiche.mp3";
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
            showProductModal: false,
            jieshuoSrc,
            highLightArray: [],
            sceneList: [
                //PACK线
                {
                    name: '大型商超场景-听力中心',
                    previewImg: 'assets/img/scene_pack.png',
                    tour: 'tour0.xml?v20231211',
                    startScene: 'scene_0',
                    alertList: [
                        {
                            name: '颗粒物',
                            btn: 'assets/img/btn_keliwu.png',
                            btnActive: 'assets/img/btn_keliwu_on.png',
                            alertInfos: [{
                                text: '某些岗位会接触锡焊烟尘、金属粉尘等颗粒物危害',
                                solutionName: '呼吸防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_fc.png',
                            spotArray: ['pack_keliwu1', 'pack_keliwu2', 'pack_keliwu3'],
                        },
                        {
                            name: '有害气体',
                            btn: 'assets/img/btn_yhqt.png',
                            btnActive: 'assets/img/btn_yhqt_on.png',
                            alertInfos: [{
                                text: '某些岗位会使用溶剂会产生有害蒸气',
                                solutionName: '呼吸防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_hyqt.png',
                            spotArray: ['pack_yhqt1', 'pack_yhqt2'],
                        },
                        {
                            name: '噪音',
                            btn: 'assets/img/btn_zy.png',
                            btnActive: 'assets/img/btn_zy_on.png',
                            alertInfos: [{
                                text: '生产设备、作业过程中会产生噪声，某些岗位噪声可能超标',
                                solutionName: '听力防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_zy.png',
                            spotArray: ['pack_zaoyin1', 'pack_zaoyin2'],
                        },
                        {
                            name: '冲击物',
                            btn: 'assets/img/btn_cjw.png',
                            btnActive: 'assets/img/btn_cjw_on.png',
                            alertInfos: [{
                                text: '生产过程中需要进行部件紧固等操作，产生的金属碎屑对眼面部存在冲击危害',
                                solutionName: '眼面防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_cjw.png',
                            spotArray: ['pack_cjw1', 'pack_cjw2'],
                        },
                    ],
                },
                //冲压车间
                {
                    name: '眼镜门店场景',
                    previewImg: 'assets/img/scene_chongyachejian.png',
                    tour: 'tour1.xml?v20231211',
                    startScene: 'scene_1',
                    alertList: [
                        {
                            name: '颗粒物',
                            btn: 'assets/img/btn_keliwu.png',
                            btnActive: 'assets/img/btn_keliwu_on.png',
                            alertInfos: [{
                                text: '冲压后的部件可能需要进行打磨去除毛刺，产生颗粒物危害',
                                solutionName: '呼吸防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_fc.png',
                            spotArray: ['cycj_keliwu1', 'cycj_keliwu2', 'cycj_keliwu3'],
                        },
                        {
                            name: '噪音',
                            btn: 'assets/img/btn_zy.png',
                            btnActive: 'assets/img/btn_zy_on.png',
                            alertInfos: [{
                                text: '生产设备运转、冲压部件过程中会产生高分贝噪声',
                                solutionName: '听力防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_zy.png',
                            spotArray: ['cycj_zaoyin1'],
                        },
                        {
                            name: '冲击物',
                            btn: 'assets/img/btn_cjw.png',
                            btnActive: 'assets/img/btn_cjw_on.png',
                            alertInfos: [{
                                text: '部件冲压或打磨毛刺过程中，可能产生高速冲击的金属碎屑',
                                solutionName: '眼面防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_cjw.png',
                            spotArray: ['cycj_cjw1', 'cycj_cjw2', 'cycj_cjw3'],
                        },
                    ],
                },
                //焊接车间
                {
                    name: '药房',
                    previewImg: 'assets/img/scene_hanjiechejian.png',
                    tour: 'tour2.xml?v20231211',
                    startScene: 'scene_2',
                    alertList: [
                        {
                            name: '颗粒物',
                            btn: 'assets/img/btn_keliwu.png',
                            btnActive: 'assets/img/btn_keliwu_on.png',
                            alertInfos: [{
                                text: '焊接过程中，会产生大量焊接烟尘',
                                solutionName: '呼吸防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_fc.png',
                            spotArray: ['hjcj_keliwu1', 'hjcj_keliwu2'],
                        },
                        {
                            name: '有害气体',
                            btn: 'assets/img/btn_yhqt.png',
                            btnActive: 'assets/img/btn_yhqt_on.png',
                            alertInfos: [{
                                text: '某些焊接工艺中，会产生臭氧（O3）等有毒有害气体',
                                solutionName: '呼吸防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_hyqt.png',
                            spotArray: ['hjcj_yhqt1'],
                        },
                        {
                            name: '噪音',
                            btn: 'assets/img/btn_zy.png',
                            btnActive: 'assets/img/btn_zy_on.png',
                            alertInfos: [{
                                text: '焊接作业过程中，会产生较高分贝的噪声',
                                solutionName: '听力防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_zy.png',
                            spotArray: ['hjcj_zaoyin1', 'hjcj_zaoyin2'],
                        },
                        {
                            name: '光学辐射',
                            btn: 'assets/img/btn_fushe.png',
                            btnActive: 'assets/img/btn_fushe_on.png',
                            alertInfos: [{
                                text: '某些焊接工艺中，会产生焊接弧光、紫外线等光学辐射',
                                solutionName: '眼面防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_fushe.png',
                            spotArray: ['hjcj_gxfs1', 'hjcj_gxfs2'],
                        },
                        {
                            name: '冲击物',
                            btn: 'assets/img/btn_cjw.png',
                            btnActive: 'assets/img/btn_cjw_on.png',
                            alertInfos: [{
                                text: '焊接过程中，可能产生火花飞溅、熔融金属及焊渣冲击物',
                                solutionName: '眼面防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_cjw.png',
                            spotArray: ['hjcj_cjw1', 'hjcj_cjw2'],
                        },
                    ],
                },
                //检测试车
                {
                    name: '采耳店',
                    previewImg: 'assets/img/scene_ceshichejian.png',
                    tour: 'tour3.xml?v20231211',
                    startScene: 'scene_3',
                    alertList: [
                        {
                            name: '颗粒物',
                            btn: 'assets/img/btn_keliwu.png',
                            btnActive: 'assets/img/btn_keliwu_on.png',
                            alertInfos: [{
                                text: '传统燃油车或混动汽车在测试过程中，排出的尾气中含有危害性的颗粒物',
                                solutionName: '呼吸防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_fc.png',
                            spotArray: ['jcsc_keliwu1', 'jcsc_keliwu2'],
                        },
                        {
                            name: '有害气体',
                            btn: 'assets/img/btn_yhqt.png',
                            btnActive: 'assets/img/btn_yhqt_on.png',
                            alertInfos: [{
                                text: '传统燃油车或混动汽车在测试过程中，排出的尾气中含有挥发性烃类等有毒有害气体',
                                solutionName: '呼吸防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_hyqt.png',
                            spotArray: ['jcsc_yhqt1'],
                        },
                        {
                            name: '噪音',
                            btn: 'assets/img/btn_zy.png',
                            btnActive: 'assets/img/btn_zy_on.png',
                            alertInfos: [{
                                text: '传统燃油车或混动汽车在测试过程中，多台发动机同时测试产生噪声可能超标',
                                solutionName: '听力防护',
                            }],
                            alertBoxIcon: 'assets/img/icon_zy.png',
                            spotArray: ['jcsc_zaoyin1', 'jcsc_zaoyin2', 'jcsc_zaoyin3'],
                        },
                    ],
                },
                // {
                //     name: '涂装车间',
                //     previewImg: 'assets/img/scene_tuzhuangchejian.png',
                //     tour: 'tour4.xml?v20231211',
                //     startScene: 'scene_4',
                //     alertList: [
                //         {
                //             name: '漆雾',
                //             btn: 'assets/img/btn_qiwu.png',
                //             btnActive: 'assets/img/btn_qiwu_on.png',
                //             alertInfos: [
                //                 {
                //                     text: '喷漆过程中空气中会含有大量漆雾，造成呼吸危害',
                //                     solutionName: '呼吸防护',
                //                 },
                //                 {
                //                     text: '眼睛直接接触漆雾，油漆中的化学成分可能对眼睛造成刺激甚至灼伤眼睛',
                //                     solutionName: '眼面防护',
                //                 },
                //             ],
                //             alertBoxIcon: 'assets/img/icon_qiwu.png',
                //             spotArray: ['tzcj_qiwu1', 'tzcj_qiwu2'],
                //         },
                //         {
                //             name: '有机蒸气',
                //             btn: 'assets/img/btn_zhengqi.png?v20230817',
                //             btnActive: 'assets/img/btn_zhengqi_on.png',
                //             alertInfos: [
                //                 {
                //                     text: '喷漆过程中，油漆中的有机溶剂挥发产生有机蒸气',
                //                     solutionName: '呼吸防护',
                //                 }
                //             ],
                //             alertBoxIcon: 'assets/img/icon_zhengqi.png?v20230817',
                //             spotArray: ['tzcj_zhengqi1'],
                //         },
                //         {
                //             name: '噪音',
                //             btn: 'assets/img/btn_zy.png',
                //             btnActive: 'assets/img/btn_zy_on.png',
                //             alertInfos: [{
                //                 text: '喷漆操作、系统运转会产生较高分贝的噪声',
                //                 solutionName: '听力防护',
                //             }],
                //             alertBoxIcon: 'assets/img/icon_zy.png',
                //             spotArray: ['tzcj_zaoyin1'],
                //         },
                //         {
                //             name: '油漆',
                //             btn: 'assets/img/btn_youqi.png',
                //             btnActive: 'assets/img/btn_youqi_on.png',
                //             alertInfos: [{
                //                 text: '油漆中含有可能危害皮肤的溶剂，皮肤长期接触漆雾可能会造成皮肤损伤、神经系统损伤或其他身体危害',
                //                 solutionName: '身体防护',
                //             }],
                //             alertBoxIcon: 'assets/img/icon_youqi.png',
                //             spotArray: ['tzcj_youqi1', 'tzcj_youqi2'],
                //         },
                //     ],
                // },
                // {
                //     name: '总装车间',
                //     previewImg: 'assets/img/scene_zongzhuangchejian.png',
                //     tour: 'tour5.xml?v20231211',
                //     startScene: 'scene_5',
                //     alertList: [
                //         {
                //             name: '颗粒物',
                //             btn: 'assets/img/btn_keliwu.png',
                //             btnActive: 'assets/img/btn_keliwu_on.png',
                //             alertInfos: [{
                //                 text: '某些岗位在装配过程中，可能会产生金属粉尘等颗粒物危害',
                //                 solutionName: '呼吸防护',
                //             }],
                //             alertBoxIcon: 'assets/img/icon_fc.png',
                //             spotArray: ['zzcj_keliwu1', 'zzcj_keliwu2', 'zzcj_keliwu3'],
                //         },
                //         {
                //             name: '有机蒸气',
                //             btn: 'assets/img/btn_zhengqi.png?v20230817',
                //             btnActive: 'assets/img/btn_zhengqi_on.png',
                //             alertInfos: [{
                //                 text: '总装时使用的溶剂或胶粘剂会挥发产生有毒有害蒸气',
                //                 solutionName: '呼吸防护',
                //             }],
                //             alertBoxIcon: 'assets/img/icon_zhengqi.png?v20230817',
                //             spotArray: ['zzcj_zhengqi1'],
                //         },
                //         {
                //             name: '噪音',
                //             btn: 'assets/img/btn_zy.png',
                //             btnActive: 'assets/img/btn_zy_on.png',
                //             alertInfos: [{
                //                 text: '设备、工具运转及组装过程中会产生较高分贝的噪声',
                //                 solutionName: '听力防护',
                //             }],
                //             alertBoxIcon: 'assets/img/icon_zy.png',
                //             spotArray: ['zzcj_zaoyin1', 'zzcj_zaoyin2', 'zzcj_zaoyin3'],
                //         },
                //         {
                //             name: '冲击物',
                //             btn: 'assets/img/btn_cjw.png',
                //             btnActive: 'assets/img/btn_cjw_on.png',
                //             alertInfos: [{
                //                 text: '使用电动工具、气动工具组装过程中，可能产生高速冲击的金属碎屑',
                //                 solutionName: '眼面防护',
                //             }],
                //             alertBoxIcon: 'assets/img/icon_cjw.png',
                //             spotArray: ['zzcj_cjw1', 'zzcj_cjw2', 'zzcj_cjw3'],
                //         },
                //     ],
                // },
                // {
                //     name: '动力总成',
                //     previewImg: 'assets/img/scene_donglizongcheng.png',
                //     tour: 'tour6.xml?v20231211',
                //     startScene: 'scene_6',
                //     alertList: [
                //         {
                //             name: '颗粒物',
                //             btn: 'assets/img/btn_keliwu.png',
                //             btnActive: 'assets/img/btn_keliwu_on.png',
                //             alertInfos: [{
                //                 text: '零部件生产或组装过程中，会产生金属粉尘等颗粒物危害',
                //                 solutionName: '呼吸防护',
                //             }],
                //             alertBoxIcon: 'assets/img/icon_fc.png',
                //             spotArray: ['dlzc_keliwu1'],
                //         },
                //         {
                //             name: '噪音',
                //             btn: 'assets/img/btn_zy.png',
                //             btnActive: 'assets/img/btn_zy_on.png',
                //             alertInfos: [{
                //                 text: '设备、工具运转及组装过程中会产生较高分贝的噪声',
                //                 solutionName: '听力防护',
                //             }],
                //             alertBoxIcon: 'assets/img/icon_zy.png',
                //             spotArray: ['dlzc_zaoyin1'],
                //         },
                //         {
                //             name: '冲击物',
                //             btn: 'assets/img/btn_cjw.png',
                //             btnActive: 'assets/img/btn_cjw_on.png',
                //             alertInfos: [{
                //                 text: '使用电动工具、气动工具组装过程中，可能产生高速冲击的金属碎屑',
                //                 solutionName: '眼面防护',
                //             }],
                //             alertBoxIcon: 'assets/img/icon_cjw.png',
                //             spotArray: ['dlzc_cjw1', 'dlzc_cjw2'],
                //         },
                //     ],
                // },
            ],
            curAlertIndex: 0,
            curAlertList: [],
            solutionList: [
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
                    solutionName: '身体防护',
                    solutionIcon: 'assets/img/icon_bodyCare.png',
                },
            ],
            curSolutionList: [],
            productList: [
                {
                    name: '3M™ 9502V+防颗粒物口罩',
                    id: 1,
                    alertList: ['有害气体', '颗粒物'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['PACK线', '冲压车间', '焊接车间', '动力总成'],
                    img: 'assets/img/products/9502V.png',
                    productDesc: '1.3M™ 专有高效静电滤棉， 保证有效过滤性能，保持低呼吸阻力 \n' +
                        '2. 用于防护粉尘、烟尘等颗粒物，对非油性颗粒物的过滤效率不低于95%\n' +
                        '3. 带有3M™ 冷流呼气阀，呼气阻力更低，湿气和热量不易积聚，阀盖的导流设计避免眼镜起雾\n' +
                        '4. 宽针织头带，舒适透气，可长时间佩戴 \n' +
                        '5. 根据亚洲人脸型设计，贴合中国人脸型',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100010565/', text: '查看详情'
                    }],
                    product360: {src: '9502VPlus', num: 24,},
                },
                {
                    name: '3M™ 9542V 活性炭防颗粒物口罩',
                    id: 2,
                    alertList: ['有害气体', '颗粒物', '有机蒸气'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['PACK线', '焊接车间', '总装车间', '检测试车'],
                    img: 'assets/img/products/9542V.png',
                    productDesc: '1.用于防护粉尘、烟尘等颗粒物，对非油性颗粒物的过滤效率不低于95% \n' +
                        '2. 带有3M™ 活性炭滤棉层，可以减除有机蒸气异味\n' +
                        '3. 带有3M™ 冷流呼气阀，呼气阻力更低，湿气和热量不易积聚，阀盖的导流设计避免眼镜起雾\n' +
                        '4. 宽针织头带，舒适透气，可长时间佩戴 ',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100979311/', text: '查看详情'
                    }],
                    product360: {src: '9542V', num: 24,},
                },
                {
                    name: '3M™ 尘毒防护套装6200+6001CN+5N11',
                    id: 3,
                    alertList: ['有害气体', '颗粒物', '漆雾', '有机蒸气'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['PACK线', '涂装车间', '总装车间', '检测试车'],
                    img: 'assets/img/products/6200-6002CN-5N11CN-501.png',
                    productDesc: '1.尘毒组合防护，同时防护某些有机蒸气和颗粒物，对漆雾等非油性颗粒物的过滤效率不低于95%\n' +
                        '2. 面具为高级橡胶材质，舒适耐用\n' +
                        '3. 双罐式面罩，呼吸阻力低。\n' +
                        '4. 滤毒盒采用梯形设计，重心后摆，不易造成颈部疲劳，更符合人体工程学；独特过滤路线设计，使得活性炭充分吸附，使用寿命更长\n' +
                        '5. 产品通过中国LA和美国NIOSH认证',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100668195/', text: '查看详情'
                    }],
                    // product360: {src: '9542V', num: 24,},
                },
                {
                    name: '3M™ SecureFit™ 中国款防雾防护眼镜 SF301AF 透明',
                    id: 4,
                    alertList: ['冲击物',],
                    solutionName: ['眼面防护'],
                    sceneName: ['PACK线', '冲压车间', '动力总成', '总装车间'],
                    img: 'assets/img/products/SF301AF.png',
                    productDesc: '1. 压力扩散镜腿技术最大限度的减少安全眼镜配戴后对耳部附近造成的压力，提高佩戴舒适度，确保稳定性\n' +
                        '2. 聚碳酸酯镜片，可阻隔99.9%的UVA和UVB紫外线， 符合ANSI Z87.1-2015的抗冲击标准\n' +
                        '3. 按照中国人脸型设计，更贴合中国人脸型\n' +
                        '4. 柔软鼻夹，可调节，更舒适\n' +
                        '5. 带有防雾涂层，有效防止镜片起雾',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100662084/', text: '查看详情'
                    }],
                    product360: {src: 'SF301AF', num: 24,},
                },
                {
                    name: '10434中国款轻便防护眼镜-透明镜片防雾',
                    id: 5,
                    alertList: ['冲击物',],
                    solutionName: ['眼面防护'],
                    sceneName: ['PACK线', '动力总成', '总装车间'],
                    img: 'assets/img/products/10434.png',
                    productDesc: '1. 聚碳酸酯镜片，可阻隔99.9%的UVA和UVB紫外线， 符合ANSI Z87.1-2015的抗冲击标准\n' +
                        '2. 按照中国人脸型设计，更贴合中国人脸型\n' +
                        '3. 带有防雾涂层，有效防止镜片起雾\n' +
                        '4. 运动型外观设计，时尚，美观',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000465774/', text: '查看详情'
                    }],
                    // product360: {src: 'SF301AF', num: 24,},
                },
                {
                    name: '3M™ SF3701ASGAF-BLU 中国款OTG安全眼镜',
                    id: 6,
                    alertList: ['冲击物',],
                    solutionName: ['眼面防护'],
                    sceneName: ['PACK线', '冲压车间', '动力总成', '总装车间'],
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
                    // product360: {src: 'SF301AF', num: 24,},
                },
                {
                    name: '3M™ E-A-Rsoft™ Yellow Neons™ 311-1250 带线高降噪子弹型耳塞',
                    id: 7,
                    alertList: ['噪音',],
                    solutionName: ['听力防护'],
                    sceneName: ['PACK线', '冲压车间', '动力总成', '总装车间', '检测试车'],
                    img: 'assets/img/products/311-1250.png',
                    productDesc: '1. 标称降噪值SNR为36dB\n' +
                        '2. 降噪能力强，超柔软，高舒适度\n' +
                        '3. 自塑性强的泡棉材料，慢回弹，佩戴方便舒适\n' +
                        '4. 可搭配3M™ E-A-Rfit 双耳防护验证系统测试个人声衰减值（PAR）',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000057705/', text: '查看详情'
                    }],
                    // product360: {src: 'SF301AF', num: 24,},
                },
                {
                    name: '3M™ E-A-R™ Push-Ins™ 318-1005 带线耳塞',
                    id: 8,
                    alertList: ['噪音',],
                    solutionName: ['听力防护'],
                    sceneName: ['PACK线', '冲压车间', '焊接车间', '涂装车间', '动力总成', '总装车间', '检测试车'],
                    img: 'assets/img/products/318-1005.png',
                    productDesc: '1. 标称降噪值SNR为38dB\n' +
                        '2. 免揉搓泡棉耳塞便于佩戴和摘取，当双手脏污或佩戴手套时，也可以轻松使用\n' +
                        '3. 牢固、柔韧佩戴手柄，实现单手或双手轻松佩戴\n' +
                        '4. 蘑菇形状，小巧美观，可快速塞入耳道\n' +
                        '5. 可搭配3M™ E-A-Rfit 双耳防护验证系统测试个人声衰减值（PAR）',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000177818/', text: '查看详情'
                    }],
                    product360: {src: '318-1005', num: 20,},
                },
                {
                    name: '3M™ PELTOR™ X4P3E 挂安全帽式耳罩',
                    id: 9,
                    alertList: ['噪音',],
                    solutionName: ['听力防护'],
                    sceneName: ['PACK线', '冲压车间', '动力总成', '总装车间'],
                    img: 'assets/img/products/X4P3.png',
                    productDesc: '1. 标称降噪值SNR为32dB\n' +
                        '2. 挂安全帽使用，解决同时佩戴安全帽和耳罩的兼容性问题\n' +
                        '3. 具有现代感的人体工程学设计，头带版于金属配件上包覆绝缘材料，安全且提供长时间佩戴的舒适度以及产品耐用度\n' +
                        '4. 可搭配3M™ E-A-Rfit 双耳防护验证系统测试个人声衰减值（PAR）',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000137014/', text: '查看详情'
                    }],
                    product360: {src: 'X4P3E', num: 24,},
                },
                {
                    name: '3M™ 防颗粒物口罩 9502+',
                    id: 10,
                    alertList: ['颗粒物',],
                    solutionName: ['呼吸防护'],
                    sceneName: ['冲压车间', '动力总成'],
                    img: 'assets/img/products/9502Plus.png',
                    productDesc: '1.3M™ 专有高效静电滤棉， 保证有效过滤性能，保持低呼吸阻力 \n' +
                        '2. 用于防护粉尘、烟尘等颗粒物，对非油性颗粒物的过滤效率不低于95%\n' +
                        '3. 根据亚洲人脸型设计，贴合中国人脸型\n' +
                        '4. 宽针织头带，舒适透气，可长时间佩戴',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v101327035/', text: '查看详情'
                    }],
                    product360: {src: '9502Plus', num: 24,},
                },
                {
                    name: '3M™ Speedglas™G5-01耐用型送风式焊接面罩',
                    id: 11,
                    alertList: ['有害气体', '颗粒物'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['焊接车间',],
                    img: 'assets/img/products/G5-01.png',
                    productDesc: '1. 自带Adflo过滤系统，同时进行焊接的眼面部防护和呼吸防护\n' +
                        '2. 颗粒过滤盒，高效过滤焊接烟尘和颗粒物\n' +
                        '3. 气流分布：扩散器将过滤后的空气均匀分布在焊接面罩的整个呼吸区域，从而最大程度地保证舒适度\n' +
                        '4. 无刷电机，使用寿命长\n' +
                        '5. 带有颗粒物滤盒指示灯，指示颗粒过滤盒的状态和使用情况',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100827281/', text: '查看详情'
                    }],
                    // product360: {src: '9502Plus', num: 24,},
                },
                {
                    name: '3M™ Speedglas™G5-01耐用型送风式焊接面罩',
                    id: 19,
                    alertList: ['冲击物', '光学辐射'],
                    solutionName: ['眼面防护'],
                    sceneName: ['焊接车间',],
                    img: 'assets/img/products/G5-01.png',
                    productDesc: '1. 自带Adflo过滤系统，同时进行焊接的眼面部防护和呼吸防护\n' +
                        '2. 良好的有害光辐射防护\n' +
                        '3. 自动变光功能，焊点视线清晰\n' +
                        '4. 多个遮光号可选，适合不同的焊接工艺 \n' +
                        '5. 良好的防火花/飞溅性能',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v100827281/', text: '查看详情'
                    }],
                    // product360: {src: '9502Plus', num: 24,},
                },
                {
                    name: '3M™ 自动变光焊接面罩 100V',
                    id: 12,
                    alertList: ['光学辐射', '冲击物'],
                    solutionName: ['眼面防护'],
                    sceneName: ['焊接车间',],
                    img: 'assets/img/products/100V.png',
                    productDesc: '1.自动变光功能，焊点视线清晰 \n' +
                        '2. 由亮变暗自动变光响应时间0.1毫秒，由暗变亮时间可调节延迟\n' +
                        '3. 适用多种焊接工艺，包括MMA，MIG/MAG和大电流TIG焊\n' +
                        '4. 兼容防护口罩或防护面罩',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000504392/', text: '查看详情'
                    }],
                    // product360: {src: '9502Plus', num: 24,},
                },
                {
                    name: '328-1001免揉搓泡棉耳塞',
                    id: 13,
                    alertList: ['噪音'],
                    solutionName: ['听力防护'],
                    sceneName: ['焊接车间', '涂装车间', '检测试车'],
                    img: 'assets/img/products/328-1001.png',
                    productDesc: '1. 标称降噪值SNR: 35dB(双手佩戴）， SNR: 30dB(单手佩戴）\n' +
                        '2. 3M™ 第一款可水洗泡棉耳塞\n' +
                        '3. 3M™ 第一款提供单手佩戴标称降噪值的耳塞\n' +
                        '4. 免揉搓泡棉，方便佩戴和摘取，即使双手脏污或佩戴手套，也能便捷使用\n' +
                        '5. 牢固、柔韧手柄，实现单手或双手轻松佩戴和摘取\n' +
                        '6. 可搭配3M™ E-A-Rfit 双耳防护验证系统测试个人声衰减值（PAR）',
                    product360: {src: '328-1001', num: 24,},
                },
                {
                    name: '3M™ 长管供气呼吸器',
                    id: 14,
                    alertList: ['漆雾', '有机蒸气'],
                    solutionName: ['呼吸防护', '眼面防护'],
                    sceneName: ['涂装车间'],
                    img: 'assets/img/products/W2806-W2929-V300-BT30-S533L.png',
                    productDesc: '1. 同时提供呼吸和眼面部防护\n' +
                        '2. 直接呼吸室外洁净空气，防护级别高、防护效果好\n' +
                        '3. 配合不同调节阀，可进行升温、降温调节，佩戴舒适\n' +
                        '4. 呼吸畅通，利于长时间佩戴',
                    // productLink: [{
                    //     link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000504392/', text: '查看详情'
                    // }],
                    product360: {src: 'W2806-W2929-V300-BT30-S533L', num: 18,},
                },
                {
                    name: '3M™ 尘毒防护套装7502+6001CN+5N11',
                    id: 15,
                    alertList: ['漆雾', '有机蒸气', '颗粒物'],
                    solutionName: ['呼吸防护'],
                    sceneName: ['涂装车间', '总装车间'],
                    img: 'assets/img/products/7502-6001CN-5N11.png?v20230818',
                    productDesc: '1.尘毒组合防护，同时防护某些有机蒸气和颗粒物，对漆雾等非油性颗粒物的过滤效率不低于95%\n' +
                        '2. 面具为硅胶材质，柔软舒适耐用\n' +
                        '3. 双罐式面罩，且带有3M™ 冷流呼气阀，呼吸阻力低\n' +
                        '4. 滤毒盒采用梯形设计，重心后摆，不易造成颈部疲劳，更符合人体工程学；独特过滤路线设计，使得活性炭充分吸附，使用寿命更长\n' +
                        '5. 产品通过中国LA和美国NIOSH认证',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301641/', text: '查看7502详情'
                    }, {
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301649/', text: '查看6001CN详情'
                    }, {
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000301652/', text: '查看5N11详情'
                    },],
                    // product360: {src: 'W2806-W2929-V300-BT30-S533L', num: 18,},
                },
                {
                    name: '3M™ 1623AF 防雾防化学护目镜',
                    id: 16,
                    alertList: ['漆雾'],
                    solutionName: ['眼面防护'],
                    sceneName: ['涂装车间'],
                    img: 'assets/img/products/1623AF.png',
                    productDesc: '1. 间接通风口设计，有效防护液体喷溅\n' +
                        '2. 防雾涂层，有效防止起雾\n' +
                        '3. 可调节头带长度，使用更舒适\n' +
                        '4.  大镜片，弧度设计，视野极佳\n' +
                        '5. 聚碳酸酯镜片，有效防护冲击危害，阻隔99.9％紫外线',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000491584/', text: '查看详情'
                    }],
                    product360: {src: '1623', num: 24},
                },
                {
                    name: '3M™ 白色戴帽连体防护服 4545',
                    id: 17,
                    alertList: ['油漆'],
                    solutionName: ['身体防护'],
                    sceneName: ['涂装车间'],
                    img: 'assets/img/products/4545.png',
                    productDesc: '1.CE认证，有效防护颗粒物(第五类防护)及液体有限泼溅(第六类防护)\n' +
                        '2. 新型材料，柔软、轻薄、透气、舒适\n' +
                        '3. 加强型裆部设计，增强耐用性\n' +
                        '4. 通过抗静电测试，可用于易燃易爆场所\n' +
                        '5. 弹性头罩、腰间、脚踝设计，方便行动。编织袖口，增加穿着舒适度',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000078888/', text: '查看详情'
                    }],
                    // product360: {src: '1623', num: 24},
                },
                {
                    name: '3M™ 带帽连体防护服 4535',
                    id: 18,
                    alertList: ['油漆'],
                    solutionName: ['身体防护'],
                    sceneName: ['涂装车间'],
                    img: 'assets/img/products/4535.png',
                    productDesc: '1.CE认证，有效防护颗粒物(第五类防护)及液体有限泼溅(第六类防护)\n' +
                        '2. 双材料独特设计，背部全部透气，提供独特的防护性与舒适性的完美结合\n' +
                        '3. 正面化学阻隔性好，低纤维掉落。背部透气性好，舒适性高\n' +
                        '4. 通过抗静电测试，可用于易燃易爆场所\n' +
                        '5. 弹性头罩、腰间、脚踝设计，方便行动。编织袖口，增加穿着舒适度',
                    productLink: [{
                        link: 'https://www.3m.com.cn/3M/zh_CN/p/d/v000126479/', text: '查看详情'
                    }],
                    // product360: {src: '1623', num: 24},
                },
            ],
            curProductList: [],
            showInstruction: true,
        }
    },
    created() {
        let _pub = window.$pubWin;
        var tempDate = _pub.getStorage('temp-automobile-modal') || '';
        var currentDate = new Date().Format("yyyy-MM-dd");
        this.showInstruction = false;// (tempDate != currentDate);
        this.showInstruction = (tempDate != currentDate);

        this.curAlertList = this.sceneList[this.sceneIndex].alertList;
        let solutionNames = this.curAlertList.flatMap(alertItem =>
            alertItem.alertInfos.map(alertInfo => alertInfo.solutionName)
        );
        this.curSolutionList = this.solutionList.filter(item => {
            return solutionNames.includes(item.solutionName)
        })
        var sceneItem = this.sceneList[this.sceneIndex];
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
            _pub.setStorage('temp-automobile-modal', currentDate);
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
            let solutionNames = this.curAlertList.flatMap(alertItem =>
                alertItem.alertInfos.map(alertInfo => alertInfo.solutionName)
            );

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

            switch (this.sceneIndex) {
                case 0:
                    jieshuoSrc = "./assets/img/jieshuo_pack.mp3";
                    break;
                case 1:
                    jieshuoSrc = "./assets/img/jieshuo_chongyachejian.mp3";
                    break;
                case 2:
                    jieshuoSrc = "./assets/img/jieshuo_hanjiechejian.mp3";
                    break;
                case 3:
                    jieshuoSrc = "./assets/img/jieshuo_tuzhuangchejian.mp3";
                    break;
                case 4:
                    jieshuoSrc = "./assets/img/jieshuo_donglizongcheng.mp3";
                    break;
                case 5:
                    jieshuoSrc = "./assets/img/jieshuo_zongzhuangchejian.mp3";
                    break;
                case 6:
                    jieshuoSrc = "./assets/img/jieshuo_jianceshiche.mp3";
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
                sceneName = sceneList[sceneIndex].name,
                curAlertIndex = this.curAlertIndex,
                curAlertList = this.curAlertList,
                curSolutionIndex = this.curSolutionIndex,
                curSolutionList = this.curSolutionList,
                curSolution = curSolutionList[curSolutionIndex];
            console.log("当前解决方案：", curSolution.solutionName);
            this.curProductList = this.productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.solutionName.includes(curSolution.solutionName)
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
            var name = '防护解决方案弹框-汽车-' + sceneItem.name + '-去京东看看';
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