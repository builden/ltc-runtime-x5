var cfg = require('./lib/cfg.js');
var x5_getLoginInfo = require('./lib/get-login-info.js');
var price = require('./lib/get-price.js');
var pay = require('./lib/get-pay.js');

/*
// 腾讯为游戏分配的appid
var X5_APPID = '8601554899';
var X5_APP_KEY = 'FsVDCSD8t7fhkcfm'; // [cp身份秘钥], 用于签名
var X5_TRANSFER_KEY = 'a46Qx5Kn1ocaLQuS'; // [cp传输密钥], 用于加密解密传输的data数据
*/

exports.init = function (appid, appkey, transKey) {
  cfg.X5_APPID = appid;
  cfg.X5_APP_KEY = appkey;
  cfg.X5_TRANSFER_KEY = transKey;
};

exports.getLoginInfo = function () {
  return x5_getLoginInfo();
};

exports.decodePrice = function (query) {
  return price.x5_decodePrice(query);
};

exports.decodePay = function (query) {
  return pay.x5_decodePay(query);
};

exports.getPriceResponse = function (json) {
  return price.x5_price_response(json);
};

exports.getPayResponse = function (json) {
  return pay.x5_pay_response(json);
};