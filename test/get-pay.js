var expect = require('chai').expect;
var pay = require('../lib/get-pay.js');
var cfg = require('../lib/cfg.js');
var _ = require('lodash');

describe('get-pay', function () {
  before(function () {
    cfg.init('8601554899', 'FsVDCSD8t7fhkcfm', 'a46Qx5Kn1ocaLQuS');
  });

  it('decode', function () {
    var query = {
      data: '0ENfYgI10msSYU6yGpFz2KfnFd7qJn0XBZ6NlXupNw0xo2wknNW3L6n6P8B+F7TihfwNeG5kmKv8wgPIS2jr/VtCC1zxI7VEGqlGm2VpYffFd2F7RJMEWYpjVvMTomu9bP4P8egcsaDopMLSMhAwByNS9Cnmntv72vxC4ZqVlJV0KsKdWrk+JpUHALCe5CwocDdDe4hgnjdcSNQKAJVmRPuiz5OeBdtOH01oFZIN3XDsOzqGD0iKLGUUjhWtKXc3vh/DQVkMa/jxJNhPFkPlZhHTaiCEZIXI8LhtmoX7h2CNHBODRBLeikRxkzxzuOsOf9YKGccJMHaIeO0r7aDE7mDD0+/Ro8mHZk2EWHYlo0KnfLeUTv8gZdLEVsdVdzGC',
      reqsig: 'QciugjfxA3HS+TohrGA6RYMBS2U='
    };
    var args = pay.x5_decodePay(query);
    var exp = {
      payamount: '80',
      paycentamount: '0',
      orderno: '497564994259709271729',
      payinfo: '战斗复活',
      payitem: 'REBORN_4*1*8.0',
      qbopenid: 'VkqCaP7P6a_Qpy-B9oUGPd5ekSD776ZP5Dy5zoqkf4iefz_aDigErQ',
      custommeta: 'REBORN_4_VkqCaP7P6a_Qpy-B9oUGPd5ekSD776ZP5Dy5zoqkf4iefz_aDigErQ',
      time: '1442972316',
      nonce: '1442972316366'
    };
    expect(_.isEqual(args, exp)).to.be.ok;
  });
});