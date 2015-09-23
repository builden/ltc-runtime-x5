var expect = require('chai').expect;
var price = require('../lib/get-price.js');
var cfg = require('../lib/cfg.js');
var _ = require('lodash');

describe('get-pay', function () {
  before(function () {
    cfg.init('8601554899', 'FsVDCSD8t7fhkcfm', 'a46Qx5Kn1ocaLQuS');
  });

  it('decode', function () {
    var query = {
      data: 'FEFgRp5Sp4cO0s9B/+wBqvFKoRKiMz+hJ8C3JiVcJ63z++Q0hZRNqi/9TxM780DM797LWdtKfJ3HlevI5pVfdOjWiG4sIcK9BlRLqtG0cjdz8QuT/99g0zyvRKxbTSE10V0IlckPcHz3j74MM7B3fZIi5XLH5aGLI69oGCd0W6ojUvQp5p7b+9r8QuGalZSVlwtkGi7/ZG0JFyN5nQYuUXcSLhkrGn2n6FVFbPi+D4EM+76GzuAOdl8FFsimFtxtu5Ng+APH3cKfv2s/hEQKLSTfdDtpInPwCkko5GfZses=',
      reqsig: 'IOSU5pov1ofVw3rYb6xejR6NPCI='
    };
    var args = price.x5_decodePrice(query);
    var exp = {
      payinfo: '战斗复活',
      payitem: 'REBORN_1*1*1.0',
      qbopenid: 'VkqCaP7P6a_Qpy-B9oUGPXPlfu0WAt0jSrvIc5DnkkSi2XNdQxZR8A',
      custommeta: 'REBORN_1_VkqCaP7P6a_Qpy-B9oUGPXPlfu0WAt0jSrvIc5DnkkSi2XNdQxZR8A',
      time: '1442973624',
      nonce: '1442973624369'
    };
    expect(_.isEqual(args, exp)).to.be.ok;
  });
});