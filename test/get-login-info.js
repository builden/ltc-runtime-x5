var expect = require('chai').expect;
var x5_getLoginInfo = require('../lib/get-login-info.js');
var cfg = require('../lib/cfg.js');

describe('x5_getLoginInfo', function() {
  before(function() {
    cfg.init('8601554899', 'FsVDCSD8t7fhkcfm', 'a46Qx5Kn1ocaLQuS');
  });

  it('test', function() {
    expect(x5_getLoginInfo().appid).to.equal('8601554899');
  });
});