var assert = require('assert');
var CDB = require('../cdb');

describe('CDB', function() {
    describe('decode()', function() {
        it('should return truncated when passed an empty string', function() {
            var cdb = new CDB();
            var output = cdb.decode("");
            assert.deepEqual(output, { truncated: true });
        });
        it('should return decode a Test Unit Ready message successfuly', function() {
            var cdb = new CDB();
            var output = cdb.decode("00 00 00 00 00 00");
            assert.deepEqual(output, {
                name: "TEST UNIT READY",
                fields: [
                    { name: "OPERATION CODE", value: 0 },
                    { name: "Reserved", value: 0, reserved: true },
                    { name: "CONTROL", value: 0 },
                ],
                truncated: false,
            });
        });
        it('should return a partial Test Unit Ready message indicating message truncated', function() {
            var cdb = new CDB();
            var output = cdb.decode("00 00 00 00 00");
            assert.deepEqual(output, {
                name: "TEST UNIT READY",
                fields: [
                    { name: "OPERATION CODE", value: 0 },
                    { name: "Reserved", value: 0, reserved: true },
                ],
                truncated: true,
            });
        });
    });
});

