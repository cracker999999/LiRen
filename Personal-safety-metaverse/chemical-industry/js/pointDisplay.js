// 需要显示的热点文字
let needShowHotspot = [];

document.addEventListener('hotspot_click', onHotspotClick);


function onHotspotClick(e) {
    vm.curProductTypeIndex = 0;
    vm.curProductIndex = 0;
    console.log(e)
    let hotspotId = e.info.id,
        text = e.info.text;
    vm.curHotspot = hotspotId;
    console.log("hotspotId: " + hotspotId);
    var sceneItem = vm.sceneList[vm.sceneIndex];
    var sceneName = sceneItem.name;

    let sceneIndex = vm.sceneIndex,
        curAlertIndex = vm.curAlertIndex,
        curAlertList = vm.curAlertList,
        productList = vm.productList,
        curProductList = vm.curProductList,
        curProductTypeList = vm.curProductTypeList,
        curProductTypeIndex = vm.curProductTypeIndex,
        targetProduct;
    vm.modalSceneName = sceneName;
    console.log(text);
    switch (text) {
        case '高空坠落':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '高空坠落');

            if (hotspotId == 'jxdz_zhuiluo1' || hotspotId == 'jxdz_zhuiluo3') {
                vm.curProductList = productList.filter(item => {
                    return item.sceneName.includes(sceneName) && item.alertList.includes('高空坠落') && item.productType != '水平生命线';
                });
            }else{
                vm.curProductList = productList.filter(item => {
                    return item.sceneName.includes(sceneName) && item.alertList.includes('高空坠落');
                });
            }
            if(hotspotId == 'zxh_zhuiluo1'){
                vm.curAlertList[0].text = '槽罐车卸货前取样检测时，作业人员需要站在槽罐车上方，存在高空坠落风险';
                vm.curProductList = productList.filter(item => {
                    return item.sceneName.includes(sceneName) && item.alertList.includes('高空坠落') && item.name != '3M™ DBI-SALA®横梁滑车2103143';
                });
            }
            if(hotspotId == 'zxh_zhuiluo2'){
                vm.curAlertList[0].text = '货车装卸货时，作业人员需要站在货车上方，存在高空坠落风险';
                vm.curProductList = productList.filter(item => {
                    return item.sceneName.includes(sceneName) && item.alertList.includes('高空坠落') && item.name != '3M™ DBI-SALA® 固定织带 1003000';
                });
            }
            break;
        case '有害气态物':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '有害气态物');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('有害气态物');
            });
            targetProduct = vm.curProductList.find(item => {
                return item.name === "Scott iPak/3265E"
            });
            if(targetProduct){
                targetProduct.productType = ''
            };
            break;
        case '有害气体':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '有害气体');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('有害气体');
            });
            break;
        case '液体喷溅':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '液体喷溅');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('液体喷溅');
            });
            break;
        case '液体飞溅':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '液体飞溅');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('液体飞溅');
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
        case '焊烟':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '焊烟');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('焊烟');
            });
            break;
        case '焊接弧光':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '焊接弧光');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('焊接弧光');
            });
            break;
        case '金属飞溅物':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '金属飞溅物');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('金属飞溅物');
            });
            if(hotspotId == 'hjdm_jinshufeijian1'){
                vm.curAlertList[2].text = '焊接作业会产生高速碎屑，可能对眼面部产生冲击危害';
                vm.curProductList = vm.curProductList.filter(item => {
                    return item.name === '3M™ Speedglas™ G5-01TW Adflo 焊接呼吸防护套装';
                })
            }
            if(hotspotId == 'hjdm_jinshufeijian2'){
                vm.curAlertList[2].text = '打磨作业会产生高速碎屑，可能对眼面部产生冲击危害';
                vm.curProductList = vm.curProductList.filter(item => {
                    return item.name != '3M™ Speedglas™ G5-01TW Adflo 焊接呼吸防护套装';
                })
            }
            break;
        case '粉尘':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '粉尘');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('粉尘');
            });
            break;
        case 'IDLH环境':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === 'IDLH环境');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('IDLH环境');
            });
            break;
        case '应急救援装备':
            vm.curAlertIndex = curAlertList.findIndex(item => item.name === '应急救援装备');
            vm.curProductList = productList.filter(item => {
                return item.sceneName.includes(sceneName) && item.alertList.includes('应急救援装备');
            });
            targetProduct = vm.curProductList.find(item => {
                return item.name === "Scott iPak/3265E"
            });
            if(targetProduct){
                targetProduct.productType = '呼吸'
            };
            break;
        default:
            return;
    }

    if (hotspotId == 'rczy_zaoyin1' || hotspotId == 'rczy_feijian1' || hotspotId == 'rczy_qitaiwu1') {
        vm.modalSceneName = '装置取样';
    }
    if (hotspotId == 'rczy_zaoyin2' || hotspotId == 'rczy_qitaiwu2') {
        vm.modalSceneName = '日常巡检';
    }
    if (hotspotId == 'jxdz_zhuiluo1' || hotspotId == 'jxdz_zhuiluo3') {
        vm.modalSceneName = '脚手架作业';
    }
    if (hotspotId == 'jxdz_zhuiluo2') {
        vm.modalSceneName = '管廊作业';
    }
    if (hotspotId == 'hjdm_hanjiehuguang1' || hotspotId == 'hjdm_hanyan1' || hotspotId == 'hjdm_jinshufeijian1' || hotspotId == 'hjdm_zaoyin1') {
        vm.modalSceneName = '焊接'
    }
    if (hotspotId == 'hjdm_zaoyin2' || hotspotId == 'hjdm_fenchen1' || hotspotId == 'hjdm_jinshufeijian2') {
        vm.modalSceneName = '打磨'
    }
    vm.showAlertBox = true;

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