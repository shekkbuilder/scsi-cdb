//
// CDB.js
//
// Provides functionality to decode a SCSI CDB.
//

"use strict";

var parseCompareAndWrite = function(encodedCdb) {
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "WRPROTECT", value: ((encodedCdb[1] >> 5) & 0x07) });
  fields.push({ name: "DPO", value: ((encodedCdb[1] >> 4) & 0x01) });
  fields.push({ name: "FUA", value: ((encodedCdb[1] >> 3) & 0x01) });
  fields.push({ name: "Reserved", value: ((encodedCdb[1] >> 2) & 0x01), reserved: true });
  fields.push({ name: "FUA_NV", value: ((encodedCdb[1] >> 1) & 0x01) });
  fields.push({ name: "Reserved", value: (encodedCdb[1] & 0x01), reserved: true });
  // Byte 2 - 9
  var logicalBlockAddressHi = encodedCdb[2] << 24 |
                              encodedCdb[3] << 16 |
                              encodedCdb[4] << 8 |
                              encodedCdb[5];
  var logicalBlockAddressHi = encodedCdb[2] << 24 |
                              encodedCdb[3] << 16 |
                              encodedCdb[4] << 8 |
                              encodedCdb[5];
  fields.push({ name: "LOGICAL BLOCK ADDRESS", value: [ logicalBlockAddressHi, logicalBlockAddressLo ] });
  // Byte 10 - 12
  var reserved1 = encodedCdb[10] << 16 | encodedCdb[11] << 8 | encodedCdb[12];
  fields.push({ name: "Reserved", value: reserved1, reserved: true });
  // Byte 13
  fields.push({ name: "NUMBER OF LOGICAL BLOCKS", value: encodedCdb[13] });
  // Byte 14
  fields.push({ name: "Reserved", value: ((encodedCdb[14] >> 5) & 0x07), reserved: true });
  fields.push({ name: "GROUP NUMBER", value: (encodedCDb[14] & 0x1f) });
  // Byte 15
  fields.push({ name: "CONTROL", value: encodedCdb[15] });
  return fields;
};

var parseFormatUnit = function(encodedCdb) {
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "FMTPINFO", value: ((encodedCdb[1] >> 6) & 0x03) });
  fields.push({ name: "LONGLIST", value: ((encodedCdb[1] >> 5) & 0x01) });
  fields.push({ name: "FMTDATA", value: ((encodedCdb[1] >> 4) & 0x01) });
  fields.push({ name: "CMPLIST", value: ((encodedCdb[1] >> 3) & 0x01) });
  fields.push({ name: "DEFECT LIST FORMAT", value: (encodedCdb[1] & 0x07) });
  // Byte 2
  fields.push({ name: "Vendor specific", value: encodedCdb[2] });
  // Byte 3 - 4
  var obsolete = encodedCdb[3] << 8 | encodedCdb[4];
  fields.push({ name: "Obsolete", value: obsolete, obsolete: true });
  // Byte 5
  fields.push({ name: "CONTROL", value: encodedCdb[5] });
  return fields;
};

var parseGetLbaStatus = function(encodedCdb) {
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "Reserved", value: ((encodedCdb[1] >> 5) & 0x07), reserved: true });
  fields.push({ name: "SERVICE ACTION", value: (encodedCdb[1] & 0x1f) });
  // Byte 2 - 9
  var logicalBlockAddressHi = encodedCdb[2] << 24 |
                              encodedCdb[3] << 16 |
                              encodedCdb[4] << 8 |
                              encodedCdb[5];
  var logicalBlockAddressLo = encodedCdb[6] << 24 |
                              encodedCdb[7] << 16 |
                              encodedCdb[8] << 8 |
                              encodedCdb[9];
  fields.push({ name: "STARTING LOGICAL BLOCK ADDRESS", value: [ logicalBlockAddressHi, logicalBlockAddressLo ] });
  // Byte 10 - 13
  var allocationLength = encodedCdb[10] << 24 |
                         encodedCdb[11] << 16 |
                         encodedCdb[12] << 8 |
                         encodedCdb[13];
  fields.push({ name: "ALLOCATION LENGTH", value: allocationLength });
  // Byte 14
  fields.push({ name: "Reserved", value: encodedCdb[14], reserved: true });
  // Byte 15
  fields.push({ name: "CONTROL", value: encodedCdb[15] });
  return fields;
}

var parseOrwrite16 = function(encodedCdb) {
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "ORPROTECT", value: ((encodedCdb[1] >> 5) & 0x07) });
  fields.push({ name: "DPO", value: ((encodedCdb[1] >> 4) & 0x01) });
  fields.push({ name: "FUA", value: ((encodedCdb[1] >> 3) & 0x01) });
  fields.push({ name: "Reserved", value: ((encodedCdb[1] >> 2) & 0x01), reserved: true });
  fields.push({ name: "FUA_NV", value: ((encodedCdb[1] >> 1) & 0x01) });
  fields.push({ name: "Reserved", value: (encodedCdb[1] & 0x01), reserved: true });
  // Byte 2 - 9
  var logicalBlockAddressHi = encodedCdb[2] << 24 |
                              encodedCdb[3] << 16 |
                              encodedCdb[4] << 8 |
                              encodedCdb[5];
  var logicalBlockAddressLo = encodedCdb[6] << 24 |
                              encodedCdb[7] << 16 |
                              encodedCdb[8] << 8 |
                              encodedCdb[9];
  fields.push({ name: "STARTING LOGICAL BLOCK ADDRESS", value: [ logicalBlockAddressHi, logicalBlockAddressLo ] });
  // Byte 10 - 13
  var transferLength = encodedCdb[2] << 24 |
                       encodedCdb[3] << 16 |
                       encodedCdb[4] << 8 |
                       encodedCdb[5];
  fields.push({ name: "TRANSFER LENGTH", value: transferLength });
  // Byte 14
  fields.push({ name: "Reserved", value: ((encodedCdb[14] >> 5) & 0x07), reserved: true });
  fields.push({ name: "GROUP NUMBER", value: (encodedCDb[14] & 0x1f) });
  // Byte 15
  fields.push({ name: "CONTROL", value: encodedCdb[15] });
  return fields;
}

var parseOrwrite32 = function(encodedCdb) {
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "CONTROL", value: encodedCdb[1] });
  // Byte 2
  fields.push({ name: "Reserved", value: ((encodedCdb[2] >> 3) & 0x1f), reserved: true });
  fields.push({ name: "BMOP", value: (encodedCdb[2] & 0x07) });
  //Byte 3
  fields.push({ name: "Reserved", value: ((encodedCdb[3] >> 4) & 0x0f), reserved: true });
  fields.push({ name: "PREVIOUS GENERATION PROCESSING", value: (encodedCdb[3] & 0x0f) });
  // Byte 4 - 5
  fields.push({ name: "Reserved", value: (encodedCdb[4] << 8) | encodedCdb[5], reserved: true });
  // Byte 6
  fields.push({ name: "Reserved", value: ((encodedCdb[6] >> 5) & 0x07), reserved: true });
  fields.push({ name: "GROUP NUMBER", value: (encodedCDb[6] & 0x1f) });
  // Byte 7
  fields.push({ name: "ADDITIONAL CDB LENGTH", value: encodedCdb[7] });
  // Byte 8 - 9
  var serviceAction = encodedCdb[8] << 8 | encodedCdb[9];
  fields.push({ name: "SERVICE ACTION", value: serviceAction });
  // Byte 10
  fields.push({ name: "ORPROTECT", value: ((encodedCdb[10] >> 5) & 0x07) });
  fields.push({ name: "DPO", value: ((encodedCdb[10] >> 4) & 0x01) });
  fields.push({ name: "FUA", value: ((encodedCdb[10] >> 3) & 0x01) });
  fields.push({ name: "Reserved", value: ((encodedCdb[10] >> 2) & 0x01), reserved: true });
  fields.push({ name: "FUA_NV", value: ((encodedCdb[10] >> 1) & 0x01) });
  fields.push({ name: "Reserved", value: (encodedCdb[10] & 0x01), reserved: true });
  // Byte 11
  fields.push({ name: "Reserved", value: encodedCdb[11] });
  // Byte 12 - 19
  var logicalBlockAddressHi = encodedCdb[12] << 24 |
                              encodedCdb[13] << 16 |
                              encodedCdb[14] << 8 |
                              encodedCdb[15];
  var logicalBlockAddressLo = encodedCdb[16] << 24 |
                              encodedCdb[17] << 16 |
                              encodedCdb[18] << 8 |
                              encodedCdb[19];
  fields.push({ name: "LOGICAL BLOCK ADDRESS", value: [ logicalBlockAddressHi, logicalBlockAddressLo ] });
  // Byte 20 - 23
  var expectedOrwGeneration = encodedCdb[20] << 24 |
                              encodedCdb[21] << 16 |
                              encodedCdb[22] << 8 |
                              encodedCdb[23];
  fields.push({ name: "EXPECTED ORWGENERATION", value: expectedOrwGeneration });
  // Byte 24 - 27
  var newOrwGeneration = encodedCdb[24] << 24 |
                         encodedCdb[25] << 16 |
                         encodedCdb[26] << 8 |
                         encodedCdb[27];
  fields.push({ name: "NEW ORWGENERATION", value: newOrwGeneration });
  //Byte 28 - 31
  var transferLength = encodedCdb[28] << 24 |
                       encodedCdb[29] << 16 |
                       encodedCdb[30] << 8 |
                       encodedCdb[31];
  fields.push({ name: "TRANSFER LENGTH", value: transferLength });
  return fields;
}

var parsePopulateToken = function(encodedCdb) {
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "Reserved", value: ((encodedCdb[1] >> 5) & 0x07), reserved: true });
  fields.push({ name: "SERVICE ACTION", value: (encodedCdb[1] & 0x1f) });
  // Byte 2 - 5
  var reserved1 = encodedCdb[2] << 24 |
                  encodedCdb[3] << 16 |
                  encodedCdb[4] << 8 |
                  encodedCdb[5];
  fields.push({ name: "Reserved", value: reserved1, reserved: true });
  // Byte 6 - 9
  var listIdentifier = encodedCdb[6] << 24 |
                       encodedCdb[7] << 16 |
                       encodedCdb[8] << 8 |
                       encodedCdb[9];
  fields.push({ name: "LIST IDENTIFIER", value: listIdentified });
  // Byte 10 - 13
  var parameterListLength = encodedCdb[10] << 24 |
                            encodedCdb[11] << 16 |
                            encodedCdb[12] << 8 |
                            encodedCdb[13];
  fields.push({ name: "PARAMETER LIST LENGTH", value: parameterListLength });
  // Byte 14
  fields.push({ name: "Reserved", value: ((encodedCdb[14] >> 5) & 0x07), reserved: true });
  fields.push({ name: "GROUP NUMBER", value: (encodedCdb[14] & 0x1f) });
  // Byte 15
  fields.push({ name: "CONTROL", value: encodedCdb[15] });
  return fields;
}

var parsePreFetch10 = function(encodedCdb) {
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "Reserved", value: ((encodedCdb[1] >> 2) & 0x3f), reserved: true });
  fields.push({ name: "IMMED", value: ((encodedCdb[1] >> 1) & 0x01) });
  fields.push({ name: "Obsolete", value: (encodedCdb[1] & 0x01), obsolete: true });
  // Byte 2 - 5
  var logicalBlockAddress = encodedCdb[2] << 24 |
                            encodedCdb[3] << 16 |
                            encodedCdb[4] << 8 |
                            encodedCdb[5];
  fields.push({ name: "LOGICAL BLOCK ADDRESS", value: logicalBlockAddress });
  // Byte 6
  fields.push({ name: "Reserved", value: ((encodedCdb[6] >> 5) & 0x07), reserved: true });
  fields.push({ name: "GROUP NUMBER", value: (encodedCdb[6] & 0x1f) });
  // Byte 7 - 8
  fields.push({ name: "PREFETCH LENGTH", value: (encodedCdb[7] << 8) | encodedCdb[8] });
  // Byte 9
  fields.push({ name: "CONTROL", value: encodedCdb[9] });
  return fields;
}

var parsePreFetch16 = function(encodedCdb) {
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "Reserved", value: ((encodedCdb[1] >> 2) & 0x3f), reserved: true });
  fields.push({ name: "IMMED", value: ((encodedCdb[1] >> 1) & 0x01) });
  fields.push({ name: "Obsolete", value: (encodedCdb[1] & 0x01), obsolete: true });
  // Byte 2 - 9
  var logicalBlockAddressHi = encodedCdb[2] << 24 |
                              encodedCdb[3] << 16 |
                              encodedCdb[4] << 8 |
                              encodedCdb[5];
  var logicalBlockAddressLo = encodedCdb[6] << 24 |
                              encodedCdb[7] << 16 |
                              encodedCdb[8] << 8 |
                              encodedCdb[9];
  fields.push({ name: "LOGICAL BLOCK ADDRESS", value: [ logicalBlockAddressHi, logicalBlockAddressLo ] });
  // Byte 10 - 13
  var prefetchLength = encodedCdb[10] << 24 |
                      encodedCdb[11] << 16 |
                      encodedCdb[12] << 8 |
                      encodedCdb[13];
  fields.push({ name: "PREFETCH LENGTH", value: prefetchLength });
  // Byte 14
  fields.push({ name: "Reserved", value: (encodedCdb[14] >> 5) & 0x07, reserved: true });
  fields.push({ name: "GROUP NUMBER", value: (encodedCdb[14] & 0x1f) });
  // Byte 15
  fields.push({ name: "CONTROL", value: encodedCdb[15] });
  return fields;
}

var parsePreventAllowMediumRemoval = function(encodedCdb) {
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "Reserved", value: encodedCdb[1], reserved: true });
  // Byte 2
  fields.push({ name: "Reserved", value: encodedCdb[2], reserved: true });
  // Byte 3
  fields.push({ name: "Reserved", value: encodedCdb[3], reserved: true });
  // Byte 4
  fields.push({ name: "Reserved", value: (encodedCdb[4] >> 2) & 0x3f, reserved: true });
  fields.push({ name: "PREVENT", value: (encodedCdb[4] & 0x03) });
  //Byte 5
  fields.push({ name: "CONTROL", value: encodedCdb[5] });
  return fields;
}

var parseRead10 = function(encodedCdb) {
  var fields = [];
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  fields.push({ name: "RDPROTECT", value: ((encodedCdb[1] >> 5) & 0x07) });
  fields.push({ name: "DPO", value: ((encodedCdb[1] >> 4) & 0x01) });
  fields.push({ name: "FUA", value: ((encodedCdb[1] >> 3) & 0x01) });
  fields.push({ name: "RARC", value: ((encodedCdb[1] >> 2) & 0x01) });
  fields.push({ name: "FUA_NV", value: ((encodedCdb[1] >> 1) & 0x01) });
  fields.push({ name: "Obsolete", value: (encodedCdb[1] & 0x01), obsolete: true });
  var logicalBlockAddress = encodedCdb[2] << 24 |
                            encodedCdb[3] << 16 |
                            encodedCdb[4] << 8 |
                            encodedCdb[5];
  fields.push({ name: "LOGICAL BLOCK ADDRESS", value: logicalBlockAddress });
  fields.push({ name: "Reserved", value: ((encodedCdb[6] >> 5) & 0x07), reserved: true });
  fields.push({ name: "GROUP NUMBER", value: (encodedCdb[6] & 0x1f) });
  var transferLength = encodedCdb[7] << 8 |
                       encodedCdb[8];
  fields.push({ name: "TRANSFER LENGTH", value: transferLength });
  fields.push({ name: "CONTROL", value: ((encodedCdb[8])) });
  return fields;
};

var parseRead12 = function(encodedCdb) {
  var fields = [];
  fields.push({ name: "Operation Code", value: encodedCdb[0] });
  fields.push({ name: "RDPROTECT", value: ((encodedCdb[1] >> 5) & 0x07) });
  fields.push({ name: "DPO", value: ((encodedCdb[1] >> 4) & 0x01) });
  fields.push({ name: "FUA", value: ((encodedCdb[1] >> 3) & 0x01) });
  fields.push({ name: "RARC", value: ((encodedCdb[1] >> 2) & 0x01) });
  fields.push({ name: "FUA_NV", value: ((encodedCdb[1] >> 1) & 0x01) });
  fields.push({ name: "Obsolete", value: (encodedCdb[1] & 0x01), obsolete: true });
  var logicalBlockAddress = encodedCdb[2] << 24 |
                            encodedCdb[3] << 16 |
                            encodedCdb[4] << 8 |
                            encodedCdb[5];
  fields.push({ name: "LOGICAL BLOCK ADDRESS", value: logicalBlockAddress });
  var transferLength = encodedCdb[6] << 24 |
                       encodedCdb[7] << 16 |
                       encodedCdb[8] << 8 |
                       encodedCdb[9];
  fields.push({ name: "TRANSFER LENGTH", value: transferLength });
  fields.push({ name: "Restricted for MMC-6", value: ((encodedCdb[10] >> 7) & 0x01) });
  fields.push({ name: "Reserved", value: ((encodedCdb[10] >> 5) & 0x03), reserved: true });
  fields.push({ name: "GROUP NUMBER", value: (encodedCdb[10] & 0x1f) });
  fields.push({ name: "CONTROL", value: encodedCdb[11] });
  return fields;
};

var parseRead16 = function(encodedCdb) {
  var fields = [];
  fields.push({ name: "Operation Code", value: encodedCdb[0] });
  fields.push({ name: "RDPROTECT", value: ((encodedCdb[1] >> 5) & 0x07) });
  fields.push({ name: "DPO", value: ((encodedCdb[1] >> 4) & 0x01) });
  fields.push({ name: "FUA", value: ((encodedCdb[1] >> 3) & 0x01) });
  fields.push({ name: "RARC", value: ((encodedCdb[1] >> 2) & 0x01) });
  fields.push({ name: "FUA_NV", value: ((encodedCdb[1] >> 1) & 0x01) });
  fields.push({ name: "Obsolete", value: (encodedCdb[1] & 0x01), obsolete: true });
  var logicalBlockAddressHi = encodedCdb[2] << 24 |
                              encodedCdb[3] << 16 |
                              encodedCdb[4] << 8 |
                              encodedCdb[5];
  var logicalBlockAddressLo = encodedCdb[6] << 24 |
                              encodedCdb[7] << 16 |
                              encodedCdb[8] << 8 |
                              encodedCdb[9];
  fields.push({ name: "LOGICAL BLOCK ADDRESS", value: [ logicalBlockAddressHi, logicalBlockAddressLo ] });
  var transferLength = encodedCdb[10] << 24 |
                       encodedCdb[11] << 16 |
                       encodedCdb[12] << 8 |
                       encodedCdb[13];
  fields.push({ name: "TRANSFER LENGTH", value: transferLength });
  fields.push({ name: "Restricted for MMC-6", value: ((encodedCdb[14] >> 7) & 0x01) });
  fields.push({ name: "Reserved", value: ((encodedCdb[14] >> 5) & 0x03), reserved: true });
  fields.push({ name: "GROUP NUMBER", value: (encodedCdb[14] & 0x1f) });
  fields.push({ name: "CONTROL", value: encodedCdb[15] });
  return fields;
};

var parseRead32 = function(encodedCdb) {
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "CONTROL", value: encodedCdb[1] });
  // Byte 2 - 5
  var reserved1 = encodedCdb[2] << 24 |
                  encodedCdb[3] << 16 |
                  encodedCdb[4] << 8 |
                  encodedCdb[5];
  fields.push({ name: "Reserved", value: reserved1, reserved: true });
  // Byte 6
  fields.push({ name: "Reserved", value: ((encodedCdb[6] >> 5) & 0x07), reserved: true });
  fields.push({ name: "GROUP NUMBER", value: (encodedCdb[6] & 0x1f) });
  // Byte 7
  fields.push({ name: "ADDITIONAL CDB LENGTH", value: encodedCdb[7] });
  // Byte 8 - 9
  var serviceAction = encodedCdb[8] << 8 | encodedCdb[9];
  fields.push({ name: "SERVICE ACTION", value: serviceAction });
  // Byte 10
  fields.push({ name: "RDPROTECT", value: ((encodedCdb[10] >> 5) & 0x07) });
  fields.push({ name: "DPO", value: ((encodedCdb[10] >> 4) & 0x01) });
  fields.push({ name: "FUA", value: ((encodedCdb[10] >> 3) & 0x01) });
  fields.push({ name: "RARC", value: ((encodedCdb[10] >> 2) & 0x01) });
  fields.push({ name: "FUA_NV", value: ((encodedCdb[10] >> 1) & 0x01) });
  fields.push({ name: "Reserved", value: (encodedCdb[10] & 0x01), reserved: true });
  // Byte 11
  fields.push({ name: "Reserved", value: (encodedCdb[11]), reserved: true });
  // Byte 12 - 19
  var logicalBlockAddressHi = encodedCdb[12] << 24 |
                              encodedCdb[13] << 16 |
                              encodedCdb[14] << 8 |
                              encodedCdb[15];
  var logicalBlockAddressLo = encodedCdb[16] << 24 |
                              encodedCdb[17] << 16 |
                              encodedCdb[18] << 8 |
                              encodedCdb[19];
  fields.push({ name: "LOGICAL BLOCK ADDRESS", value: [ logicalBlockAddressHi, logicalBlockAddressLo ] });
  // Byte 20 - 23
  var expectedInitialLogicalBlockReferenceTag = encodedCdb[20] << 24 |
                                                encodedCdb[21] << 16 |
                                                encodedCdb[22] << 8 |
                                                encodedCdb[23];
  fields.push({ name: "EXPECTED INITIAL LOGICAL BLOCK REFERENCE TAG", value: expectedInitialLogicalBlockReferenceTag });
  // Byte 24 - 25
  var expectedLogicalBlockApplicationTag = encodedCdb[24] << 8 | encodedCdb[25];
  fields.push({ name: "EXPECTED LOGICAL BLOCK APPLICATION TAG", value: expectedLogicalBlockApplicationTag });
  // Byte 26 - 27
  var logicalBlockApplicationTagMask = encodedCdb[27] << 8 | encodedCdb[28];
  fields.push({ name: "LOGICAL BLOCK APPLICATION TAG MASK", value: logicalBlockApplicationTagMask });
  //Byte 28 - 31
  var transferLength = encodedCdb[28] << 24 |
                       encodedCdb[29] << 16 |
                       encodedCdb[30] << 8 |
                       encodedCdb[31];
  fields.push({ name: "TRANSFER LENGTH", value: transferLength });
  return fields;
};

// SBC-3 5.15 - READ CAPACITY (10) command
var parseReadCapacity10 = function(encodedCdb)
{
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "Reserved", value: (encodedCdb[1] >> 1) & 0x7f, reserved: true });
  fields.push({ name: "Obsolete", value: (encodedCdb[1] & 0x01), obsolete: true });
  // Byte 2 - 5
  var obsolete1 = encodedCdb[2] << 24 | encodedCdb[3] << 16 | encodedCdb[4] << 8 | encodedCdb[5];
  fields.push({ name: "Obsolete", value: obsolete1, obsolete: true });
  // Byte 6 - 7
  var reserved1 = encodedCdb[6] << 8 | encodedCdb[7];
  fields.push({ name: "Reserved", value: reserved1, reserved: true });
  // Byte 8
  fields.push({ name: "Reserved", value: (encodedCdb[8] >> 1) & 0x7f, reserved: true });
  fields.push({ name: "Obsolete", value: (encodedCdb[8] & 0x01), obsolete: true });
  // Byte 9
  fields.push({ name: "CONTROL", value: encodedCdb[9] });
  return fields;
};

// SBC-3 5.16 - READ CAPACITY (16) command
var parseReadCapacity16 = function(encodedCdb)
{
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "Reserved", value: (encodedCdb[1] >> 5) & 0x07, reserved: true });
  fields.push({ name: "SERVICE ACTION", value: (encodedCdb[1] & 0x1f) });
  // Byte 2 - 9
  var obsolete1_hi = encodedCdb[2] << 24 | encodedCdb[3] << 16 | encodedCdb[4] << 8 | encodedCdb[5];
  var obsolete1_lo = encodedCdb[6] << 24 | encodedCdb[7] << 16 | encodedCdb[8] << 8 | encodedCdb[9];
  fields.push({ name: "Obsolete", value: [ obsolete1_hi, obsolete1_lo ], obsolete: true });
  // Byte 10 - 13
  var allocationLength = encodedCdb[10] << 24 | encodedCdb[11] << 16 | encodedCdb[12] << 8 | encodedCdb[13];
  fields.push({ name: "ALLOCATION LENGTH", value: allocationLength });
  // Byte 14
  fields.push({ name: "Reserved", value: (encodedCdb[14] >> 1) & 0x7f, reserved: true });
  fields.push({ name: "Obsolete", value: (encodedCdb[14] & 0x01), obsolete: true });
  // Byte 15
  fields.push({ name: "CONTROL", value: encodedCdb[15] });
  return fields;
};

// SBC-3 5.17 - READ DEFECT DATA (10) command
var parseReadDefectData10 = function(encodedCdb)
{
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "Reserved", value: encodedCdb[1], reserved: true });
  // Byte 2
  fields.push({ name: "Reserved", value: (encodedCdb[2] >> 5) & 0x07, reserved: true });
  fields.push({ name: "REQ_PLIST", value: (encodedCdb[2] >> 4) & 0x01 });
  fields.push({ name: "REQ_GLIST", value: (enodedCdb[2] >> 3) & 0x01 });
  fields.push({ name: "DEFECT LIST_FORMAT", value: (encodedCdb[2] & 0x07) });
  // Byte 3 - 6
  var reserved1 = encodedCdb[3] << 24 | encodedCdb[4] << 16 | encodedCdb[5] << 8 | encodedCdb[5];
  fields.push({ name: "Reserved", value: reserved1, reserved: true });
  // Byte 7 - 8
  fields.push({ name: "ALLOCATION LENGTH", value: encodedCdb[7] << 8 | encodedCdb[8] });
  // Byte 9
  fields.push({ name: "CONTROL", value: encodedCdb[9] });
  return fields;
};

// SBC-3 5.18 - READ DEFECT DATA (12) command
var parseReadDefectData12 = function(encodedCdb)
{
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "Reserved", value: (encodedCdb[2] >> 5) & 0x07, reserved: true });
  fields.push({ name: "REQ_PLIST", value: (encodedCdb[2] >> 4) & 0x01 });
  fields.push({ name: "REQ_GLIST", value: (enodedCdb[2] >> 3) & 0x01 });
  fields.push({ name: "DEFECT LIST FORMAT", value: (encodedCdb[2] & 0x07) });
  // Byte 2 - 5
  var addressDescriptorIndex = encodedCdb[2] << 24 | encodedCdb[3] << 16 | encodedCdb[4] << 8 | encodedCdb[5];
  fields.push({ name: "ADDRESS DESCRIPTOR INDEX", value: addressDescriptorIndex });
  // Byte 6-9
  var allocationLength = encodedCdb[6] << 24 | encodedCdb[7] << 16 | encodedCdb[8] << 8 | encodedCdb[9];
  fields.push({ name: "ALLOCATION LENGTH", value: allocationLength });
  // Byte 10
  fields.push({ name: "Reserved", value: encodedCdb[10], reserved: true });
  // Byte 11
  fields.push({ name: "CONTROL", value: encodedCdb[11] });
  return fields;
};

// SBC-3 5.19 - READ LONG (10) command
var parseReadLong10 = function(encodedCdb) {
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "Reserved", value: (encodedCdb[1] >> 3) & 0x1f, reserved: true });
  fields.push({ name: "PBLOCK", value: (encodedCdb[1] >> 2) & 0x01 });
  fields.push({ name: "CORRCT", value: (encodedCdb[1] >> 1) & 0x01 });
  fields.push({ name: "Obsolete", value: encodedCdb[1] & 0x01, obsolete: true });
  // Byte 2 - 5
  var logicalBlockAddress = encodedCdb[2] << 24 | encodedCdb[3] << 16 | encodedCdb[4] << 8 | encodedCdb[5];
  fields.push({ name: "LOGICAL BLOCK ADDRESS", value: logicalBlockAddress });
  // Byte 6
  fields.push({ name: "Reserved", value: encodedCdb[6], reserved: true });
  // Byte 7 - 8
  fields.push({ name: "BYTE TRANSFER LENGTH", value: encodedCdb[7] << 8 | encodedCdb[8] });
  // Byte 9
  fields.push({ name: "CONTROL", value: encodedCdb[9] });
  return fields;
};

// SBC-3 5.20 - READ LONG (16) command
var parseReadLong16 = function(encodedCdb) {
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "Reserved", value: (encodedCdb[1] >> 5) & 0x07, reserved: true });
  fields.push({ name: "SERVICE ACTION", value: (encodedCdb[1] & 0x1f) });
  // Byte 2 - 9
  var logicalBlockAddressHi = encodedCdb[2] << 24 | encodedCdb[3] << 16 | encodedCdb[4] << 8 | encodedCdb[5];
  var logicalBlockAddressLo = encodedCdb[6] << 24 | encodedCdb[7] << 16 | encodedCdb[8] << 8 | encodedCdb[9];
  fields.push({ name: "LOGICAL BLOCK ADDRESS", value: [ logicalBlockAddressHi, logicalBlockAddressLo ] });
  // Byte 10 - 11
  fields.push({ name: "Reserved", value: encodedCdb[10] << 8 | encodedCdb[11], reserved: true });
  // Byte 12 - 13
  fields.push({ name: "BYTE TRANSFER LENGTH", value: encodedCdb[13] << 8 | encodedCdb[13] });
  // Byte 14
  fields.push({ name: "Reserved", value: (encodedCdb[14] >> 1) & 0x3f, reserved: true });
  fields.push({ name: "PBLOCK", value: (encodedCdb[14] >> 1) & 0x01 });
  fields.push({ name: "CORRCT", value: encodedCdb[14] & 0x01 });
  // Byte 15
  fields.push({ name: "CONTROL", value: encodedCdb[15] });
  return fields;
};

// SBC-3 5.21 - REASSIGN BLOCKS command
var parseReassignBlocks = function(encodedCdb) {
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "Reserved", value: (encodedCdb[1] >> 2) & 0x3f, reserved: true });
  fields.push({ name: "LONGLBA", value: (encodedCdb[1] >> 1) & 0x01 });
  fields.push({ name: "LONGLIST", value: encodedCdb[1] & 0x01 });
  // Byte 2 - 4
  fields.push({ name: "Reserved", value: (encodedCdb[2] << 16 | encodedCdb[3] << 8 | encodedCdb[4]), reserved: true });
  // Byte 5
  fields.push({ name: "CONTROL", value: encodedCdb[5] });
  return fields;
};

// SPC-4 6.28 - RECEIVE ROD TOKEN INFORMATION command
var parseReceiveRodTokenInformation = function(encodedCdb) {
  var fields = [];
  // Byte 0
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  // Byte 1
  fields.push({ name: "Reserved", value: (encodedCdb[1] >> 5) & 0x07, reserved: true });
  fields.push({ name: "SERVICE ACTION", value: (encodedCdb[1] & 0x1f) });
  // Byte 2 - 5

  return fields;
}

var parseTestUnitReady = function(encodedCdb) {
  var fields = [];
  fields.push({ name: "OPERATION CODE", value: encodedCdb[0] });
  return fields;
};

var scsi_commands = [
  { name: "ACCESS CONTROL IN", opcode: 0x86, length: 16 },
  { name: "ACCESS CONTROL OUT", opcode: 0x87, length: 16 },
  { name: "ATA PASS-THROUGH", opcode: 0xa1, length: 12 },
  { name: "ATA PASS-THROUGH", opcode: 0x85, length: 16 },
  { name: "CHANGE ALIASES", opcode: 0xa4, service_action: 0x0b, length: 12 },
  { name: "COMPARE AND WRITE", opcode: 0x89, length: 16, parser: parseCompareAndWrite },
  { name: "FORMAT UNIT", opcode: 0x04, length: [ 4, 7 ], parser: parseFormatUnit },
  { name: "GET LBA STATUS", opcode: 0x9e, service_action: 0x12, length: 16, parser: parseGetLbaStatus },
  { name: "INQUIRY", opcode: 0x12, length: 6, parser: undefined },
  { name: "LOG SELECT", opcode: 0x4c, length: 10, parser: undefined },
  { name: "LOG SENSE", opcode: 0x4d, length: 10, parser: undefined },
  { name: "MAINTENANCE IN", opcode: 0xa3, service_action: [[ 0x00, 0x04 ], [0x06, 0x09 ]], length: 12, parser: undefined },
  { name: "MAINTENANCE OUT", opcode: 0xa4, service_action: [[ 0x00, 0x05 ], [0x07, 0x09 ]], length: 12, parser: undefined },
  { name: "MODE SELECT (6)", opcode: 0x15, length: 6, parser: undefined },
  { name: "MODE SELECT (10)", opcode: 0x55, length: 10, parser: undefined },
  { name: "MODE SENSE (6)", opcode: 0x1a, length: 6, parser: undefined },
  { name: "MODE SENSE (10)", opcode: 0x5a, length: 10, parser: undefined },
  { name: "ORWRITE (16)", opcode: 0x8b, length: 16, parser: parseOrwrite16 },
  { name: "ORWRITE (32)", opcode: 0x7f, service_action: 0x000e, length: 32, parser: parseOrwrite32 },
  { name: "PERSISTENT RESERVE IN", opcode: 0x5e, length: 10, parser: undefined },
  { name: "PERSISTENT RESERVE OUT", opcode: 0xf, length: 10, parser: undefined },
  { name: "POPULATE TOKEN", opcode: 0x83, service_action: 0x10, length: 16, parser: parsePopulateToken },
  { name: "PRE-FETCH (10)", opcode: 0x34, length: 10, parser: parsePreFetch10 },
  { name: "PRE-FETCH (16)", opcode: 0x90, length: 16, parser: parsePreFetch16 },
  { name: "PREVENT ALLOW REMOVE MEDIUM", opcode: 0x1e, length: undefined, parser: parsePreventAllowMediumRemoval },
  { name: "READ (10)", opcode: 0x28, length: 10, parser: parseRead10 },
  { name: "READ (12)", opcode: 0xa8, length: 12, parser: parseRead12 },
  { name: "READ (16)", opcode: 0x88, length: 16, parser: parseRead16 },
  { name: "READ (32)", opcode: 0x7f, service_action: 0x0009, length: 32, parser: parseRead32 },
  { name: "READ ATTRIBUTE", opcode: 0x8c, length: 16, parser: undefined },
  { name: "READ BUFFER", opcode: 0x3c, length: 10, parser: undefined },
  { name: "READ CAPACITY (10)", opcode: 0x25, length: 10, parser: parseReadCapacity10 },
  { name: "READ CAPACITY (16)", opcode: 0x9e, service_action: 0x10, length: 16, parser: parseReadCapacity16 },
  { name: "READ DEFECT DATA (10)", opcode: 0x37, length: 10, parser: parseReadDefectData10 },
  { name: "READ DEFECT DATA (12)", opcode: 0xb7, length: 12, parser: parseReadDefectData12 },
  { name: "READ LONG (10)", opcode: 0x3e, length: 10, parser: parseReadLong10 },
  { name: "READ LONG (16)", opcode: 0x9e, service_action: 0x11, length: 16, parser: parseReadLong16 },
  { name: "REASSIGN BLOCKS", opcode: 0x07, length: 6, parser: undefined },
  { name: "RECEIVE COPY DATA(LID4)", opcode: 0x84, service_action: 0x06, length: 16, parser: undefined },
  { name: "RECEIVE COPY DATA(LID3)", opcode: 0x84, service_action: 0x01, length: 16, parser: undefined },
  { name: "RECEIVE DIAGNOSTIC RESULTS", opcode: 0x1c, length: 6, parser: undefined },
  { name: "RECEIVE ROD TOKEN INFORMATION", opcode: 0x84, service_action: 0x07, length: 16, parser: parseReceiveRodTokenInformation },
  { name: "REDUNDANCY GROUP IN", opcode: 0xba, length: undefined, parser: undefined },
  { name: "REDUNDANCY GROUP OUT", opcode: 0xbb, length: undefined, parser: undefined },
  { name: "REPORT REFERRALS", opcode: 0x9e, service_action: 0x13, length: 16, parser: undefined },
  { name: "REPORT ALIASES", opcode: 0xa3, service_action: 0x0b, length: 12, parser: undefined },
  { name: "REPORT IDENTIFYING INFORMATION", opcode: 0xa3, service_action: 0x05, length: 12, parser: undefined },
  { name: "REPORT LUNS", opcode: 0xa0, length: 12, parser: undefined },
  { name: "REPORT PRIORITY", opcode: 0xa3, service_action: 0x0e, length: 12, parser: undefined },
  { name: "REPORT SUPPORTED OPERATION CODES", opcode: 0xa3, service_action: 0x0c, length: 12, parser: undefined },
  { name: "REPORT SUPPORTED TASK MANAGEMENT FUNCTIONS", opcode: 0xa3, service_action: 0x0d, length: 12, parser: undefined },
  { name: "REPORT TARGET PORT GROUPS", opcode: 0xa3, service_action: 0x0a, length: 12, parser: undefined },
  { name: "REQUEST SENSE", opcode: 0x03, length: 6, parser: undefined },
  { name: "SANITIZE", opcode: 0x48, length: 10, parser: undefined },
  { name: "SECURITY PROTOCOL IN", opcode: 0xa2, length: 12, parser: undefined },
  { name: "SECURITY PROTOCOL OUT", opcode: 0xb5, length: 12, parser: undefined },
  { name: "SEND DIAGNOSTIC", opcode: 0x1d, length: 6, parser: undefined },
  { name: "SET IDENTIFYING INFORMATION", opcode: 0xa4, service_action: 0x06, length: 12, parser: undefined },
  { name: "SET PRIORITY", opcode: 0xa4, service_action: 0x0e, length: 12, parser: undefined },
  { name: "SET TARGET PORT GROUPS", opcode: 0xa4, service_action: 0x0a, length: 12, parser: undefined },
  { name: "SPARE IN", opcode: 0xbc, length: undefined, parser: undefined },
  { name: "SPARE OUT", opcode: 0xbd, length: undefined, parser: undefined },
  { name: "START STOP UNIT", opcode: 0x1b, length: 6, parser: undefined },
  { name: "SYNCHRONIZE CACHE (10)", opcode: 0x35, length: 10, parser: undefined },
  { name: "SYNCHRONIZE CACHE (16)", opcode: 0x91, length: 10, parser: undefined },
  { name: "TEST UNIT READY", opcode: 0x00, length: 6, parser: parseTestUnitReady },
  { name: "VERIFY (10)", opcode: 0x2f, length: 10, parser: undefined },
  { name: "VERIFY (12)", opcode: 0xaf, length: 12, parser: undefined },
  { name: "VERIFY (16)", opcode: 0x8f, length: 16, parser: undefined },
];

// Where to decode the service action from for various opcodes
var service_action_info = [
  { opcode: 0x86, byte_offset: 1, byte_length: 1, bitmask: 0x1f },
  { opcode: 0xa4, byte_offset: undefined, byte_length: undefined, bitmask: undefined },
  { opcode: 0x9e, byte_offset: 1, byte_length: 1, bitmask: 0x1f },
  { opcode: 0xa3, byte_offset: undefined, byte_length: undefined, bitmask: undefined },
  { opcode: 0xa4, byte_offset: undefined, byte_length: undefined, bitmask: undefined },
  { opcode: 0x7f, byte_offset: 8, byte_length: 2, bitmask: 0xffff },
  { opcode: 0x83, byte_offset: 1, byte_length: 1, bitmask: 0x1f },
  { opcode: 0x9e, byte_offset: 1, byte_length: 1, bitmask: 0x1f },
  { opcode: 0x84, byte_offset: 1, byte_length: 1, bitmask: 0x1f },
];

//var exports = module.exports = {};

var CDB = function() {
};

CDB.prototype.decode = function(input) {
    if (input.length == 0) {
        return { truncated: true };
    }
}

// This function is restriced to returning values of 32 bits or less.
function get_field(byte_array, start_offset, byte_length, bitmask) {
  if (byte_length > 4) {
    throw "byte_length too long";
  }
  if (byte_array.length > (start_offset + (byte_length - 1)))
  {
    var value = byte_array[start_offset];

    // Assume multi-byte values are encoded with the MSB at the highest index.
    for (var i = start_offset + 1; i < (start_offset + (byte_length)); i++)
    {
      console.log("iter");
      value = value << 8;
      value += byte_array[i];
    }

    value &= bitmask;
    return value;
  } else {
    throw "Data Truncated";
  }
}

//
CDB.prototype.parse = function(encodedCdb) {
    console.log("Parsing encoded CDB: " + encodedCdb);
  if (Array.isArray(encodedCdb)) {
    if (encodedCdb.length > 0) {
      var opcode = encodedCdb[0];
      var service_action;

      // Find out if we need to get a Service Action to uniquely identify this
      // command.
      for (var i = 0; i < service_action_info.length; i++) {
        if (service_action_info[i].opcode == opcode)
        {
          service_action = get_field(encodedCdb,
                                     service_action_info[i].byte_offset,
                                     service_action_info[i].byte_length,
                                     service_action_info[i].bitmask);
          break;
        }
      }

      // Now we need to identify the message type based on the OpCode and the
      // optional ServiceAction.
      var name;
      var length;

      for (var i = 0; i < scsi_commands.length; i++) {
        if (scsi_commands[i].opcode == opcode &&
            scsi_commands[i].service_action == service_action) {
          name = scsi_commands[i].name;
          length = scsi_commands[i].length;
          break;
        }
      }

      this.name = name;
      this.fields = scsi_commands[i].parser(encodedCdb);

      // Check for trunaction - complicated.
      // Decode all fields.
    } else {

    }
  } else {
    throw "Invalid encodedCdb, must be an array";
  }
};


if (typeof module === 'undefined') {

} else {
  module.exports = CDB;
}
