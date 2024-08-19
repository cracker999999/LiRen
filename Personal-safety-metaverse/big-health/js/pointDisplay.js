// 需要显示的热点文字
let needShowHotspot = [];

document.addEventListener('hotspot_click', onHotspotClick);


function onHotspotClick(e) {
    vm.curProductTypeIndex = 0;
    vm.curProductIndex = 0;
    console.log(e)
    let hotspotId = e.info.id,
        text = e.info.text;
    console.log("hotspotId: " + hotspotId);

    onClickHotspot(hotspotId, vm);

    var sceneItem = vm.sceneList[vm.sceneIndex];
    var sceneName = sceneItem.name;

    let sceneIndex = vm.sceneIndex,
        curAlertIndex = vm.curAlertIndex,
        curAlertList = vm.curAlertList,
        productList = vm.productList,
        curProductList = vm.curProductList;

    console.log(text);

    switch (text) {
        case '颗粒物':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '颗粒物');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('颗粒物');
            });
            break;
        case '有害气体':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '有害气体');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('有害气体');
            });
            break;
        case '冲击物':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '冲击物');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('冲击物');
            });
            break;
        case '噪音':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '噪音');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('噪音');
            });
            break;
        case '光学辐射':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '光学辐射');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('光学辐射');
            });
            break;
        case '漆雾':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '漆雾');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('漆雾') ;
            });
            console.log(vm.curAlertIndex, vm.curProductList)
            break;
        case '有机蒸气':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '有机蒸气');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('有机蒸气');
            });
            break;
        case '油漆':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '油漆');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('油漆');
            });
            break;
        default:
            return;
    }

    console.log("当前危害：", vm.curAlertList);

    vm.curAlertList.forEach((alertItem) => {
        alertItem.alertInfos.forEach((alertInfo)=>{
            alertInfo.productList = [];
            let filterProducts = vm.curProductList.filter((product) => {
                return product.solutionName.includes(alertInfo.solutionName);
            });
            alertInfo.productList.push(...filterProducts);
        })
    });

    // vm.showAlertBox = true;

    var title = '场景页面-汽车-' + sceneName;
    var name = '场景页面-汽车-' + sceneName + '-场景危害查看';
    var attr1 = text;
    var attr2 = '';

    typeof addOpenPageEvent == 'function' && addOpenPageEvent(title + '-危害弹框-' + text);
    typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
}