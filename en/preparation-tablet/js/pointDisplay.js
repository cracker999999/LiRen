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
    let sceneIndex = vm.sceneIndex,
        secondarySceneIndex = vm.secondarySceneIndex,
        secondarySceneItem = vm.secondarySceneList[secondarySceneIndex],
        secondarySceneName = secondarySceneItem.secondarySceneName,
        sceneItem = secondarySceneItem.sceneList[sceneIndex],
        sceneName = sceneItem.name,
        curAlertIndex = vm.curAlertIndex,
        curAlertList = vm.curAlertList,
        curAlert = curAlertList[curAlertIndex],
        productList = vm.productList,
        curProductList = vm.curProductList;

    console.log(sceneName);

    switch (text) {
        case '粉尘':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '粉尘');

            if(sceneName == '反应釜投料'){
                vm.curProductList = productList.filter(item => {
                    return item.sceneName.includes(sceneName) && item.alertList.includes('粉尘') && item.name != '1621 防化学液体飞溅防护眼罩';
                });
            }else{
                vm.curProductList = productList.filter(item => {
                    return item.sceneName.includes(sceneName) && item.alertList.includes('粉尘');
                });
            }
            break;
        case '噪音':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '噪音');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('噪音');
            });
            break;
        case '有害气态物':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '有害气态物');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('有害气态物');
            });
            if(hotspotId == 'tl_qitaiwu1'){
                vm.curAlertList[vm.curAlertIndex].text = '有害气体或蒸气';
            }else{
                vm.curAlertList[vm.curAlertIndex].text = '有害蒸气';
            }
            break;
        case '冲击物':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '冲击物');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('冲击物');
            });
            break;
        case '液体飞溅':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '液体飞溅');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('液体飞溅');
            });
            break;
        default:
            return;
    }

    console.log("当前危害：", vm.curAlertList);

    vm.showAlertBox = true;

    var title = '场景页面-制药-' + secondarySceneName + '-' + sceneName;
    var name = '场景页面-制药-' + secondarySceneName + '-' + sceneName + '-场景危害查看';
    var attr1 = text;
    var attr2 = '';

    typeof addOpenPageEvent == 'function' && addOpenPageEvent(title + '-危害弹框-' + text);
    typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
}
