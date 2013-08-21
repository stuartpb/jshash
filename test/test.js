/*global describe it*/

var fs = require("fs");
var vm = require("vm");
var assert = require("assert");
var crypto = require("crypto");

var all_algs = ['md5', 'sha1', 'ripemd160', 'sha256', 'sha512'];
var test_strings = ['hello', 'world', 'fred\u1234',
  'this is a longer test message to confirm that multiple blocks are handled correctly by the hashing algorithm'];
    
all_algs.forEach(function(alg) {
	var falg = alg == 'ripemd160' ? 'rmd160' : alg;
  describe(alg, function() {
    test_strings.forEach(function(t) {
      var path = './src/'+alg+'.js';
      var ctx = vm.createContext();
      vm.runInContext(fs.readFileSync(path, 'utf-8'),ctx,path);
      it("should match hash for "+JSON.stringify(t),function(){
        assert.equal(
          vm.runInContext('hex_'+falg+'('+JSON.stringify(t)+')',ctx),
          crypto.createHash(alg).update(t,'utf8').digest('hex'));
      });
      it("should match HMAC for "+JSON.stringify(t),function(){
        assert.equal(
          vm.runInContext('hex_hmac_'+falg+'("key",'+JSON.stringify(t)+')',ctx),
          crypto.createHmac(alg,"key").update(t,'utf8').digest('hex'));
      });
    });
  });
});