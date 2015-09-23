module.exports = {
  X5_APPID: null,
  X5_APP_KEY: null,
  X5_TRANSFER_KEY: null,

  init: function(appid, appkey, transkey) {
    this.X5_APPID = appid;
    this.X5_APP_KEY = appkey;
    this.X5_TRANSFER_KEY = transkey;
  }
};