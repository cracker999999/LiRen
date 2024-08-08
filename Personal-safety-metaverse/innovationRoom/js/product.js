var winWidth = $(window).width() || window.innerWidth || document.documentElement.clientWidth
    , winHeight = $(window).height() || window.innerHeight || document.documentElement.clientHeight;
console.log(winWidth, winHeight);

const app = Vue.createApp({
    data() {
        return {
            is720: true,
            currentProduct: 0,
            showChangeColor: false, //默认值取第一个产品
            showAnimation: false, //默认值取第一个产品
            productList: [
                {
                    productName: 'Fitshape 3D 扫描仪',
                    desc: '应用于耳道三维数据采集，开放式设计、可视化操作，多模块组合，便于售后且成本低 格式兼容市场上所有3D设计软件， 产品已通过CE、FCC认证。',
                    url: 'http://www.ear3d.cn/product/3d_scanner/Fitshape/',
                    modelName: 'BZLR_P1',
                    img: 'images/products/BZLR_I1.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '亚克力六耳展示架',
                    desc: '由仿真耳及亚克力板组成。亚克力板晶莹剔透，仿真耳柔软细腻，整体精致典雅，展示极具视觉效果。',
                    url: 'http://www.soundlink.com.cn/product/application/133.html',
                    modelName: 'BZLR_P16',
                    img: 'images/products/BZLR_I16.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: 'p16_01_glass,p16_02_glass,p16_03_glass,p16_04_glass,p16_05_glass,p16_06_glass,p16_07a_glass,p16_07b_glass,p16_07c_glass',
                    animation: '',
                    changeColor: 'ddd',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '挂绳',
                    desc: '多款多色单耳、双耳挂绳，解决了耳背机佩戴时容易脱落等问题',
                    url: 'http://www.soundlink.com.cn/products/Matching1/406.html',
                    modelName: 'BZLR_P17',
                    img: 'images/products/BZLR_I17.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '液晶测电器',
                    desc: '新颖设计，电池电量直观显示，携带方便。内置的电池仓小抽屉，最少可容纳两颗助听器电池。',
                    url: 'http://www.soundlink.com.cn/products/Matching8/205.html',
                    modelName: 'BZLR_P18',
                    img: 'images/products/BZLR_I18.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '电子干燥器',
                    desc: '本产品采用自动恒温加热元件，能在短时间内达到设定恒定温度，除湿效果明显。中层板隔离干燥物与发热系统，通过加热后的空气对被干燥物进行除湿，避免了传统加热方式引起的温度过高而导致被干燥物损坏。\n'+
                            '本产品外形小巧、便于携带、性能稳定，全新科技外观设计（已申请专利），USB电源供电方式，操作简便。是用户居家及旅途常备的干燥除湿佳品。',
                    url: 'http://www.soundlink.com.cn/products/Matching1/359.html',
                    modelName: 'BZLR_P19',
                    img: 'images/products/BZLR_I19.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '助听器分析仪',
                    desc: '配有海特箱(HIT Box)的耦合腔验配，包括真耳耦合腔差值（RECD）–无论是实测还是预估，都可以使您更加高效地开展儿童和成人验配工作。',
                    url: 'http://www.soundlink.com.cn/products/Matching9/2710.html',
                    modelName: 'BZLR_P25',
                    img: 'images/products/BZLR_I25.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: true,
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '检耳镜',
                    desc: 'e-scope耳窥镜是德国Riester的产品之-光线柔和明亮，观察效果佳;\n'+
                            '简洁大方的外观设计、符合人体工程学的使用要求，极佳手感;\n'+
                            '采用减少反射的光学元件和LED技术，可提高诊断效率并降低维护成本。',
                    url: 'http://www.soundlink.com.cn/product/application/2960.html',
                    modelName: 'BZLR_P28',
                    img: 'images/products/BZLR_I28.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '一体化工作台',
                    desc: '用于客户耳道检查，助听器维修保养的工作台，布局合理，兼容性高，多角度可调，操作便捷。',
                    url: 'http://www.soundlink.com.cn/products/Matching9/2961.html',
                    modelName: 'BZLR_P33',
                    img: 'images/products/BZLR_I33.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '诊疗椅',
                    desc: '座垫平面升降范围：560-760mm（200mm）\n'+
                            '靠背府仰角度：90°~180\n'+
                            '旋转角度：360°，可任一位置锁定\n'+
                            '头枕延伸：0~200mm\n'+
                            '最大承载范围：<150kg',
                    url: 'http://www.soundlink.com.cn/products/Matching9/2962.html',
                    modelName: 'BZLR_P34',
                    img: 'images/products/BZLR_I34.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '声级计',
                    desc: '声音强度测试工具，声场校准工具',
                    url: 'http://www.soundlink.com.cn/products/Matching2/469.html',
                    modelName: 'BZLR_P36',
                    img: 'images/products/BZLR_I36.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '视觉强化',
                    desc: 'TFT LCD全彩液晶屏显示内含存储系统，并可持续循环播放转换档案，经编程设定的无线遥控器，全动态移动范围的悬臂显屏安装支架。',
                    url: 'http://www.soundlink.com.cn/products/Matching9/727.html',
                    modelName: 'BZLR_P37',
                    img: 'images/products/BZLR_I37.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '助听器效果演示仪',
                    desc: '用于助听器实际效果演示，大大提升了客户的体验感和满意度。使用本产品时可同时供两到四人试听，以满足聋儿的监护人、亲属一同参与试听选购助听器的需求。',
                    url: 'http://www.soundlink.com.cn/products/Matching9/2965.html',
                    modelName: 'BZLR_P40',
                    img: 'images/products/BZLR_I40.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '超声波清洗机',
                    desc: '数码型设计，适用于清洗助听器、耳模，可为客户日常清洗，让您的专营店服务更细致、更贴心，凸显专业，让您的客户对您更信赖。',
                    url: 'http://www.soundlink.com.cn/products/5/637.html',
                    modelName: 'BZLR_P41',
                    img: 'images/products/BZLR_I41.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '真空护理仪',
                    desc: '人工耳蜗、助听器是一种精密且昂贵的电子设备，佩戴时需要与人体接触，人体的新陈代谢产生的汗液、空气中潮气会侵蚀机器，对耳蜗、助听器相关配件存在潜在危害。',
                    url: 'http://www.soundlink.com.cn/products/Matching1/405.html',
                    modelName: 'BZLR_P44',
                    img: 'images/products/BZLR_I44.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '喇叭单元',
                    desc: '标准配件，美国楼氏产品，全系列型号可供选择。',
                    url: 'http://www.soundlink.com.cn/products/6/710.html',
                    modelName: 'BZLR_P47',
                    img: 'images/products/BZLR_I47.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '大号耳朵解剖模型',
                    desc: '有外耳、中耳、内耳组成的解剖模型。可以直观看到听骨链，半规管及耳蜗。适合于摆放在公司或助听器专营店显眼的位置，以营造专业的气氛。通过模型的讲解，增进与客户间的沟通和交流。',
                    url: 'http://www.soundlink.com.cn/product/application/139.html',
                    modelName: 'BZLR_P5',
                    img: 'images/products/BZLR_I5.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: true,
                    changeColor: '',
                    modelType: 'fbx',
                    attr1: '',
                    is720: true
                },
                {
                    productName: '编程器',
                    desc: 'Mini USB Pro 是一种通用型编程器，携带方便，通用性与兼容性强！',
                    url: 'http://www.soundlink.com.cn/products/Matching9/2955.html',
                    modelName: 'BZLR_P8',
                    img: 'images/products/BZLR_I8.png',
                    loadFrame: '720Modal/HF-802.html',
                    transparent: '',
                    animation: '',
                    changeColor: '',
                    modelType: 'glb',
                    attr1: '',
                    is720: true
                },
                // {
                //     productName: '3M™ HF-802扬声器振动膜版硅胶半面型防护面罩',
                //     desc: '· 硅胶面罩，舒适耐用\n' +
                //         '· 插扣式滤材，组装佩戴方便\n' +
                //         '· 装配声振膜，沟通更清晰顺畅\n' +
                //         '· 一键式气密性检查按钮，快速判断佩戴是否正确',
                //     img: 'images/products/HF-802SD.png',
                //     is720: true,
                //     loadFrame: '720Modal/HF-802.html',
                //     attr1: 'HF-802SD',
                //     modelName: 'TempGLB'
                // },
                {
                    productName: 'G5-02',
                    desc: '曲面玻璃技术\n' +
                        '紧凑贴合，视野宽阔\n' +
                        '亮态遮光号 2.5号\n' +
                        '自然色彩技术',
                    img: 'images/products/G5-02.png',
                    is720: true,
                    loadFrame: '720Modal/G5-02.html',
                    attr1: 'G5-02',
                },
                // {
                //     productName: '3M™ Aura™ 9321CN+自吸过滤式防颗粒物口罩',
                //     desc: '· 高效静电滤棉，呼吸阻力小，对非油性颗粒物的过滤效率在95％以上\n' +
                //         '· 三折叠设计，提供较大的内部空间，提高呼吸舒适度\n' +
                //         '· 上面板压花设计，减少通过上面板的气流，帮助减轻眼镜起雾\n' +
                //         '· 针织头带涉及增加佩戴舒适感',
                //     img: 'images/products/9321CN.png',
                //     is720: true,
                //     loadFrame: '720Modal/9321CN.html',
                //     attr1: '9321CN',
                // },
                // {
                //     productName: '3M™ X5A 耳罩, 头带式',
                //     desc: '· 佩戴过程中，头带保持稳定的夹紧力\n' +
                //         '· 头带长度可调节，以实现更好舒适性与防护性\n' +
                //         '· 可更换式耳罩垫圈与泡棉内衬（卫生套件HYX5）\n' +
                //         '· 标称降噪值 （NRR=31 dB SNR= 37 dB）',
                //     img: 'images/products/X5A.png',
                //     is720: true,
                //     loadFrame: '720Modal/X5A.html',
                //     attr1: 'X5A',
                // },
                // {
                //     productName: 'iPak682',
                //     desc: '经典的Ez-Flo供气阀\n' +
                //         '按需供气，呼吸顺畅\n' +
                //         '多重防起露设计\n' +
                //         '凯夫拉头网舒适抗老化\n' +
                //         '兼容远距离通话装置\n' +
                //         '芳纶织物,物理阻燃\n' +
                //         '防误关瓶阀及高品质复合气瓶\n' +
                //         '安全耐用,LA及SINOPPE认证',
                //     img: 'images/products/IPAK682.png',
                //     is720: false,
                //     order: {src: '682iPak', num: 24},
                //     attr1: 'IPAK682',
                // },
                // {
                //     productName: 'X300',
                //     desc: '1、铭牌保护套\n' +
                //         'Velcro保护套可保护工作人员铭牌\n' +
                //         '2、旋钮式调节\n' +
                //         '只需转动旋钮就能简单地调整织带长度\n' +
                //         '3、铝合金D型环\n' +
                //         '航空航天级别的超轻合金，具备更好的安全性和舒适性\n' +
                //         '4、织带末端固定夹\n' +
                //         '使得穿戴更加舒适且避免冗余织带缠绕\n' +
                //         '5、防误操作快插扣\n' +
                //         '轻巧的插口，确保快速不打滑的连接，并有一个防误操作圆盘旋钮，保证使用安全\n' +
                //         '6、防水防油污织带\n' +
                //         '防水，防霉菌和污垢残留，同时有更好的耐磨性\n' +
                //         '7、站立式D型环\n' +
                //         '弹簧加载设计自动站立，确保快速、方便和安全地连接到防坠落系统\n' +
                //         '8、3M THINSULATE 反光材料\n' +
                //         '在腿部、胸部、肩部和背部融入3MTHINSULATE 反光材料，以提高在黑暗和危险的环境中的能见度\n' +
                //         '9、冲击指示器\n' +
                //         '撕裂缝合指示器允许您一目了然地检查安全带是否存在先前损坏的冲击载荷\n' +
                //         '10、舒适防磨腰垫\n' +
                //         '可缓冲减轻攀爬或愚吊压力，提供额外的舒适度，吸收能量，并有助于重量分配\n' +
                //         '11、臀部衬垫\n' +
                //         '防止织带滑动并可减少磨损\n' +
                //         '12、悬吊脚蹬带\n' +
                //         '适用于各类全身式安全带；产品型号：9501403)\n' +
                //         '在万一发生的空中悬吊的情况下，使用腿蹬带可以缓解工作人员腿部的压迫，减少淤血的风险',
                //     img: 'images/products/X300.png',
                //     is720: false,
                //     order: {src: 'X300', num: 23},
                //     attr1: 'X300',
                // },
                // {
                //     productName: '3M™ Versaflo™ TR-600动力送风过滤式呼吸器',
                //     desc: '3M™ Versaflo™ TR-600 动力送风过滤式呼吸器可在众多应用领域提供简便的使用和维护体验。根据您的喜好和环境要求，可以自由搭配适配的头罩，呼吸管；滤材也包含了滤棉以及种类丰富的尘毒组合滤毒盒。\n' +
                //         '\n' +
                //         'TR-600系统搭配清洁套件可浸泡清洗。非常便于维护和清洁。',
                //     img: 'images/products/TR-600.png',
                //     is720: false,
                //     order: {src: 'TR600', num: 24},
                //     attr1: 'TR-600',
                // },
                // {
                //     productName: '3M™ SecureFit™ 中国款防雾防护眼镜 SF301AF 透明',
                //     desc: '· 根据亚洲人头模及脸型设计，3M压力扩散镜腿技术可让镜腿根据头部尺寸自调节，一款眼镜即可满足不同头型尺寸客户需求\n' +
                //         '· 20g重量，打造舒适的、耐用、轻便的眼部防护。\n' +
                //         '· 柔软的镜腿材料及可调节鼻垫，提升长期佩戴舒适度\n' +
                //         '· 佩戴稳固，不易滑落',
                //     img: 'images/products/SF301AF.png?v20230330',
                //     is720: false,
                //     order: {src: 'SF301AF', num: 24},
                //     attr1: 'SF301AF-20230330',
                // },
            ]
        }
    },
    methods: {
        onClickProduct(index) {
            if (this.currentProduct === index) {
                return;
            }
            this.currentProduct = index;
            this.showChangeColor = this.productList[index].changeColor !== '';
            // console.log(showChangeColor);

            this.showAnimation = this.productList[index].animation === true;
            // console.log(this.showAnimation);
            
            
            this.is720 = this.productList[index].is720;
            // console.log(this.is720);
            if (this.is720) {
                $("#childFrame").css("opacity", 0);
                console.log("720模型");
                setTimeout(function (){
                    $("#childFrame").css("opacity", 1);
                }, 300)
            } else {
                let src = this.productList[index].order.src,
                    num = this.productList[index].order.num;
                setTimeout(function () {
                    showProduct(src, num);
                }, 100);
            }

            isShow = false;
            if (winWidth <= 768) {
                $(".product-description").hide();
            }

        },
    },
});

const vm = app.mount("#app");