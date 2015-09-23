var util = require('./util.js');
var console = require('better-console');
var s = require('underscore.string');

// GET + 批价回调URL去掉前缀 + 链接本身参数（比如，http://xxx.com/x5/price?action=inquiry, 其中?后的action=inquiry表示此参数，此时第三个参数为"action=inquiry"，否则第三个参数为""）
var PRICE_URL = ['GET', '/x5/price', ''];

exports.x5_decodePrice = function(query) {
  var data = util.x5_quote(query.data);
  var reqsig = util.x5_quote(query.reqsig);

  if (!x5_is_correct_of_price_sign(data, reqsig)) {
    return null;
  }

  return x5_get_decoded_args(data);
};


// 添加"批价"前缀字段后，做URL编码
function x5_encode_url_price(url) {
  return util.x5_encode_url(PRICE_URL, url);
}

/**
 * 批价回调里用的签名函数
 * @param  {String} data
 * @return {String}
 */
function x5_sign_price_data(data) {
  var r = x5_encode_url_price(data);
  r = util.x5_hmac_base64(new Buffer(r));
  r = util.x5_quote(r);
  return r;
}

/**
 * 检测批价的签名是否正确-
 * @param  {String} data
 * @param  {String} sign
 * @return {Boolean}
 */
function x5_is_correct_of_price_sign(data, sign) {
  var ret = false;
  var calc_sign = x5_sign_price_data(data);
  ret = sign === calc_sign;
  if (!ret) {
    console.error('x5_is_correct_of_price_sign failed, expect: ' + sign + '; calc: ' + calc_sign);
  }
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

// 生成批价响应数据，返回json格式
// 测试数据：
// data = "{\"msg\": \"success\", \"nonce\": \"NphsHyYDljzEVLn\", \"time\": 1430404481, \"ret\": 0, \"payamount\": 10}";
// 用此测试数据返回的结果为: 批价响应数据:{"rspsig": "eZR%2BhSmVn07Ysswa6GyMM%2FWjrI8%3D", "data": "pwSvgzN0vJieacYw7z8SBLP8INLmWY%2Bq2o74E0%2BBEAYi5OhHMq9Ndo5c1EEa9RBHpzjxGKRsbfIt10acMiT%2Bv7k1VoEukIaJPa1T49R0KN54oRW436bHJl%2BSsngqvSuC"}
exports.x5_price_response = function x5_price_response(obj) {
  var data = util.jsonToStr(obj);
  var encrytedData = util.x5_encrypt(data);
  var sign = x5_sign_price_data(encrytedData);

  var ret = {
    data: encrytedData,
    rspsig: sign
  };

  return ret;
};