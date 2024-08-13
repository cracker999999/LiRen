// 需要显示的热点文字
let needShowHotspot = [];

document.addEventListener('hotspot_click', onHotspotClick);


function onHotspotClick(e) {
    vm.solutionIndex = 0;
    vm.curProductTypeIndex = 0;
    vm.curProductIndex = 0;
    console.log(e)
    let hotspotId = e.info.id,
        text = e.info.text;
    console.log("hotspotId: " + hotspotId);

    var sceneItem = vm.sceneList[vm.sceneIndex];
    var sceneName = sceneItem.name; //$('.scene-select-box .preview-box.active .scene-name').html();

    let sceneIndex = vm.sceneIndex,
        curAlertIndex = vm.curAlertIndex,
        curAlertList = vm.curAlertList,
        curProductTypeList = vm.curProductTypeList,
        curProductTypeIndex = vm.curProductTypeIndex,
        productList = vm.productList,
        newProductList = vm.newProductList;
    console.log(text)
    switch (text) {
        case '洞口作业':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '洞口作业');
            vm.newProductList = productList.filter(item => {
                return item.alertList.includes('洞口作业');
            });
            break;
        case '临边作业':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '临边作业');
            vm.newProductList = productList.filter(item => {
                return item.alertList.includes('临边作业');
            });
            break;
        case '攀登作业':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '攀登作业');
            vm.newProductList = productList.filter(item => {
                return item.alertList.includes('攀登作业');
            });
            break;
        case '悬空作业':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '悬空作业');
            vm.newProductList = productList.filter(item => {
                return item.alertList.includes('悬空作业');
            });
            if (hotspotId == 'jz_xuankong1') {
                vm.newProductList = vm.newProductList.filter(item => item.id !== 15);
                vm.curAlertList[vm.curAlertIndex].productTypeList[0].text = '根据悬空作业建筑结构的类型选择适用的锚点连接件，例如：3M织带锚点、3M钢缆锚点和3M悬臂系统等。'
                vm.curAlertList[vm.curAlertIndex].productTypeList[1].text = '全身式安全带，并配备前胸、后背、和腰侧D型环。'
            }
            if (hotspotId == 'jz_xuankong2') {
                vm.newProductList = vm.newProductList.filter(item => item.id !== 14 && item.id !== 2);
                vm.curAlertList[vm.curAlertIndex].productTypeList[0].text = '根据悬空作业建筑结构的类型选择适用的锚点连接件，例如：3M织带锚点、3M临时垂直生命线及滑梭等。'
                vm.curAlertList[vm.curAlertIndex].productTypeList[1].text = '全身式安全带，并配备前胸、后背D型环。'
            }
            break;
        case '操作平台':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '操作平台');
            vm.newProductList = productList.filter(item => {
                return item.alertList.includes('操作平台');
            });
            break;
        case '交叉作业':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '交叉作业');
            vm.newProductList = productList.filter(item => {
                return item.alertList.includes('交叉作业');
            });
            break;
        default:
            return;
    }

    vm.curProductTypeList = curAlertList[vm.curAlertIndex].productTypeList;
    console.log("点击的作业：", vm.curAlertList[vm.curAlertIndex]);
    console.log("现有产品", vm.newProductList);
    console.log("现有作业", vm.curAlertList);

    vm.showScenePreview = false;
    vm.showDamageModal = true;


    var title = '场景页面-建筑-' + sceneName;
    var name = '场景页面-建筑-' + sceneName + '-场景危害查看';
    var attr1 = text;
    var attr2 = '';

    typeof addOpenPageEvent == 'function' && addOpenPageEvent(title + '-危害弹框-' + text);
    typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
}