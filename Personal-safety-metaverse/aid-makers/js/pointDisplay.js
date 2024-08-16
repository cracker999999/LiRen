// 需要显示的热点文字
let needShowHotspot = [];

//init.js dispatchEvent
document.addEventListener('hotspot_click', onHotspotClick);


function onHotspotClick(e) {
    vm.curProductTypeIndex = 0;
    vm.curProductIndex = 0;
    console.log(e)
    let hotspotId = e.info.id, //id配置在tour.xml
        text = e.info.text;
    vm.curHotspot = hotspotId;
    console.log("hotspotId: " + hotspotId);

    onClickHotspot(hotspotId, vm);

    var sceneItem = vm.sceneList[vm.sceneIndex];
    var sceneName = sceneItem.name;

    let sceneIndex = vm.sceneIndex,
        curProductTypeList = vm.curProductTypeList;
        
    console.log(text);
    

    //显示危害弹窗
    // vm.showAlertBox = true;

    curProductTypeList = vm.curProductList.map(item => item.productType);
    vm.curProductTypeList = vm.productTypeList.filter(item => {
        return curProductTypeList.includes(item.name);
    });
    // console.log(">>>" + vm.curProductTypeList[0].name)
    if(vm.curProductTypeList.length > 0){
        vm.curProductList = vm.curProductList.filter(item =>{
            return item.productType === vm.curProductTypeList[0].name;
        })
    }

    

    var title = '场景页面-化工-' + sceneName;
    var name = '场景页面-化工-' + sceneName + '-场景危害查看';
    var attr1 = text;
    var attr2 = '';

    typeof addOpenPageEvent == 'function' && addOpenPageEvent(title + '-危害弹框-' + text);
    typeof addPageEvent == 'function' && addPageEvent(title, name, attr1, attr2);
}