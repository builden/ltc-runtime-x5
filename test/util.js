var expect = require('chai').expect;
var util = require('../lib/util.js');

describe('util', function() {
  it('getRandomString', function() {
    var str = util.getRandomString(16);
    expect(str.length).to.equal(16);
  });
});