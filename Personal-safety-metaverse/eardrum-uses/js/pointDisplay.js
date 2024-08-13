// 需要显示的热点文字
let needShowHotspot = [];

document.addEventListener('hotspot_click', onHotspotClick);

function onHotspotClick(e) {
    vm.curProductIndex = 0;
    console.log(e)
    let hotspotId = e.info.id,
        text = e.info.text;
    console.log("hotspotId: " + hotspotId);
    let sceneIndex = vm.sceneIndex,
        sceneName = vm.sceneList[sceneIndex].name,
        curAlertIndex = vm.curAlertIndex,
        curAlertList = vm.curAlertList,
        productList = vm.productList,
        curProductList = vm.curProductList;

    console.log(text);

    switch (text) {
        case '粉尘':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '粉尘');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('粉尘');
            });
            break;
        case '有害气体':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '有害气体');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('有害气体');
            });
            break;
        case '噪音':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '噪音');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('噪音');
            });
            break;
        case '冲击物':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '冲击物');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('冲击物');
            });
            break;
        default:
            return;
    }
    vm.showAlertBox = true;

    var title = '场景页面-冶金-' + sceneName;
    var name = '场景页面-冶金-' + sceneName + '-场景危害查看';
    var attr1 = text;
    var attr2 = '';

    typeof addOpenPageEvent == 'function' && addOpenPageEvent(title + '-危害弹框-' + text);
    typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
}