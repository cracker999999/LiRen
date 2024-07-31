var winWidth = $(window).width() || window.innerWidth || document.documentElement.clientWidth
    , winHeight = $(window).height() || window.innerHeight || document.documentElement.clientHeight;
console.log(winWidth, winHeight);

const app = Vue.createApp({
    data() {
        return {
            is720: true,
            currentProduct: 0,
            productList: [
                {
                    productName: '3M™ HF-802扬声器振动膜版硅胶半面型防护面罩',
                    desc: '· 硅胶面罩，舒适耐用\n' +
                        '· 插扣式滤材，组装佩戴方便\n' +
                        '· 装配声振膜，沟通更清晰顺畅\n' +
                        '· 一键式气密性检查按钮，快速判断佩戴是否正确',
                    img: 'images/products/HF-802SD.png',
                    is720: true,
                    loadFrame: '720Modal/HF-802.html',
                    attr1: 'HF-802SD',
                },
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
                {
                    productName: '3M™ Aura™ 9321CN+自吸过滤式防颗粒物口罩',
                    desc: '· 高效静电滤棉，呼吸阻力小，对非油性颗粒物的过滤效率在95％以上\n' +
                        '· 三折叠设计，提供较大的内部空间，提高呼吸舒适度\n' +
                        '· 上面板压花设计，减少通过上面板的气流，帮助减轻眼镜起雾\n' +
                        '· 针织头带涉及增加佩戴舒适感',
                    img: 'images/products/9321CN.png',
                    is720: true,
                    loadFrame: '720Modal/9321CN.html',
                    attr1: '9321CN',
                },
                {
                    productName: '3M™ X5A 耳罩, 头带式',
                    desc: '· 佩戴过程中，头带保持稳定的夹紧力\n' +
                        '· 头带长度可调节，以实现更好舒适性与防护性\n' +
                        '· 可更换式耳罩垫圈与泡棉内衬（卫生套件HYX5）\n' +
                        '· 标称降噪值 （NRR=31 dB SNR= 37 dB）',
                    img: 'images/products/X5A.png',
                    is720: true,
                    loadFrame: '720Modal/X5A.html',
                    attr1: 'X5A',
                },
                {
                    productName: 'iPak682',
                    desc: '经典的Ez-Flo供气阀\n' +
                        '按需供气，呼吸顺畅\n' +
                        '多重防起露设计\n' +
                        '凯夫拉头网舒适抗老化\n' +
                        '兼容远距离通话装置\n' +
                        '芳纶织物,物理阻燃\n' +
                        '防误关瓶阀及高品质复合气瓶\n' +
                        '安全耐用,LA及SINOPPE认证',
                    img: 'images/products/IPAK682.png',
                    is720: false,
                    order: {src: '682iPak', num: 24},
                    attr1: 'IPAK682',
                },
                {
                    productName: 'X300',
                    desc: '1、铭牌保护套\n' +
                        'Velcro保护套可保护工作人员铭牌\n' +
                        '2、旋钮式调节\n' +
                        '只需转动旋钮就能简单地调整织带长度\n' +
                        '3、铝合金D型环\n' +
                        '航空航天级别的超轻合金，具备更好的安全性和舒适性\n' +
                        '4、织带末端固定夹\n' +
                        '使得穿戴更加舒适且避免冗余织带缠绕\n' +
                        '5、防误操作快插扣\n' +
                        '轻巧的插口，确保快速不打滑的连接，并有一个防误操作圆盘旋钮，保证使用安全\n' +
                        '6、防水防油污织带\n' +
                        '防水，防霉菌和污垢残留，同时有更好的耐磨性\n' +
                        '7、站立式D型环\n' +
                        '弹簧加载设计自动站立，确保快速、方便和安全地连接到防坠落系统\n' +
                        '8、3M THINSULATE 反光材料\n' +
                        '在腿部、胸部、肩部和背部融入3MTHINSULATE 反光材料，以提高在黑暗和危险的环境中的能见度\n' +
                        '9、冲击指示器\n' +
                        '撕裂缝合指示器允许您一目了然地检查安全带是否存在先前损坏的冲击载荷\n' +
                        '10、舒适防磨腰垫\n' +
                        '可缓冲减轻攀爬或愚吊压力，提供额外的舒适度，吸收能量，并有助于重量分配\n' +
                        '11、臀部衬垫\n' +
                        '防止织带滑动并可减少磨损\n' +
                        '12、悬吊脚蹬带\n' +
                        '适用于各类全身式安全带；产品型号：9501403)\n' +
                        '在万一发生的空中悬吊的情况下，使用腿蹬带可以缓解工作人员腿部的压迫，减少淤血的风险',
                    img: 'images/products/X300.png',
                    is720: false,
                    order: {src: 'X300', num: 23},
                    attr1: 'X300',
                },
                {
                    productName: '3M™ Versaflo™ TR-600动力送风过滤式呼吸器',
                    desc: '3M™ Versaflo™ TR-600 动力送风过滤式呼吸器可在众多应用领域提供简便的使用和维护体验。根据您的喜好和环境要求，可以自由搭配适配的头罩，呼吸管；滤材也包含了滤棉以及种类丰富的尘毒组合滤毒盒。\n' +
                        '\n' +
                        'TR-600系统搭配清洁套件可浸泡清洗。非常便于维护和清洁。',
                    img: 'images/products/TR-600.png',
                    is720: false,
                    order: {src: 'TR600', num: 24},
                    attr1: 'TR-600',
                },
                {
                    productName: '3M™ SecureFit™ 中国款防雾防护眼镜 SF301AF 透明',
                    desc: '· 根据亚洲人头模及脸型设计，3M压力扩散镜腿技术可让镜腿根据头部尺寸自调节，一款眼镜即可满足不同头型尺寸客户需求\n' +
                        '· 20g重量，打造舒适的、耐用、轻便的眼部防护。\n' +
                        '· 柔软的镜腿材料及可调节鼻垫，提升长期佩戴舒适度\n' +
                        '· 佩戴稳固，不易滑落',
                    img: 'images/products/SF301AF.png?v20230330',
                    is720: false,
                    order: {src: 'SF301AF', num: 24},
                    attr1: 'SF301AF-20230330',
                },
            ]
        }
    },
    methods: {
        onClickProduct(index) {
            this.currentProduct = index;
            this.is720 = this.productList[index].is720;
            console.log(this.is720);
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