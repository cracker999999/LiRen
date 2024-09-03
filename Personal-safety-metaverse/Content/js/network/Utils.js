function sortCharter(a, b) {
  if (a.toString().toUpperCase() > b.toString().toUpperCase()) {
    return 1;
  }
  else if (a.toString().toUpperCase() == b.toString().toUpperCase()) {
    return 0;
  }
  else {
    return -1;
  }
}

function objKeySort(obj) {//排序的函数
  var newkey = Object.keys(obj).sort(sortCharter);
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newObj = {};//创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj;//返回排好序的新对象
}


String.prototype.PadLeft = function (len, charStr) {
  var s = this + '';
  return new Array(len - s.length + 1).join(charStr, '') + s;
}

//创建sign
function create_sign(data, appsecret) {

  // console.log("1、排序前create_sign0");
  // console.log(data);
  //1、排序
  var news_data = objKeySort(data);
  // console.log("1、排序后create_sign111");
  // console.log(news_data);
  //2.拼接
  var txt = "";
  var newkey = Object.keys(news_data);
  //console.log("for内部===k-v");
  for (var i = 0; i < newkey.length; i++) {//遍历newkey数组

      var _value = news_data[newkey[i]];
      if (typeof _value != 'undefined' && !newkey[i].startsWith('X-')) {

          if (i > 0) { txt = txt + ";"; }

          _value = _value == null ? '' : _value;
          txt = txt + newkey[i].length.toString().PadLeft(2, '0');
          txt = txt + "-";
          txt = txt + newkey[i];
          txt = txt + ":";
          //console.log(newkey[i]);
          //console.log(data[newkey[i]]);


          txt = txt + _value.toString().length.toString().PadLeft(4, '0');
          txt = txt + "-";
          txt = txt + _value.toString();

      }
  }
  //console.log("for内部===3.追加私钥appsecret");
  //3.追加私钥appsecret
  //console.log(txt);
  // console.log("appsecret=" + appsecret);
  txt = txt + appsecret;
  //console.log("加密前 txt=" + txt);
  //4.md5加密
  //console.log(txt);
  txt = md5(txt);
  //console.log(txt);
  return txt;
}
