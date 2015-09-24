var cfg = require('./lib/cfg.js');
var x5_getLoginInfo = require('./lib/get-login-info.js');
var price = require('./lib/get-price.js');
var pay = require('./lib/get-pay.js');
var util = require('./lib/util.js');

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

exports.getRandomString = function() {
  return util.getRandomString();
};