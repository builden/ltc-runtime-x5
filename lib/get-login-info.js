var cfg = require('./cfg.js');
var util = require('./util.js');
var moment = require('moment');

// 获取游戏登陆信息
module.exports = function x5_getLoginInfo() {
  var time = Math.floor(moment().valueOf() / 1000);
  var nonce = util.getRandomString(15);
  var encrypted_data = util.x5_encrypt(cfg.X5_APPID + '_' + time + '_' + nonce);
  var ret = {
    appid: cfg.X5_APPID,
    appsigdata: encrypted_data,
    appsig: util.x5_sign_appsigdata(encrypted_data)
  };
  return ret;
};