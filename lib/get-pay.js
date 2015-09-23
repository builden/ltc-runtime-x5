var util = require('./util.js');
var console = require('better-console');
var s = require('underscore.string');

// GET + 发货回调URL去掉前缀 + 链接本身参数（比如，http://xxx.com/x5/pay?action=inquiry, 其中?后的action=inquiry表示此参数，此时第三个参数为"action=inquiry"，否则第三个参数为""）
var PAY_URL = ['GET', '/x5/pay', ''];

exports.x5_decodePay = function(query) {
  var data = util.x5_quote(query.data);
  var reqsig = util.x5_quote(query.reqsig);

  if (!x5_is_correct_of_pay_sign(data, reqsig)) {
    return null;
  }

  return x5_get_decoded_args(data);
};

// 添加"发货"前缀字段后，做URL编码
function x5_encode_url_pay(url) {
  return util.x5_encode_url(PAY_URL, url);
}

// 发货回调里用的签名函数
function x5_sign_pay_data(data) {
  var r = x5_encode_url_pay(data);
  r = util.x5_hmac_base64(new Buffer(r));
  r = util.x5_quote(r);
  return r;
}


// 检测发货的签名是否正确
function x5_is_correct_of_pay_sign(data, sign) {
  var ret = false;
  var calc_sign = x5_sign_pay_data(data);
  ret = sign === calc_sign;
  if (!ret) {
    console.error('x5_is_correct_of_price_sign failed, expect: ' + sign + '; calc: ' + calc_sign);
  }
  return ret;
};

// 生成发货响应数据，返回json格式
// 测试数据：
// data = "{\"nonce\": \"xnqScIyYzuDgvGj\", \"ret\": 0, \"time\": 1430404489}";
// 用此测试数据返回的结果为: 发货响应数据:{"rspsig": "ZxGojeCwrOpJH2eIbmUObTzHHIo%3D", "data": "GVXnSvyysWVKS0c5QaHNDbeYMHRgl99qoRv4hAOXzp8gLtR%2F5XMg7CBK5%2FcmuhDrL3t%2BxEJrouNRs7eNK1p%2FwA%3D%3D"}
exports.x5_pay_response = function x5_pay_response(obj) {
  var data = util.jsonToStr(obj);
  var encrytedData = util.x5_encrypt(data);
  var sign = x5_sign_pay_data(encrytedData);

  var ret = {
    data: encrytedData,
    rspsig: sign
  };

  return ret;
};

function x5_get_decoded_args(data) {
  var argObj = {};
  var decrypted_data = util.x5_decrypt(data);
  decrypted_data = decrypted_data.trim();
  var argList = decrypted_data.split('&');
  argList.forEach(function(arg) {
    var left = s.strLeft(arg, '=').trim();
    var right = s.strRight(arg, '=').trim().replace(/[\u0000]/g, '');
    argObj[left] = right;
  });
  return argObj;
}