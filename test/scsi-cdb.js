var assert = require('assert');
var CDB = require('../src/scsi-cdb');

describe('CDB', function() {

    describe('getField()', function() {

        var input = [ 0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef ];

        it('returns bigInt(1) when decoding byte 0 of input', function() {
            var cdb = new CDB();
            var output = cdb.getField(input, 8, 0, 0);
            assert.equal(output.toJSNumber(), 1);
        });

        it('returns bigInt(0x23) when decoding byte 1 of input', function() {
            var cdb = new CDB();
            var output = cdb.getField(input, 8, 1, 0);
            assert.equal(output.toJSNumber(), 0x23);
        });

        it('returns bigInt(0x0123) when decoding bytes 0,1 of input', function() {
            var cdb = new CDB();
            var output = cdb.getField(input, 16, 0, 0);
            assert.equal(output.toJSNumber(), 0x0123);
        });

        it('returns bigInt(0x01235) when decoding bytes the first 20 bits of input', function() {
            var cdb = new CDB();
            var output = cdb.getField(input, 20, 0, 0);
            assert.equal(output.toJSNumber(), 0x01235);
        });

        it('returns bigInt(0x0123456789abcdef) when decoding bytes the first 64 bits of input', function() {
            var cdb = new CDB();
            var output = cdb.getField(input, 64, 0, 0);
            assert.equal(output.toString(16), "123456789abcdef");
        });

        it('throws an exception if attempting to decode beyond the length of the array', function() {
            var cdb = new CDB();
            assert.throws(function() {
                var output = cdb.getField(input, 65, 0, 0);
            }, /Input truncated/);



        });
    });

    describe('decode()', function() {

/*
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
        */
     });
});
