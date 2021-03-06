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

        it('decodes the top nibble of byte 1 and the bottom nibble of byte 2 correctly', function() {
            var cdb = new CDB();
            var output = cdb.getField(input, 8, 1, 4);
            assert.equal(output.toJSNumber(), 0x25);
        });

    });

    describe('decode()', function() {

        it('should return an empty decode when passed an empty string', function() {
            var cdb = new CDB();
            var output = cdb.decode("");
            assert.deepEqual(output, { 
                name: undefined,
                fields: [],
                truncated: false,
            });
        });


        it('should return a decoded Test Unit Ready message successfuly', function() {
            var cdb = new CDB();
            var output = cdb.decode("000000000000");
            assert.deepEqual(output, {
                name: "TEST UNIT READY",
                fields: [
                    { name: "OPERATION CODE", value: "0", reserved: false, obsolete: false },
                    { name: "Reserved", value: "0", reserved: true, obsolete: false },
                    { name: "CONTROL", value: "0", reserved: false, obsolete: false },
                ],
                truncated: false,
            });
        });

        it('should decode a READ (16) message successfully', function() {
            var cdb = new CDB();
            var output = cdb.decode("88000000000001234567000000080000");
            assert.deepEqual(output, {
                name: "READ (16)",
                fields: [
                    { name: "OPERATION CODE", value: "88", reserved: false, obsolete: false },
                    { name: "DLD2", value: "0", reserved: false, obsolete: false },
                    { name: "Obsolete", value: "0", reserved: false, obsolete: true },
                    { name: "RARC", value: "0", reserved: false, obsolete: false },
                    { name: "FUA", value: "0", reserved: false, obsolete: false },
                    { name: "DPO", value: "0", reserved: false, obsolete: false },
                    { name: "RDPROTECT", value: "0", reserved: false, obsolete: false },
                    { name: "LOGICAL BLOCK ADDRESS", value: "1234567", reserved: false, obsolete: false },
                    { name: "TRANSFER LENGTH", value: "8", reserved: false, obsolete: false },
                    { name: "GROUP NUMBER", value: "0", reserved: false, obsolete: false },
                    { name: "DLD0", value: "0", reserved: false, obsolete: false },
                    { name: "DLD1", value: "0", reserved: false, obsolete: false },
                    { name: "CONTROL", value: "0", reserved: false, obsolete: false },
                ],
                truncated: false,
            });
        });

        it('should partially decode a truncated VERIFY (16) message successfully', function() {
            var cdb = new CDB();
            var output = cdb.decode("8f00000000001234567800000007");
            assert.deepEqual(output, {
                name: "VERIFY (16)",
                fields: [
                    { name: "OPERATION CODE", value: "8f", reserved: false, obsolete: false },
                    { name: "Reserved", value: "0", reserved: true, obsolete: false },
                    { name: "BYTCHK", value: "0", reserved: false, obsolete: false },
                    { name: "Reserved", value: "0", reserved: true, obsolete: false },
                    { name: "DPO", value: "0", reserved: false, obsolete: false },
                    { name: "VRPROTECT", value: "0", reserved: false, obsolete: false },
                    { name: "LOGICAL BLOCK ADDRESS", value: "12345678", reserved: false, obsolete: false },
                    { name: "VERIFICATION LENGTH", value: "7", reserved: false, obsolete: false },
                ],
                truncated: true,
            });
        });

        it('should decode a WRITE (32) message successfully', function() {
            var cdb = new CDB();
            var output = cdb.decode("7f00000000000018000b20000000000000000200010203040506ffff00000008");
            assert.deepEqual(output, {
                name: "WRITE (32)",
                fields: [
                    { name: "OPERATION CODE", value: "7f", reserved: false, obsolete: false },
                    { name: "CONTROL", value: "0", reserved: false, obsolete: false },
                    { name: "Reserved", value: "0", reserved: true, obsolete: false },
                    { name: "GROUP NUMBER", value: "0", reserved: false, obsolete: false },
                    { name: "Reserved", value: "0", reserved: true, obsolete: false },
                    { name: "ADDITIONAL CDB LENGTH", value: "18", reserved: false, obsolete: false },
                    { name: "SERVICE ACTION", value: "b", reserved: false, obsolete: false },
                    { name: "Reserved", value: "0", reserved: true, obsolete: false },
                    { name: "Obsolete", value: "0", reserved: false, obsolete: true },
                    { name: "Reserved", value: "0", reserved: true, obsolete: false },
                    { name: "FUA", value: "0", reserved: false, obsolete: false },
                    { name: "DPO", value: "0", reserved: false, obsolete: false },
                    { name: "WRPROTECT", value: "1", reserved: false, obsolete: false },
                    { name: "Reserved", value: "0", reserved: true, obsolete: false },
                    { name: "LOGICAL BLOCK ADDRESS", value: "200", reserved: false, obsolete: false },
                    { name: "EXPECTED INITIAL LOGICAL BLOCK REFERENCE TAG", value: "1020304", reserved: false, obsolete: false },
                    { name: "EXPECTED LOGICAL BLOCK APPLICATION TAG", value: "506", reserved: false, obsolete: false },
                    { name: "LOGICAL BLOCK APPLICATION TAG MASK", value: "ffff", reserved: false, obsolete: false },
                    { name: "TRANSFER LENGTH", value: "8", reserved: false, obsolete: false },
                ],
                truncated: false,
            });
        });
    });
});
