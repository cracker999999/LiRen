var InitIssue = function (win) {
    return {
        uoload: function (element) {

            let Id = $(element).attr('id');
            let name = $(element).attr('name');

            //var formData = new FormData(document.getElementById("fileform"));
            var formData = new FormData();
            formData.append(name, $(element)[0].files[0]);           
            //回调页面
            typeof win.FinsihUploadFun == "function" && window.FinsihUploadFun(formData);
            //设置之前上传类型
            let accept = $(element).attr('accept');
            //重新替换内容，解决重新选择同一张图片时，无法触发onchange事件
            $(element).replaceWith('<input id="' + Id + '" name="' + name + '" type="file" class="upload-input" accept="' + accept + '" onchange="InitIssue.uoload(this);" />  ');
        }
    }
}(window);