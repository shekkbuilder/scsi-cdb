var assert = require('assert');
var CDB = require('../cdb');

describe('CDB', function() {
    describe('decode()', function() {
        it('decode should work', function() {
            var cdb = new CDB();
            var output = cdb.decode("");
            assert.deepEqual(output, { truncated: true });
        });
    });
});

