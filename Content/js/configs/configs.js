
window.SubApplication = '';//子应用目录
window.APPMODE = 'dev';//当前环境  test--测试  pub--正式 dev--开发  pre--预发布 修改变量
window.Version = "1.0";//版本号
window.wx_appid = '';//微信公众号appid
window.API_BASE_URL = "https://3m-service.sjune.cn/API.ashx";//api请求url
//window.Directory = "/mobile";//项目根目录


if (window.APPMODE == 'dev') { //开发环境使用
    window.SubApplication = '';//子应用目录
    window.wx_appid = '';//清空appid，使用默认沙盒测试
    window.Version = Math.random();
} else if (window.APPMODE == 'test') { //测试环境使用
    window.SubApplication = '';//子应用目录
    window.wx_appid = '';//尚隽微信公众号appid
} else if (window.APPMODE == 'pre') { //预发布环境使用
    window.SubApplication = '';//子应用目录
}
window.API_BASE_URL = window.SubApplication + window.API_BASE_URL;//api请求url
