var _ = require('lodash');
var crypto = require('crypto');
var s = require('underscore.string');
var cfg = require('./cfg.js');

var BLOCK_SIZE = 16;
var PADDING = 0x00;

exports.getRandomString = function getRandomString(len) {
  var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var maxStrIdx = 61; // str.length (62 - 1)
  var rst = '';
  for (var i = 0; i < len; i++) {
    rst += str[_.random(0, maxStrIdx)];
  }
  return rst;
};

var pad = function pad(buf) {
  var srcLen = buf.length;
  var rst = new Buffer(srcLen + (BLOCK_SIZE - srcLen % BLOCK_SIZE));
  rst.fill(PADDING, srcLen);
  buf.copy(rst);
  return rst;
};

/**
 * AES加密
 * @param {Buffer} data
 * @return {Buffer}
 */
var AESEncrypt = exports.AESEncrypt = function AESEncrypt(data) {
  var cipher = crypto.createCipheriv('aes-128-ecb', cfg.X5_TRANSFER_KEY, '');
  cipher.setAutoPadding(false);
  var ret = cipher.update(pad(data), 'utf8', 'hex') + cipher.final('hex');
  ret = new Buffer(ret, 'hex');
  return ret;
};

/**
 * AES解密
 * @param {Buffer} data
 * @return {Buffer}
 */
var AESDecrypt = exports.AESDecrypt = function AESDecrypt(data) {
  var cipher = crypto.createDecipheriv('aes-128-ecb', toKey(cfg.X5_TRANSFER_KEY), '');
  cipher.setAutoPadding(false);
  return cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
};

// string to buffer
function toKey(password) {
  return new Buffer(password);
}

// url编码
// RFC 3986 section 2.3
// unreserved = ALPHA / DIGIT / "-" / "." / "_" / "~"
var x5_quote = exports.x5_quote = function x5_quote(url) {
  var ret = encodeURIComponent(url);
  ret = s.replaceAll(ret, '!', '%21');
  ret = s.replaceAll(ret, '\'', '%27');
  ret = s.replaceAll(ret, '\\(', '%28');
  ret = s.replaceAll(ret, '\\)', '%29');
  ret = s.replaceAll(ret, '\\*', '%2A');
  return ret;
};

// url解码
var x5_unquote = exports.x5_unquote = function x5_unquote(url) {
  var ret = decodeURIComponent(url);
  return ret;
}

/**
 * base64字符串转buffer
 * @param  {String} base64 字符串
 * @return {Buffer}
 */
function base64Decode(base64) {
  return new Buffer(base64, 'base64');
}

/**
 * buffer转成base64字符串
 * @param  {Buffer} bytes
 * @return {String}     base64字符串
 */
function base64Encode(bytes) {
  return bytes.toString('base64');
}

function parseByte2HexStr(b) {
  return b.toString('hex');
}

function parseHexStr2Byte(strhex) {
  return new Buffer(strhex, 'hex');
}

/**
 * 加密数据，用于发送响应给腾讯后台
 * @param  {String} data [description]
 * @return {String}      [description]
 */
exports.x5_encrypt = function x5_encrypt(data) {
  var encrypted = AESEncrypt(new Buffer(data));
  var base64 = base64Encode(encrypted);
  var encoded = x5_quote(base64);
  return encoded;
}

// 解密数据，用于解析腾讯后台发来的参数
exports.x5_decrypt = function x5_decrypt(data) {
  var decoded = x5_unquote(data);
  var binary = base64Decode(decoded);
  var originData = AESDecrypt(binary).toString();
  return originData;
}

/**
 * [x5_hmac_base64 description]
 * @param  {Buffer} bytes
 * @return {String}
 */
var x5_hmac_base64 = exports.x5_hmac_base64 = function x5_hmac_base64(bytes) {
  var key = cfg.X5_APP_KEY + '&';
  return crypto.createHmac('sha1', key).update(bytes).digest().toString('base64');
}

// 添加腾讯要求的前缀字段后，做URL编码
exports.x5_encode_url = function x5_encode_url(prefix, data) {
  var request_mode = prefix[0];
  var request_path = prefix[1];
  var request_arg = null;
  if (prefix[2].length > 0) {
    request_arg = prefix[2] + "&data=" + data;
  } else {
    request_arg = "data=" + data;
  }
  var ret = x5_quote(request_mode) + "&" + x5_quote(request_path) + "&" + x5_quote(request_arg);
  return ret;
}

exports.jsonToStr = function jsonToStr(obj) {
  var ret = s.replaceAll(JSON.stringify(obj), ':', ': ');
  ret = s.replaceAll(ret, ',', ', ');
  return ret;
};

/**
 * [x5_sign_appsigdata description]
 * @param  {String} data
 * @return {String}
 */
exports.x5_sign_appsigdata = function x5_sign_appsigdata(data) {
  // log('x5_sign_appsigdata: ' + data);
  data = x5_hmac_base64(new Buffer(data));
  data = x5_quote(data);
  return data;
};