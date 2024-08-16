var winWidth = $(window).width() || window.innerWidth || document.documentElement.clientWidth
    , winHeight = $(window).height() || window.innerHeight || document.documentElement.clientHeight;
console.log(winWidth, winHeight);

document.addEventListener('productConfigLoaded', onProductConfigLoaded);

function onProductConfigLoaded(e) {
    vm.productList = productList;
    vm.isConfigLoaded = true;
}

const app = Vue.createApp({
    data() {
        return {
            isConfigLoaded: false,
            is720: true,
            currentProduct: 0,
            showChangeColor: false, //默认值取第一个产品
            showAnimation: false, //默认值取第一个产品
            productList: []
        }
    },

    beforeCreate(){
        // console.log('beforeCreate');
    },
    created() {
        // console.log(new Date().getTime());
        // this.loadProductConfig();
        // console.log('created');
    },
    beforeMount(){
        // console.log('beforeMount');
    },
    mounted() {
        // console.log('mounted');
    },

    beforeUpdate(){
        // console.log('beforeUpdate');
    },
    updated(){
        // console.log('updated');
    },

    watch:{
        isConfigLoaded(newValue){
            if(newValue){
                // console.log('isConfigLoaded');
                this.$nextTick(() => {
                    var productSwiper = new Swiper('.productThumSwiper', {
                        slidesPerView: 'auto',
                    });

                    window.initEvent();
                    window.initBtns();
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
        //             // console.log(new Date().getTime());
        //             console.log('产品总数: '+this.productList.length);
        //             this.isConfigLoaded = true;
        //         })
        //         .catch(error => {
        //             console.error('Error loading config:', error);
        //         });
        // },
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