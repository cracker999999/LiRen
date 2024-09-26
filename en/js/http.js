
function PSDHttp() {

}

var System = {
    AddPageLog: function (pageKeys, pageName, pageDescription, pageParameter, pageParameterJson, eventType, eventTypeDescription, eventKeys, eventDescription, pageSource, pageSourceDescription, parentPage, parentEvent, sourceTable, sourceTableDataId, description, remarks) {
        var paramsObject = {};
        paramsObject['UserId'] = 0;
        paramsObject['EquipmentType'] = navigator.userAgent;
        paramsObject['WebSiteKeys'] = "3M-PSD";
        paramsObject['PageKeys'] = pageKeys;
        paramsObject['PageName'] = pageName;
        paramsObject['PageDescription'] = pageDescription;
        paramsObject['PageParameter'] = pageParameter;
        paramsObject['PageParameterJson'] = pageParameterJson;
        paramsObject['EventType'] = eventType;
        paramsObject['EventTypeDescription'] = eventTypeDescription;
        paramsObject['EventKeys'] = eventKeys;
        paramsObject['EventDescription'] = eventDescription;
        paramsObject['PageSource'] = pageSource;
        paramsObject['PageSourceDescription'] = pageSourceDescription;
        //paramsObject['ParentPage'] = parentPage;
        paramsObject['ParentPage'] = document.location.href;
        paramsObject['ParentEvent'] = parentEvent;
        paramsObject['SourceTable'] = sourceTable;
        paramsObject['SourceTableDataId'] = sourceTableDataId;
        paramsObject['Description'] = description;
        paramsObject['Remarks'] = remarks;
        return ServiceJs.request(paramsObject, "3m_system_002");
    },
}

var Common = {
    GetConfigWXSDK: function (url) {
        var paramsObject = {};
        paramsObject['url'] = url;
        paramsObject['r'] = Math.random();
        return ServiceJs.request(paramsObject, "3m_common_001");
    },
}
PSDHttp.prototype.System = System;
PSDHttp.prototype.Common = Common;