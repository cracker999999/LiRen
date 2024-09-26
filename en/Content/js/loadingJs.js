
var baseUrl = document.getElementById('main').getAttribute('data-baseurl');
// console.log(baseUrl);
baseUrl = baseUrl.replace('../', '');
document.write('<script type="text/javascript" src="' + baseUrl + 'Content/js/configs/configs.js?v=' + Math.random() + '"><\/script>');
document.write('<script type="text/javascript" src="' + baseUrl + 'Content/js/contentJs.js?v=' + Math.random() + '"><\/script>');