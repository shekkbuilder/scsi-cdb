var assert = require('assert');
var CDB = require('../src/scsi-cdb');

describe('CDB', function() {
    describe('decode()', function() {

        it('should return truncated when passed an empty string', function() {
            var cdb = new CDB();
            var output = cdb.decode("");
            assert.deepEqual(output, { truncated: true });
        });

        it('should return a decoded Test Unit Ready message successfuly', function() {
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

        it('should decode the TUR successfully, with the correct values in the fields', function() {
            var cdb = new CDB();
            var output = cdb.decode("00 23 45 67 89 ab");
            assert.deepEqual(output, {
                name: "TEST UNIT READY",
                fields: [
                    { name: "OPERATION CODE", value: 0 },
                    { name: "Reserved", value: 0x23456789, reserved: true },
                    { name: "CONTROL", value: 0xab },
                ],
                truncated: false,
            });
        });
     });
});

