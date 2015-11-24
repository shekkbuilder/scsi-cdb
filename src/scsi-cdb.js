//
// CDB.js
//
// Provides functionality to decode a SCSI CDB.
//

"use strict";

var bigInt = require('big-integer');
var assert = require('assert');

var commands = [];

// SBC-4 5.2 - BACKGROUND CONTROL command
var backgroundControl = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x9e },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0, id: true, value: 0x15 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "Reserved", length: 6, byte: 2, bit: 0, reserved: true },
    { name: "BO_CTL", length: 2, byte: 2, bit: 6 },
    { name: "BO_TIME", length: 8, byte: 3, bit: 0 },
    { name: "Reserved", length: 88, byte: 4, bit: 0 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "BACKGROUND CONTROL",
    layout: backgroundControl,
    operationCode: 0x9e,
    serviceAction: 0x15 });

// SBC-4 5.3 - COMPARE AND WRITE command
var compareAndWrite = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x89 },
    { name: "Reserved", length: 1, byte: 1, bit: 0, reserved: true },
    { name: "FUA_NV", length: 1, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 2, reserved: true },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "Reserved", length: 24, byte: 10, bit: 0 },
    { name: "NUMBER OF LOGICAL BLOCKS", length: 8, byte: 13, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 14, bit: 6, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "COMPARE AND WRITE",
    layout: compareAndWrite,
    operationCode: 0x89 });

// SBC-4 5.4 - FORMAT UNIT command
var formatUnit = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x04 },
    { name: "DEFECT LIST FORMAT", length: 3, byte: 1, bit: 0 },
    { name: "CMPLIST", length: 1, byte: 1, bit: 3 },
    { name: "FMTDATA", length: 1, byte: 1, bit: 4 },
    { name: "LONGLIST", length: 1, byte: 1, bit: 5 },
    { name: "FMTPINFO", length: 2, byte: 1, bit: 6 },
    { name: "Vendor specific", length: 8, byte: 2, bit: 0 },
    { name: "Obsolete", length: 16, byte: 3, bit: 0 },
    { name: "CONTROL", length: 8, byte: 5, bit: 0 },
];

commands.push({
    name: "FORMAT UNIT",
    layout: formatUnit,
    operationCode: 0x04 });

// SBC-4 5.5 - GET LBA STATUS command
var getLbaStatus = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x9e },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0, id: true, value: 0x12 },
    { name: "Reserved", length: 3, byte: 1, bit: 5 },
    { name: "STARTING LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "ALLOCATION LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "Reserved", length: 8, byte: 14, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "GET LBA STATUS",
    layout: getLbaStatus,
    operationCode: 0x9e,
    serviceAction: 0x12 });

// SBC-4 5.6 - GET STREAM STATUS command
var getStreamStatus = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x9e },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0, id: true, value: 0x16 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "Reserved", length: 16, byte: 2, bit: 0, reserved: true },
    { name: "STARTING STREAM IDENTIFIED", length: 16, byte: 4, bit: 0 },
    { name: "Reserved", length: 32, byte: 6, bit: 0, reserved: true },
    { name: "ALLOCATION LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "Reserved", length: 8, byte: 14, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "GET STREAM STATUS",
    layout: getStreamStatus,
    operationCode: 0x9e,
    serviceAction: 0x16 });

// SBC-4 5.7 - ORWRITE (16) command
var orwrite16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x8b },
    { name: "Reserved", length: 3, byte: 1, bit: 0, reserved: true },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "ORPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "STARTING LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 14, bit: 6, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "ORWRITE (16)",
    layout: orwrite16,
    operationCode: 0x8b });

// SBC-4 5.8 - ORWRITE (32) command
var orwrite32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x7f },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "BMOP", length: 3, byte: 2, bit: 0 },
    { name: "Reserved", length: 5, byte: 2, bit: 3, reserved: true },
    { name: "PREVIOUS GENERATION PROCESSING", length: 4, byte: 3, bit: 0 },
    { name: "Reserved", length: 4, byte: 3, bit: 4, reserved: true },
    { name: "Reserved", length: 16, byte: 4, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0, id: true, value: 0x000e },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0 },
    { name: "Reserved", length: 3, byte: 10, bit: 0, reserved: true },
    { name: "FUA", length: 1, byte: 10, bit: 3 },
    { name: "DPO", length: 1, byte: 10, bit: 4 },
    { name: "ORPROTECT", length: 3, byte: 10, bit: 5 },
    { name: "Reserved", length: 8, byte: 11, bit: 0, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 12, bit: 0 },
    { name: "EXPECTED ORWGENERATION", length: 32, byte: 20, bit: 0 },
    { name: "NEW ORWGENERATION", length: 32, byte: 24, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 28, bit: 0 },
];

commands.push({
    name: "ORWRITE (32)",
    layout: orwrite32,
    operationCode: 0x7f,
    serviceAction: 0x000e });

// SBC-4 5.9 - POPULATE TOKEN command
var populateToken = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x83 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0, id: true, value: 0x0010 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "LIST IDENTIFIER", length: 32, byte: 6, bit: 0 },
    { name: "PARAMETER LIST LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 14, bit: 6, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "POPULATE TOKEN",
    layout: populateToken,
    operationCode: 0x83,
    serviceAction: 0x0010 });

// SBC-4 5.10 - PRE-FETCH (10) command
var preFetch10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x34 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "IMMED", length: 1, byte: 1, bit: 1 },
    { name: "Reserved", length: 6, byte: 1, bit: 2 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "PREFETCH LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "PRE-FETCH (10)",
    layout: preFetch10,
    operationCode: 0x34 });

// SBC-4 5.11 - PRE-FETCH (16) command
var preFetch16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x90 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "IMMED", length: 1, byte: 1, bit: 1 },
    { name: "Reserved", length: 6, byte: 1, bit: 2 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "PREFETCH LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 14, bit: 6, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "PRE-FETCH (16)",
    layout: preFetch16,
    operationCode: 0x90 });

// SBC-4 5.12 - PREVENT ALLOW MEDIUM REMOVAL command
var preventAllowMediumRemoval = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x1e },
    { name: "Reserved", length: 8, byte: 1, bit: 0, reserved: true },
    { name: "Reserved", length: 8, byte: 2, bit: 0, reserved: true },
    { name: "Reserved", length: 8, byte: 3, bit: 0, reserved: true },
    { name: "PREVENT", length: 2, byte: 4, bit: 0 },
    { name: "Reserved", length: 8, byte: 4, bit: 2, reserved: true },
    { name: "CONTROL",length: 8, byte: 5, bit: 0 },
];

commands.push({
    name: "PREVENT ALLOW MEDIUM REMOVAL",
    layout: preventAllowMediumRemoval,
    operationCode: 0x1e });

// SBC-4 5.13 - READ (10) command
var read10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x28 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "RARC", length: 1, byte: 1, bit: 2 },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "RDPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "TRANSFER LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "READ (10)",
    layout: read10,
    operationCode: 0x28 });

// SBC-4 5.14 - READ (12) command
var read12 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0xa8 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "RARC", length: 1, byte: 1, bit: 2 },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "RDPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 6, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 10, bit: 0 },
    { name: "Reserved", length: 2, byte: 10, bit: 6, reserved: true },
    { name: "CONTROL", length: 8, byte: 11, bit: 0 },
];

commands.push({
    name: "READ (12)",
    layout: read12,
    operationCode: 0xa8 });

// SBC-4 5.15 - READ (16) command
var read16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x88 },
    { name: "DLD2", length: 1, byte: 1, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "RARC", length: 1, byte: 1, bit: 2 },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "RDPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 14, bit: 0 },
    { name: "DLD0", length: 1, byte: 14, bit: 6 },
    { name: "DLD1", length: 1, byte: 14, bit: 7 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "READ (16)",
    layout: read16,
    operationCode: 0x88 });

// SBC-4 5.16 - READ (32) command
var read32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x7f },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0, id: true, value: 0x0009 },
    { name: "Reserved", length: 1, byte: 10, bit: 0, reserved: true },
    { name: "Obsolete", length: 1, byte: 10, bit: 1, obsolete: true },
    { name: "RARC", length: 1, byte: 10, bit: 2 },
    { name: "FUA", length: 1, byte: 10, bit: 3 },
    { name: "DPO", length: 1, byte: 10, bit: 4 },
    { name: "RDPROTECT", length: 3, byte: 10, bit: 5 },
    { name: "Reserved", length: 8, byte: 11, bit: 0, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 12, bit: 0 },
    { name: "EXPECTED INITIAL LOGICAL BLOCK REFERENCE TAG", length: 32, byte: 20, bit: 0 },
    { name: "EXPECTED LOGICAL BLOCK APPLICATION TAG", length: 16, byte: 24, bit: 0 },
    { name: "LOGICAL BLOCK APPLICATION TAG MASK", length: 16, byte: 26, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 28, bit: 0 },
];

commands.push({
    name: "READ (32)",
    layout: read32,
    operationCode: 0x7f,
    serviceAction: 0x0009 });

// SBC-4 5.17 - READ CAPACITY (10) command
var readCapacity10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x25 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "Reserved", length: 7, byte: 1, bit: 1, reserved: true },
    { name: "Obsolete", length: 32, byte: 2, bit: 0, obsolete: true },
    { name: "Reserved", length: 16, byte: 6, bit: 0, reserved: true },
    { name: "Obsolete", length: 1, byte: 8, bit: 0, obsolete: true },
    { name: "Reserved", length: 7, byte: 8, bit: 1, reserved: true },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "READ CAPACITY (10)",
    layout: readCapacity10,
    operationCode: 0x25 });

// SBC-4 5.18 - READ CAPACITY (16) command
var readCapacity16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x9e },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0, id: true, value: 0x10 },
    { name: "Reserved", length: 1, byte: 1, bit: 5, reserved: true },
    { name: "Obsolete", length: 64, byte: 2, bit: 0, obsolete: true },
    { name: "ALLOCATION LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "Obsolete", length: 1, byte: 14, bit: 0, obsolete: true },
    { name: "Reserved", length: 7, byte: 14, bit: 1, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "READ CAPACITY (16)",
    layout: readCapacity16,
    operationCode: 0x9e,
    serviceAction: 0x10 });

// SBC-4 5.19 - READ DEFECT DATA (10) command
var readDefectData10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x37 },
    { name: "Reserved", length: 8, byte: 1, bit: 0, reserved: true },
    { name: "DEFECT LIST_FORMAT", length: 3, byte: 2, bit: 0 },
    { name: "REQ_GLIST", length: 1, byte: 2, bit: 3 },
    { name: "REQ_PLIST", length: 1, byte: 2, bit: 4 },
    { name: "Reserved", length: 3, byte: 2, bit: 5 },
    { name: "Reserved", length: 32, byte: 3, bit: 0, reserved: true },
    { name: "ALLOCATION LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "READ DEFECT DATA (10)",
    layout: readDefectData10,
    operationCode: 0x37 });

// SBC-4 5.20 - READ DEFECT DATA (12) command
var readDefectData12 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0xb7 },
    { name: "DEFECT LIST FORMAT", length: 3, byte: 1, bit: 0 },
    { name: "REQ_GLIST", length: 1, byte: 1, bit: 3 },
    { name: "REQ_PLIST", length: 1, byte: 1, bit: 4 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "ADDRESS DESCRIPTOR INDEX", length: 32, byte: 2, bit: 0 },
    { name: "ALLOCATION LENGTH", length: 32, byte: 6, bit: 0 },
    { name: "Reserved", length: 8, byte: 10, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 11, bit: 0 },
];

commands.push({
    name: "READ DEFECT DATA (12)",
    layout: readCapacity16,
    operationCode: 0xb7 });

// SBC-4 5.21 - READ LONG (10) command
var readLong10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x3e },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "CORRCT", length: 1, byte: 1, bit: 1 },
    { name: "PBLOCK", length: 1, byte: 1, bit: 2 },
    { name: "Reserved", length: 5, byte: 1, bit: 3, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "Reserved", length: 8, byte: 6, bit: 0, reserved: true },
    { name: "BYTE TRANSFER LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, bytes: 9, bit: 0 },
];

commands.push({
    name: "READ LONG (10)",
    layout: readLong10,
    operationCode: 0x3e });

// SBC-4 5.22 - READ LONG (16) command
var readLong16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x9e },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0, id: true, value: 0x11 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "Reserved", length: 16, byte: 10, bit: 0, reserved: true },
    { name: "BYTE TRANSFER LENGTH", byte: 12, bit: 0 },
    { name: "CORRCT", length: 1, byte: 14, bit: 0 },
    { name: "PBLOCK", length: 1, byte: 14, bit: 1 },
    { name: "Reserved", length: 6, byte: 14, bit: 2 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "READ LONG (16)",
    layout: readLong16,
    operationCode: 0x9e,
    serviceAction: 0x11 });

// SBC-4 5.23 - REASSIGN BLOCKS command
var reassignBlocks = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x07 },
    { name: "LONGLIST", length: 1, byte: 1, bit: 0 },
    { name: "LONGLBA", length: 1, byte: 1, bit: 1 },
    { name: "Reserved", length: 6, byte: 1, bit: 2, reserved: true },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 5, bit: 0 },
];

commands.push({
    name: "REASSIGN BLOCKS",
    layout: reassignBlocks,
    operationCode: 0x07 });

// SBC-4 5.24 - RECEIVE ROD TOKEN INFORMATION
// See SPC-4

// SBC-4 5.25 - REPORT REFERRALS command
var reportReferrals = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x9e },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0, id: true, value: 0x13 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "ALLOCATION LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "ONE_SEG", length: 1, byte: 14, bit: 0 },
    { name: "Reserved", length: 7, byte: 14, bit: 1 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "REPORT REFERRALS",
    layout: reportReferrals,
    operationCode: 0x9e,
    serviceAction: 0x13 });

// SBC-4 5.27 - SANITIZE command
var sanitize = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x48 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0 },
    { name: "AUSE", length: 1, byte: 1, bit: 5 },
    { name: "Reserved", length: 1, byte: 1, bit: 6 },
    { name: "IMMED", length: 1, byte: 1, bit: 7 },
    { name: "Reserved", length: 40, byte: 2, bit: 0, reserved: true },
    { name: "PARAMETER LIST LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "SANITIZE",
    layout: sanitize,
    operationCode: 0x48 });

// SBC-4 5.28 - START STOP UNIT command
var startStopUnit = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x1b },
    { name: "IMMED", length: 1, byte: 1, bit: 0 },
    { name: "Reserved", length: 7, byte: 1, bit: 1 },
    { name: "Reserved", length: 8, byte: 2, bit: 0 },
    { name: "POWER CONDITION MODIFIER", length: 4, byte: 3, bit: 0 },
    { name: "Reserved", length: 4, byte: 4, bit: 4 },
    { name: "CONTROL", length: 8, byte: 5, bit: 0 },
];

commands.push({
    name: "START STOP UNIT",
    layout: startStopUnit,
    operationCode: 0x1b });

// SBC-4 5.29 - STREAM CONTROL command
var streamControl = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x9e },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0, id: true, value: 0x14 },
    { name: "STR_CTL", length: 2, byte: 1, bit: 5 },
    { name: "Reserved", length: 1, byte: 1, bit: 7, reserved: true },
    { name: "Reserved", length: 16, byte: 2, bit: 0, reserved: true },
    { name: "STR_ID", length: 16, byte: 4, bit: 0 },
    { name: "Reserved", length: 72, byte: 6, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "STREAM CONTROL",
    layout: streamControl,
    operationCode: 0x9e,
    serviceAction: 0x14 });

// SBC-4 5.30 - SYNCHRONIZE CACHE (10) command
var synchronizeCache10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x35 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "IMMED", length: 1, byte: 1, bit: 1 },
    { name: "Obsolete", length: 1, byte: 1, bit: 2, obsolete: true },
    { name: "Reserved", length: 5, byte: 1, bit: 3, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6 },
    { name: "NUMBER OF LOGICAL BLOCKS", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "SYNCHRONIZE CACHE (10)",
    layout: synchronizeCache10,
    operationCode: 0x35 });

// SBC-4 5.31 - SYNCHRONIZE CACHE (16) command
var synchronizeCache16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x91 },
    { name: "Reserved", length: 1, byte: 1, bit: 0, reserved: true },
    { name: "IMMED", length: 1, byte: 1, bit: 1 },
    { name: "Obsolete", length: 1, byte: 1, bit: 2, obsolete: true },
    { name: "Reserved", length: 5, byte: 1, bit: 3, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "NUMBER OF LOGICAL BLOCKS", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 14, bit: 6 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "SYNCHRONIZE CACHE (16)",
    layout: synchronizeCache16,
    operationCode: 0x91 });

// SBC-4 5.32 - UNMAP command
var unmap = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x42 },
    { name: "ANCHOR", length: 1, byte: 1, bit: 0 },
    { name: "Reserved", length: 7, byte: 1, bit: 1, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6 },
    { name: "PARAMETER LIST LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "UNMAP",
    layout: unmap,
    operationCode: 0x42 });

// SBC-4 5.33 - VERIFY (10) command
var verify10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x2f },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "BYTCHK", length: 2, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "VRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 1, byte: 6, bit: 6, reserved: true },
    { name: "Restricted for MMC-6", length: 1, byte: 6, bit: 7 },
    { name: "VERIFICATION LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "VERIFY (10)",
    layout: verify10,
    operationCode: 0x2f });

// SBC-4 5.34 - VERIFY (12) command
var verify12 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0xaf },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "BYTCHK", length: 2, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "VRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "VERIFICATION LENGTH", length: 32, byte: 6, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 10, bit: 0 },
    { name: "Reserved", length: 2, byte: 10, bit: 5, reserved: true },
    { name: "CONTROL", length: 8, byte: 11, bit: 0 },
];

commands.push({
    name: "VERIFY (12)",
    layout: verify12,
    operationCode: 0xaf });

// SBC-4 5.35 - VERIFY (16) command
var verify16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x8f },
    { name: "Reserved", length: 1, byte: 1, bit: 0, reserved: true },
    { name: "BYTCHK", length: 2, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 3, reserved: true },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "VRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "VERIFICATION LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 14, bit: 6, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "VERIFY (16)",
    layout: verify16,
    operationCode: 0x8f });

// SBC-4 5.36 - VERIFY (32) command
var verify32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x7f },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0, id: true, value: 0x000a },
    { name: "Reserved", length: 1, byte: 10, bit: 0, reserved: true },
    { name: "BYTCHK", length: 2, byte: 10, bit: 1 },
    { name: "Reserved", length: 1, byte: 10, bit: 2, reserved: true },
    { name: "DPO", length: 1, byte: 10, bit: 4 },
    { name: "VRPROTECT", length: 3, byte: 10, bit: 5 },
    { name: "Reserved", length: 8, byte: 11, bit: 0, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 12, bit: 0 },
    { name: "EXPECTED INITIAL LOGICAL BLOCK REFERENCE TAG", length: 32, byte: 20, bit: 0 },
    { name: "EXPECTED LOGICAL BLOCK APPLICATION TAG", length: 16, byte: 24, bit: 0 },
    { name: "LOGICAL BLOCK APPLICATION TAG MASK", length: 16, byte: 26, bit: 0 },
    { name: "VERIFICATION LENGTH", length: 32, byte: 28, bit: 0 },
];

commands.push({
    name: "VERIFY (32)",
    layout: verify32,
    operationCode: 0x7f,
    serviceAction: 0x000a });

// SBC-4 5.37 - WRITE (10) command
var write10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x2a },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "Reserved", length: 1, byte: 1, bit: 2, reserved: true },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "TRANSFER LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "WRITE (10)",
    layout: write10,
    operationCode: 0x2a });

// SBC-4 5.38 - WRITE (12) command
var write12 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0xaa },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "Reserved", length: 1, byte: 1, bit: 2, reserved: true },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 6, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 10, bit: 0 },
    { name: "Reserved", length: 1, byte: 10, bit: 6, reserved: true },
    { name: "Restricted for MMC-6", length: 1, byte: 10, bit: 7 },
    { name: "CONTROL", length: 8, byte: 11, bit: 0 },
];

commands.push({
    name: "WRITE (12)",
    layout: write12,
    operationCode: 0xaa });

// SBC-4 5.39 - WRITE (16) command
var write16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x8a },
    { name: "DLD2", length: 1, byte: 1, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "Reserved", length: 1, byte: 1, bit: 2, reserved: true },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 14, bit: 0 },
    { name: "DLD0", length: 1, byte: 14, bit: 6 },
    { name: "DLD1", length: 1, byte: 14, bit: 7 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "WRITE (16)",
    layout: write16,
    operationCode: 0x8a });

// SBC-4 5.40 - WRITE (32) command
var write32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x7f },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0, id: true, value: 0x000b },
    { name: "Reserved", length: 1, byte: 10, bit: 0, reserved: true },
    { name: "Obsolete", length: 1, byte: 10, bit: 1, obsolete: true },
    { name: "Reserved", length: 1, byte: 10, bit: 2, reserved: true },
    { name: "FUA", length: 1, byte: 10, bit: 3 },
    { name: "DPO", length: 1, byte: 10, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 10, bit: 5 },
    { name: "Reserved", length: 8, byte: 11, bit: 0, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 12, bit: 0 },
    { name: "EXPECTED INITIAL LOGICAL BLOCK REFERENCE TAG", length: 32, byte: 20, bit: 0 },
    { name: "EXPECTED LOGICAL BLOCK APPLICATION TAG", length: 16, byte: 24, bit: 0 },
    { name: "LOGICAL BLOCK APPLICATION TAG MASK", length: 16, byte: 26, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 28, bit: 0 },
];

commands.push({
    name: "WRITE (32)",
    layout: write32,
    operationCode: 0x7f,
    serviceAction: 0x000b });

// SBC-4 5.41 - WRITE AND VERIFY (10) command
var writeAndVerify10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x2e },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "BYTCHK", length: 2, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 3, reserved: true },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "TRANSFER LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "WRITE AND VERIFY (10)",
    layout: writeAndVerify10,
    operationCode: 0x2e });

// SBC-4 5.42 - WRITE AND VERIFY (12) command
var writeAndVerify12 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0xae },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "BYTCHK", length: 2, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 3, reserved: true },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 6, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 10, bit: 0 },
    { name: "Reserved", length: 2, byte: 10, bit: 6, reserved: true },
    { name: "CONTROL", length: 8, byte: 11, bit: 0 },
];

commands.push({
    name: "WRITE AND VERIFY (12)",
    layout: writeAndVerify12,
    operationCode: 0xae });

// SBC-4 5.43 - WRITE AND VERIFY (16) command
var writeAndVerify16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x8e },
    { name: "Reserved", length: 1, byte: 1, bit: 0, reserved: true },
    { name: "BYTCHK", length: 2, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 3, reserved: true },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 14, bit: 6, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "WRITE AND VERIFY (16)",
    layout: writeAndVerify16,
    operationCode: 0x8e });

// SBC-4 5.44 - WRITE AND VERIFY (32) command
var writeAndVerify32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x7f },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0, id: true, value: 0x000c },
    { name: "Reserved", length: 1, byte: 10, bit: 0, reserved: true },
    { name: "BYTCHK", length: 2, byte: 10, bit: 1, obsolete: true },
    { name: "Reserved", length: 1, byte: 10, bit: 3, reserved: true },
    { name: "DPO", length: 1, byte: 10, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 10, bit: 5 },
    { name: "Reserved", length: 8, byte: 11, bit: 0, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 12, bit: 0 },
    { name: "EXPECTED INITIAL LOGICAL BLOCK REFERENCE TAG", length: 32, byte: 20, bit: 0 },
    { name: "EXPECTED LOGICAL BLOCK APPLICATION TAG", length: 16, byte: 24, bit: 0 },
    { name: "LOGICAL BLOCK APPLICATION TAG MASK", length: 16, byte: 26, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 28, bit: 0 },
];

commands.push({
    name: "WRITE AND VERIFY (32)",
    layout: writeAndVerify32,
    operationCode: 0x7f,
    serviceAction: 0x000c });

// SBC-4 5.45 - WRITE ATOMIC (16) command
var writeAtomic16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x9c },
    { name: "Reserved", length: 3, byte: 1, bit: 0 },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "ATOMIC BOUNDARY", length: 16, byte: 10, bit: 0 },
    { name: "TRANSFER LENGTH", length: 16, byte: 12, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 14, bit: 6 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "WRITE ATOMIC (16)",
    layout: writeAtomic16,
    operationCode: 0x9c });

// SBC-4 5.46 - WRITE ATOMIC (32) command
var writeAtomic32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x7f },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 16, byte: 2, bit: 0, reserved: true },
    { name: "ATOMIC BOUNDARY", length: 16, byte: 4, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0, id: true, value: 0x000f },
    { name: "Reserved", length: 1, byte: 10, bit: 0, reserved: true },
    { name: "Obsolete", length: 1, byte: 10, bit: 1, obsolete: true },
    { name: "Reserved", length: 1, byte: 10, bit: 2, reserved: true },
    { name: "FUA", length: 1, byte: 10, bit: 3 },
    { name: "DPO", length: 1, byte: 10, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 10, bit: 5 },
    { name: "Reserved", length: 8, byte: 11, bit: 0, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 12, bit: 0 },
    { name: "EXPECTED INITIAL LOGICAL BLOCK REFERENCE TAG", length: 32, byte: 20, bit: 0 },
    { name: "EXPECTED LOGICAL BLOCK APPLICATION TAG", length: 16, byte: 24, bit: 0 },
    { name: "LOGICAL BLOCK APPLICATION TAG MASK", length: 16, byte: 26, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 28, bit: 0 },
];

commands.push({
    name: "WRITE ATOMIC (32)",
    layout: writeAtomic32,
    operationCode: 0x7f,
    serviceAction: 0x000f });

// SBC-4 5.47 - WRITE LONG (10) command
var writeLong10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x3f },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "Reserved", length: 4, byte: 1, bit: 1, reserved: true },
    { name: "PBLOCK", length: 1, byte: 1, bit: 5, obsolete: true },
    { name: "WR_UNCOR", length: 1, byte: 1, bit: 6 },
    { name: "COR_DIS", length: 1, byte: 1, bit: 7, obsolete: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "Reserved", length: 8, byte: 6, bit: 0, reserved: true },
    { name: "BYTE TRANSFER LENGTH", length: 16, byte: 7, bit: 0, obsolete: true },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "WRITE LONG (10)",
    layout: writeLong10,
    operationCode: 0x3f });

// SBC-4 5.48 - WRITE LONG (16) command
var writeLong16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x9f },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0, id: true, value: 0x11 },
    { name: "PBLOCK", length: 1, byte: 1, bit: 5, obsolete: true },
    { name: "WR_UNCOR", length: 1, byte: 1, bit: 6 },
    { name: "COR_DIS", length: 1, byte: 1, bit: 7, obsolete: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "Reserved", length: 16, byte: 10, bit: 0, reserved: true },
    { name: "BYTE TRANSFER LENGTH", length: 16, byte: 12, bit: 0, obsolete: true },
    { name: "Reserved", length: 16, byte: 14, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "WRITE LONG (16)",
    layout: writeLong16,
    operationCode: 0x9f,
    serviceAction: 0x11 });

// SBC-4 5.49 - WRITE SAME (10) command
var writeSame10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x41 },
    { name: "Obsolete", length: 3, byte: 1, bit: 0, obsolete: true },
    { name: "UNMAP", length: 1, byte: 1, bit: 3 },
    { name: "ANCHOR", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "NUMBER OF LOGICAL BLOCKS", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "WRITE SAME (10)",
    layout: writeSame10,
    operationCode: 0x41 });

// SBC-4 5.50 - WRITE SAME (16) command
var writeSame16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x93 },
    { name: "NDOB", length: 1, byte: 1, bit: 0 },
    { name: "Obsolete", length: 2, byte: 1, bit: 1, obsolete: true },
    { name: "UNMAP", length: 1, byte: 1, bit: 3 },
    { name: "ANCHOR", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "NUMBER OF LOGICAL BLOCKS", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 15, bit: 6, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "WRITE SAME (16)",
    layout: writeSame16,
    operationCode: 0x93 });

// SBC-4 5.51 - WRITE SAME (32) command
var writeSame32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x7f },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0, id: true, value: 0x000d },
    { name: "NDOB", length: 1, byte: 10, bit: 0 },
    { name: "Obsolete", length: 2, byte: 10, bit: 1 },
    { name: "UNMAP", length: 1, byte: 10, bit: 3 },
    { name: "ANCHOR", length: 1, byte: 10, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 10, bit: 5 },
    { name: "Reserved", length: 8, byte: 11, bit: 0, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 12, bit: 0 },
    { name: "EXPECTED INITIAL LOGICAL BLOCK REFERENCE TAG", length: 32, byte: 20, bit: 0 },
    { name: "EXPECTED LOGICAL BLOCK APPLICATION TAG", length: 16, byte: 24, bit: 0 },
    { name: "LOGICAL BLOCK APPLICATION TAG MASK", length: 16, byte: 26, bit: 0 },
    { name: "NUMBER OF LOGICAL BLOCKS", length: 32, byte: 28, bit: 0 },
];

commands.push({
    name: "WRITE SAME (32)",
    layout: writeSame32,
    operationCode: 0x7f,
    serviceAction: 0x000d });

// SBC-4 5.52 - WRITE STREAM (16) command
var writeStream16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x9a },
    { name: "Reserved", length: 3, byte: 1, bit: 0 },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "STR_ID", length: 16, byte: 10, bit: 0 },
    { name: "TRANSFER LENGTH", length: 16, byte: 12, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 14, bit: 6 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "WRITE STREAM (16)",
    layout: writeStream16,
    operationCode: 0x9a });

// SBC-4 5.53 - WRITE STREAM (32) command
var writeStream32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x7f },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 16, byte: 2, bit: 0, reserved: true },
    { name: "STR_ID", length: 16, byte: 4, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0, id: true, value: 0x0010 },
    { name: "Reserved", length: 3, byte: 10, bit: 0 },
    { name: "FUA", length: 1, byte: 10, bit: 3 },
    { name: "DPO", length: 1, byte: 10, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 10, bit: 5 },
    { name: "Reserved", length: 8, byte: 11, bit: 0, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 12, bit: 0 },
    { name: "EXPECTED INITIAL LOGICAL BLOCK REFERENCE TAG", length: 32, byte: 20, bit: 0 },
    { name: "EXPECTED LOGICAL BLOCK APPLICATION TAG", length: 16, byte: 24, bit: 0 },
    { name: "LOGICAL BLOCK APPLICATION TAG MASK", length: 16, byte: 26, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 28, bit: 0 },
];

commands.push({
    name: "WRITE STREAM (32)",
    layout: writeStream32,
    operationCode: 0x7f,
    serviceAction: 0x0010 });

// SBC-4 5.54 - WRITE USING TOKEN command
var writeUsingToken = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x83 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0, id: true, value: 0x11 },
    { name: "Reserved", length: 3, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0 },
    { name: "LIST IDENTIFIED", length: 32, byte: 6, bit: 0 },
    { name: "PARAMETER LIST LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 15, bit: 6, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "WRITE USING TOKEN",
    layout: writeUsingToken,
    operationCode: 0x83,
    serviceAction: 0x11 });

// SBC-4 5.55 - XDWRITEREAD (10) command
var xdwriteread10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x53 },
    { name: "XORPINFO", length: 1, byte: 1, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "DISABLE WRITE", length: 1, byte: 1, bit: 2 },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "TRANSFER LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "XDWRITEREAD (10)",
    layout: xdwriteread10,
    operationCode: 0x53 });

// SBC-4 5.56 - XDWRITEREAD (32) command
var xdwriteread32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x7f },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0, id: true, value: 0x0007 },
    { name: "XORPINFO", length: 1, byte: 10, bit: 0 },
    { name: "Obsolete", length: 1, byte: 10, bit: 1, obsolete: true },
    { name: "DISABLE WRITE", length: 1, byte: 10, bit: 2 },
    { name: "FUA", length: 1, byte: 10, bit: 3 },
    { name: "DPO", length: 1, byte: 10, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 10, bit: 5 },
    { name: "Reserved", length: 8, byte: 11, bit: 0, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 12, bit: 0 },
    { name: "Reserved", length: 64, byte: 20, bit: 0, reserved: true },
    { name: "TRANSFER LENGTH", length: 32, byte: 28, bit: 0 },
];

commands.push({
    name: "XDWRITEREAD (32)",
    layout: xdwriteread32,
    operationCode: 0x7f,
    serviceAction: 0x0007 });

// SBC-4 5.57 - XPWRITE (10) command
var xpwrite10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x51 },
    { name: "XORPINFO", length: 1, byte: 1, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "Reserved", length: 1, byte: 1, bit: 2, reserved: true },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "Reserved", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "TRANSFER LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

commands.push({
    name: "XPWRITE (10)",
    layout: xpwrite10,
    operationCode: 0x51 });

// SBC-4 5.58 - XPWRITE (32) command
var xpwrite32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x7f },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 6, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 6, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0, id: true, value: 0x0006 },
    { name: "XORPINFO", length: 1, byte: 10, bit: 0 },
    { name: "Obsolete", length: 1, byte: 10, bit: 1, obsolete: true },
    { name: "Reserved", length: 1, byte: 10, bit: 2, reserved: true },
    { name: "FUA", length: 1, byte: 10, bit: 3 },
    { name: "DPO", length: 1, byte: 10, bit: 4 },
    { name: "Reserved", length: 3, byte: 10, bit: 5, reserved: true },
    { name: "Reserved", length: 8, byte: 11, bit: 0, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 12, bit: 0 },
    { name: "Reserved", length: 64, byte: 20, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 28, bit: 0 },
];

commands.push({
    name: "XPWRITE (32)",
    layout: xpwrite32,
    operationCode: 0x7f,
    serviceAction: 0x0006 });

// SCSI Primary Commands - 4 (SPC-4)

// SPC-4 6.28 - RECEIVE ROD TOKEN INFORMATION command
var receiveRodTokenInformation = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x84 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0, id: true, value: 0x07 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "LIST IDENTIFIER", length: 32, byte: 2, bit: 0 },
    { name: "Reserved", length: 32, byte: 6, bit: 0, reserved: true },
    { name: "ALLOCATION LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "Reserved", length: 8, byte: 14, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

commands.push({
    name: "RECEIVE ROD TOKEN INFORMATION",
    layout: receiveRodTokenInformation,
    operationCode: 0x84,
    serviceAction: 0x07 });

// SPC-4 6.47 - TEST UNIT READY command
var testUnitReady = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0, id: true, value: 0x00 },
    { name: "Reserved", length: 32, byte: 1, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 5, bit: 0 },
];

commands.push({
    name: "TEST UNIT READY",
    layout: testUnitReady,
    operationCode: 0x00 });

/**
 * @param inputArray Array of bytes - the encoded message.
 * @param fieldLength - the length in bits of the field to extract.
 * @param byteOffset - Byte offset at which the field starts.
 * @param bitOffset - Bit offset within the byte at which the field starts.
 *
 */
function getField(inputArray, fieldLength, byteOffset, bitOffset) {
    var startBit = (byteOffset * 8) + bitOffset;
    var endBit = startBit + fieldLength - 1; // -1 is because we want the index of the last bit rather than the number of bits.
    var endByte = parseInt((endBit) / 8);

    if ((endBit + 1) % 8 > 0) {
        endByte++;
    }

    if (endByte < inputArray.length) {
        // Now we know the input array is long enough for use to extract the
        // field from.
        var value = bigInt();
        var bitsDecoded = 0;

        var byteIndex = byteOffset;
        var bitIndex = bitOffset;
        var bitsLeft = fieldLength;

        while (bitsLeft > 0) {
            var bitsAvailableInCurrentByte = (8 - bitIndex);
            var bitsToDecode;
            if (bitsLeft > bitsAvailableInCurrentByte) {
                bitsToDecode = bitsAvailableInCurrentByte;
            } else {
                bitsToDecode = bitsLeft;
            }

            // Now the first part of the decoding - we take the byte at the
            // current byteOffset, and right-shift it by bitOffset bits.  We
            // then need to mask off just bitsToDecode bits of it.
            var bitmask = (1 << bitsToDecode) - 1;
            var v = inputArray[byteIndex];
            v = v >> bitIndex;
            v = v & bitmask;

            // Assume that we decode in MSB -> LSB order, so
            // before ORing in the new value, left-shift the
            // existing value to make space for it.
            value = value.shiftLeft(bitsToDecode).or(v);

            bitsDecoded += bitsToDecode;
            bitsLeft -= bitsToDecode;

            bitIndex += bitsToDecode;
            if (bitIndex > 7) {
                bitIndex = 0;
                byteIndex++;
            }
        }

        return value;
    } else {
        throw new Error("Input truncated");
    }

}

var CDB = function() {
};

CDB.prototype.getField = getField;

CDB.prototype.decode = function(input) {
    var input_array;
    if (input.length % 2 != 0) {
        
    } else  if (input.length > 0) {
        input_array = input.match(/(..?)/g);
        input_array = input_array.map(function(value) {
                return parseInt(value, 16);
            });
    } else {
        input_array = [];
    }

    var output = {
        name: undefined,
        fields: [],
        truncated: false,
    };

    // Extract the Operation Code
    var opCode;

    // We're basically just going to try and decode the input as every message
    // type we can until we find a message definition whose id fields are
    // correct.
    for (var i = 0; i < commands.length; i++) {
        var id_fields = commands[i].layout.filter(function(field) {
            return field.id == true;
        });

        // Now id_fields contains just the fields needed to identify
        // commands[i].  Attempt to decode those fields in a try-catch
        // block - if we can decode all of the id_fields and the decoded
        // values match those expected, we have identifed our message
        // and can go on to decode all of the fields.

        var command;

        try {
            id_fields.forEach(function(field) {
                var value = getField(input_array, field.length, field.byte, field.bit);
                if (value != field.value) {
                    throw new Error();
                }
            });
            command = commands[i];
        } catch (e) {
            continue;
        }

        // If we get here, we've not hit any exceptions.  If command is defined
        // then we have identified our message correctly, and can now decode it.

        if (command != undefined) {

            // We have identified our message correctly, now try and decode it.
            output.name = command.name;
                
            try {
                command.layout.forEach(function(field) {
                    var value = getField(input_array, field.length, field.byte, field.bit);
                    output.fields.push({
                        name: field.name,
                        value: value.toString(16),
                        reserved: field.reserved ? true : false,
                        obsolete: field.obsolete ? true : false,
                    });
                });
            } catch (e) {
                if (/Input truncated/.test(e)) {
                    output.truncated = true;
                } else {
                    console.log("Unknown exception: ", e);
                }
            }
            // And now break out of the for-loop.
            break;
        }
    }

    return output;
}

module.exports = CDB;
