
function Http() {

}

var Psd = {
    Upload: function (formData) {
        var paramsObject = {};
        paramsObject['r'] = Math.random();
        return ServiceJs.request(paramsObject, "3m_upload", "upload", false, formData);
    },
    FaceMerge: function (userSex, fileId) {
        var paramsObject = {};
        paramsObject['userSex'] = userSex;
        paramsObject['fileId'] = fileId;
        paramsObject['r'] = Math.random();
        return ServiceJs.request(paramsObject, "3m_psd_001");
    },
}

Http.prototype.Psd = Psd;