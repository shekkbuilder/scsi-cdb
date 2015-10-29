//
// CDB.js
//
// Provides functionality to decode a SCSI CDB.
//

"use strict";

// SBC-4 5.2 - BACKGROUND CONTROL command
var backgroundControl = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "Reserved", length: 6, byte: 2, bit: 0, reserved: true },
    { name: "BO_CTL", length: 2, byte: 2, bit: 6 },
    { name: "BO_TIME", length: 8, byte: 3, bit: 0 },
    { name: "Reserved", length: 88, byte: 4, bit: 0 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

// SBC-4 5.3 - COMPARE AND WRITE command
var compareAndWrite = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Reserved", length: 1, byte: 1, bit: 0, reserved: true },
    { name: "FUA_NV", length: 1, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 2, reserved: true },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "Reserved", length: 24, byte: 10, bit: 0 },
    { name: "NUMBER OF LOGICAL BLOCKS", length: 8, byte: 13, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 14, bit: 0 },
    { name: "Reserved", length: 3, byte: 14, bit: 5 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

// SBC-4 5.4 - FORMAT UNIT command
var formatUnit = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },

    { name: "DEFECT LIST FORMAT", length: 3, byte: 1, bit: 0 },
    { name: "CMPLIST", length: 1, byte: 1, bit: 3 },
    { name: "FMTDATA", length: 1, byte: 1, bit: 4 },
    { name: "LONGLIST", length: 1, byte: 1, bit: 5 },
    { name: "FMTPINFO", length: 2, byte: 1, bit: 6 },

    { name: "Vendor specific", length: 8, byte: 2, bit: 0 },
    { name: "Obsolete", length: 16, byte: 3, bit: 0 },
    { name: "CONTROL", length: 8, byte: 5, bit: 0 },
];

// SBC-4 5.5 - GET LBA STATUS command
var getLbaStatus = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0 },
    { name: "Reserved", length: 3, byte: 1, bit: 5 },
    { name: "STARTING LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "ALLOCATION LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "Reserved", length: 8, byte: 14, bit: 0, reserved: true });
    { name: "CONTROL", length: 8, byte: 15, bit: 0 };
];

// SBC-4 5.6 - GET STREAM STATUS command
var getStreamStatus = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "Reserved", length: 16, byte: 2, bit: 0, reserved: true },
    { name: "STARTING STREAM IDENTIFIED", length: 16, byte: 4, bit: 0 },
    { name: "Reserved", length: 32, byte: 6, bit: 0, reserved: true },
    { name: "ALLOCATION LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "Reserved", length: 8, byte: 14, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 });
];

// SBC-4 5.7 - ORWRITE (16) command
var orwrite16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Reserved", length: 3, byte: 1, bit: 0, reserved: true },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "ORPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "STARTING LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 14, bit: 0 },
    { name: "Reserved", length: 3, byte: 14, bit: 5, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 });
];

// SBC-4 5.8 - ORWRITE (32) command
var orwrite32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "BMOP", length: 3, byte: 2, bit: 0 },
    { name: "Reserved", length: 5, byte: 2, bit: 3, reserved: true },
    { name: "PREVIOUS GENERATION PROCESSING", length: 4, byte: 3, bit: 0 },
    { name: "Reserved", length: 4, byte: 3, bit: 4, reserved: true },
    { name: "Reserved", length: 16, byte: 4, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
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

// SBC-4 5.9 - POPULATE TOKEN command
var populateToken = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "LIST IDENTIFIER", length: 32, byte: 6, bit: 0 },
    { name: "PARAMETER LIST LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 14, bit: 0 },
    { name: "Reserved", length: 3, byte: 14, bit: 5, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 });
];

// SBC-4 5.10 - PRE-FETCH (10) command
var preFetch10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "IMMED", length: 1, byte: 1, bit: 1 },
    { name: "Reserved", length: 6, byte: 1, bit: 2 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "PREFETCH LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.9 - PRE-FETCH (16) command
var preFetch16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "IMMED", length: 1, byte: 1, bit: 1 },
    { name: "Reserved", length: 6, byte: 1, bit: 2 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "PREFETCH LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 14, bit: 0 },
    { name: "Reserved", length: 3, byte: 14, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

// SBC-4 5.10 - PREVENT ALLOW MEDIUM REMOVAL command
var parsePreventAllowMediumRemoval = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Reserved", length: 8, byte: 1, bit: 0, reserved: true },
    { name: "Reserved", length: 8, byte: 2, bit: 0, reserved: true },
    { name: "Reserved", length: 8, byte: 3, bit: 0, reserved: true },
    { name: "PREVENT", length: 2, byte: 4, bit: 0 },
    { name: "Reserved", length: 8, byte: 4, bit: 2, reserved: true },
    { name: "CONTROL",length: 8, byte: 5, bit: 0 },
];

// SBC-4 5.11 - READ (10) command
var read10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "RARC", length: 1, byte: 1, bit: 2 },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "RDPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "TRANSFER LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.12 - READ (12) command
var read12 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "RARC", length: 1, byte: 1, bit: 2 },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "RDPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 6, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 10, bit: 0 },
    { name: "Reserved", length: 2, byte: 10, bit: 5, reserved: true },
    { name: "Restricted for MMC-6", length: 1, byte: 10, bit: 7 },
    { name: "CONTROL", length: 8, byte: 11, bit: 0 },
];

// SBC-4 5.13 - READ (16) command
var read16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Reserved", length: 1, byte: 1, bit: 0, reserved: true },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "RARC", length: 1, byte: 1, bit: 2 },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "RDPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 14, bit: 5, reserved: true },
    { name: "Restricted for MMC-6", length: 1, byte: 14, bit: 7 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
]];

// SBC-4 5.14 - READ (32) command
var read32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0 },
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

// SBC-4 5.15 - READ CAPACITY (10) command
var readCapacity10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "Reserved", length: 7, byte: 1, bit: 1, reserved: true });
    { name: "Obsolete", length: 32, byte: 2, bit: 0, obsolete: true },
    { name: "Reserved", length: 16, byte: 6, bit: 0, reserved: true },
    { name: "Obsolete", length: 1, byte: 8, bit: 0, obsolete: true },
    { name: "Reserved", length: 7, byte: 8, bit: 1, reserved: true },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.16 - READ CAPACITY (16) command
var readCapacity16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0 },
    { name: "Reserved", length: 1, byte: 1, bit: 5, reserved: true },
    { name: "Obsolete", length: 64, byte: 2, bit: 0, obsolete: true },
    { name: "ALLOCATION LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "Obsolete", length: 1, byte: 14, bit: 0, obsolete: true },
    { name: "Reserved", length: 7, byte: 14, bit: 1, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

// SBC-4 5.17 - READ DEFECT DATA (10) command
var readDefectData10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Reserved", length: 8, byte: 1, bit: 0, reserved: true },
    { name: "DEFECT LIST_FORMAT", length: 3, byte: 2, bit: 0 },
    { name: "REQ_GLIST", length: 1, byte: 2, bit: 3 },
    { name: "REQ_PLIST", length: 1, byte: 2, bit: 4 },
    { name: "Reserved", length: 3, byte: 2, bit: 5 },
    { name: "Reserved", length: 32, byte: 3, bit: 0, reserved: true },
    { name: "ALLOCATION LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.18 - READ DEFECT DATA (12) command
var readDefectData12 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "DEFECT LIST FORMAT", length: 3, byte: 1, bit: 0 },
    { name: "REQ_GLIST", length: 1, byte: 1, bit: 3 },
    { name: "REQ_PLIST", length: 1, byte: 1, bit: 4 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "ADDRESS DESCRIPTOR INDEX", length: 32, byte: 2, bit: 0 },
    { name: "ALLOCATION LENGTH", length: 32, byte: 6, bit: 0 },
    { name: "Reserved", length: 8, byte: 10, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 11, bit: 0 },
];

// SBC-4 5.19 - READ LONG (10) command
var readLong10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1; bit: 0, obsolete: true },
    { name: "CORRCT", length: 1, byte: 1, bit: 1 },
    { name: "PBLOCK", length: 1, byte: 1, bit: 2 },
    { name: "Reserved", length: 5, byte: 1, bit: 3, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "Reserved", length: 8, byte: 6, bit: 0, reserved: true },
    { name: "BYTE TRANSFER LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, bytes: 9, bit: 0 },
];

// SBC-4 5.20 - READ LONG (16) command
var readLong16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "Reserved", length: 16, byte: 10, bit: 0, reserved: true },
    { name: "BYTE TRANSFER LENGTH", byte: 12, bit: 0 },
    { name: "CORRCT", length: 1, byte: 14, bit: 0 },
    { name: "PBLOCK", length: 1, byte: 14, bit: 1 },
    { name: "Reserved", length: 6, byte: 14, bit: 2 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

// SBC-4 5.21 - REASSIGN BLOCKS command
var reassignBlocks = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "LONGLIST", length: 1, byte: 1, bit: 0 },
    { name: "LONGLBA", length: 1, byte: 1, bit: 1 },
    { name: "Reserved", length: 6, byte: 1, bit: 2, reserved: true },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 5, bit: 0 },
];

// SPC-4 6.28 - RECEIVE ROD TOKEN INFORMATION command
var receiveRodTokenInformation = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "LIST IDENTIFIER", length: 32, byte: 2, bit: 0 },
    { name: "Reserved", length: 32, byte: 6, bit: 0, reserved: true },
    { name: "ALLOCATION LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "Reserved", length: 8, byte: 14, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

// SBC-4 5.23 - REPORT REFERRALS command
var reportReferrals = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0 },
    { name: "Reserved", length: 3, byte: 1, bit: 5, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "ALLOCATION LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "ONE_SEG", length: 1, byte: 14, bit: 0 },
    { name: "Reserved", length: 7, byte: 14, bit: 1 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

// SBC-4 5.24 - SANITIZE command
var sanitize = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0 },
    { name: "AUSE", length: 1, byte: 1, bit: 5 },
    { name: "Reserved", length: 1, byte: 1, bit: 6 },
    { name: "IMMED", length: 1, byte: 1, bit: 7 },
    { name: "Reserved", length: 40, byte: 2, bit: 0, reserved: true },
    { name: "PARAMETER LIST LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.25 - START STOP UNIT command
var startStopUnit = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "IMMED", length: 1, byte: 1, bit: 0 },
    { name: "Reserved", length: 7, byte: 1, bit: 1 },
    { name: "Reserved", length: 8, byte: 2, bit: 0 },
    { name: "POWER CONDITION MODIFIER", length: 4, byte: 3, bit: 0 },
    { name: "Reserved", length: 4, byte: 4, bit: 4 },
    { name: "CONTROL", length: 8, byte: 5, bit: 0 },
];

// SBC-4 5.26 - SYNCHRONIZE CACHE (10) command
var synchronizeCache10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "IMMED", length: 1, byte: 1, bit: 1 },
    { name: "Obsolete", length: 1, byte: 1, bit: 2, obsolete: true },
    { name: "Reserved", length: 5, byte: 1, bit: 3, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5 },
    { name: "NUMBER OF LOGICAL BLOCKS", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.27 - SYNCHRONIZE CACHE (16) command
var synchronizeCache16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Reserved", length: 1, byte: 1, bit: 0, reserved: true },
    { name: "IMMED", length: 1, byte: 1, bit: 1 },
    { name: "Obsolete", length: 1, byte: 1, bit: 2, obsolete: true },
    { name: "Reserved", length: 5, byte: 1, bit: 3, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "NUMBER OF LOGICAL BLOCKS", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 14, bit: 0 },
    { name: "Reserved", length: 3, byte: 14, bit: 5 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

// SBC-4 5.28 - UNMAP command
var unmap = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "ANCHOR", length: 1, byte: 1, bit: 0 },
    { name: "Reserved", length: 7, byte: 1, bit: 1, reserved: true },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5 },
    { name: "PARAMETER LIST LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.29 - VERIFY (10) command
var verify10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "BYTCHK", length: 2, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "VRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 2, byte: 6, bit: 5, reserved: true },
    { name: "Restricted for MMC-6", length: 1, byte: 6, bit: 7, reserved: true },
    { name: "VERIFICATION LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.30 - VERIFY (12) command
var verify12 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "BYTCHK", length: 2, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "VRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "VERIFICATION LENGTH", length: 32, byte: 6, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 10, bit: 0 },
    { name: "Reserved", length: 2, byte: 10, bit: 5, reserved: true },
    { name: "Restricted for MMC-6", length: 1, byte: 10, bit: 7 },
    { name: "CONTROL", length: 8, byte: 11, bit: 0 },
];

// SBC-4 5.31 - VERIFY (16) command
var verify16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Reserved", length: 1, byte: 1, bit: 0, reserved: true },
    { name: "BYTCHK", length: 2, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "VRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "VERIFICATION LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 14, bit: 5, reserved: true },
    { name: "Restricted for MMC-6", length: 1, byte: 14, bit: 7 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

// SBC-4 5.32 - VERIFY (32) command
var verify32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0 },
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

// SBC-4 5.33 - WRITE (10) command
var write10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "Reserved", length: 1, byte: 1, bit: 2, reserved: true },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "TRANSFER LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.34 - WRITE (12) command
var write12 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "Reserved", length: 1, byte: 1, bit: 2, reserved: true },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 6, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 10, bit: 0 },
    { name: "Reserved", length: 2, byte: 10, bit: 5, reserved: true },
    { name: "Restricted for MMC-6", length: 1, byte: 10, bit: 7 },
    { name: "CONTROL", length: 8, byte: 11, bit: 0 },
];

// SBC-4 5.35 - WRITE (16) command
var write16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Reserved", length: 1, byte: 1, bit: 0, reserved: true },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "Reserved", length: 1, byte: 1, bit: 2, reserved: true },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 14, bit: 5, reserved: true },
    { name: "Restricted for MMC-6", length: 1, byte: 14, bit: 7 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

// SBC-4 5.36 - WRITE (32) command
var write32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0 },
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

// SBC-4 5.37 - WRITE AND VERIFY (10) command
var writeAndVerify10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "BYTCHK", length: 2, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 3, reserved: true },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "TRANSFER LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.38 - WRITE AND VERIFY (12) command
var writeAndVerify12 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "BYTCHK", length: 2, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 3, reserved: true },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 6, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 10, bit: 0 },
    { name: "Reserved", length: 2, byte: 10, bit: 5, reserved: true },
    { name: "Restricted for MMC-6", length: 1, byte: 10, bit: 7 },
    { name: "CONTROL", length: 8, byte: 11, bit: 0 },
];

// SBC-4 5.39 - WRITE AND VERIFY (16) command
var writeAndVerify16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Reserved", length: 1, byte: 1, bit: 0, reserved: true },
    { name: "BYTCHK", length: 2, byte: 1, bit: 1 },
    { name: "Reserved", length: 1, byte: 1, bit: 3, reserved: true },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "TRANSFER LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 14, bit: 0 },
    { name: "Reserved", length: 2, byte: 14, bit: 5, reserved: true },
    { name: "Restricted for MMC-6", length: 1, byte: 14, bit: 7 },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
]];

// SBC-4 5.40 - WRITE AND VERIFY (32) command
var writeAndVerify32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0 },
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

// SBC-4 5.41 - WRITE LONG (10) command
var writeLong10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 0, obsolete: true },
    { name: "Reserved", length: 4, byte: 1, bit: 1, reserved: true },
    { name: "PBLOCK", length: 1, byte: 1, bit: 5 },
    { name: "WR_UNCOR", length: 1, byte: 1, bit: 6 },
    { name: "COR_DIS", length: 1, byte: 1, bit: 7 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "Reserved", length: 8, byte: 6, bit: 0, reserved: true },
    { name: "BYTE TRANSFER LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.42 - WRITE LONG (16) command
var writeLong16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0 },
    { name: "PBLOCK", length: 1, byte: 1, bit: 5 },
    { name: "WR_UNCOR", length: 1, byte: 1, bit: 6 },
    { name: "COR_DIS", length: 1, byte: 1, bit: 7 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "Reserved", length: 16, byte: 10, bit: 0, reserved: true },
    { name: "BYTE TRANSFER LENGTH", length: 16, byte: 12, bit: 0 },
    { name: "Reserved", length: 16, byte: 14, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

// SBC-4 5.43 - WRITE SAME (10) command
var writeSame10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Obsolete", length: 3, byte: 1, bit: 0, obsolete: true },
    { name: "UNMAP", length: 1, byte: 1, bit: 3 },
    { name: "ANCHOR", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "NUMBER OF LOGICAL BLOCKS", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.44 - WRITE SAME (16) command
var writeSame16 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "NDOB", length: 1, byte: 1, bit: 0 },
    { name: "Obsolete", length: 2, byte: 1, bit: 1, obsolete: true },
    { name: "UNMAP", length: 1, byte: 1, bit: 3 },
    { name: "ANCHOR", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 64, byte: 2, bit: 0 },
    { name: "NUMBER OF LOGICAL BLOCKS", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 14, bit: 0 },
    { name: "Reserved", length: 3, byte: 15, bit: 5, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

// SBC-4 5.45 - WRITE SAME (32) command
var writeSame32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0 },
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

// SBC-4 5.46 - WRITE USING TOKEN command
var writeUsingToken = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "SERVICE ACTION", length: 5, byte: 1, bit: 0 },
    { name: "Reserved", length: 3, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0 },
    { name: "LIST IDENTIFIED", length: 32, byte: 6, bit: 0 },
    { name: "PARAMETER LIST LENGTH", length: 32, byte: 10, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 14, bit: 0 },
    { name: "Reserved", length: 3, byte: 15, bit: 5, reserved: true },
    { name: "CONTROL", length: 8, byte: 15, bit: 0 },
];

// SBC-4 5.47 - XDWRITEREAD (10) command
var xdwriteread10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "XORPINFO", length: 1, byte: 1, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "DISABLE WRITE", length: 1, byte: 1, bit: 2 },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "WRPROTECT", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "TRANSFER LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.56 - XDWRITEREAD (32) command
var xdwriteread32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0 },
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

// SBC-4 5.57 - XPWRITE (10) command
var xpwrite10 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "XORPINFO", length: 1, byte: 1, bit: 0 },
    { name: "Obsolete", length: 1, byte: 1, bit: 1, obsolete: true },
    { name: "Reserved", length: 1, byte: 1, bit: 2, reserved: true },
    { name: "FUA", length: 1, byte: 1, bit: 3 },
    { name: "DPO", length: 1, byte: 1, bit: 4 },
    { name: "Reserved", length: 3, byte: 1, bit: 5 },
    { name: "LOGICAL BLOCK ADDRESS", length: 32, byte: 2, bit: 0 },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "TRANSFER LENGTH", length: 16, byte: 7, bit: 0 },
    { name: "CONTROL", length: 8, byte: 9, bit: 0 },
];

// SBC-4 5.58 - XPWRITE (32) command
var xpwrite32 = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "CONTROL", length: 8, byte: 1, bit: 0 },
    { name: "Reserved", length: 32, byte: 2, bit: 0, reserved: true },
    { name: "GROUP NUMBER", length: 5, byte: 6, bit: 0 },
    { name: "Reserved", length: 3, byte: 6, bit: 5, reserved: true },
    { name: "ADDITIONAL CDB LENGTH", length: 8, byte: 7, bit: 0 },
    { name: "SERVICE ACTION", length: 16, byte: 8, bit: 0 },
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




var testUnitReady = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Reserved", length: 32, byte: 1, bit: 0, reserved: true },
    { name: "CONTROL", length: 8, byte: 5, bit: 0 },
];

function parseMessage(input, layout) {
    var fields = [];

    try {
        layout.forEach(function(field) {
            // Need to work out the index of the last byte of the current field
            // and see if the input is long enough to decode it fully.  If it is
            // not then we exit.
            var last_bit_index = (field.byte * 8) + field.bit + (field.length - 1);
            var last_byte_index = parseInt(last_bit_index / 8);

            if (last_byte_index < input.length) {
                var value = 0;
                var value_bitlength = 0; // Number of valid bits in value

                // At this point we are guaranteed to be able to extract
                // the field from the input array.

                var bits_left = field.length;

                var byte_index = field.byte;
                var bit_index = field.bit;

                while (bits_left > 0) {
                    var v = 0;

                    // The number of bits we will extract this time around
                    var v_bitlength = 0;

                    var bits_available_in_current_byte = (8 - bit_index);

                    if (bits_left <= bits_available_in_current_byte) {
                        v_bitlength = bits_left;
                    } else {
                        v_bitlength = bits_available_in_current_byte;
                    }

                    var bitmask = 0;

                    if (v_bitlength == 1) { bitmask = 0x01; }
                    if (v_bitlength == 2) { bitmask = 0x03; }
                    if (v_bitlength == 3) { bitmask = 0x07; }
                    if (v_bitlength == 4) { bitmask = 0x0f; }
                    if (v_bitlength == 5) { bitmask = 0x1f; }
                    if (v_bitlength == 6) { bitmask = 0x3f; }
                    if (v_bitlength == 7) { bitmask = 0x7f; }
                    if (v_bitlength == 8) { bitmask = 0xff; }

                    // Now we can right-shift the byte at byte_index
                    // by bit_index, then mask the resulting value with
                    // bitmask to give the value that we are extracting
                    // from byte_index.
                    v = (input[byte_index] >> bit_index) & bitmask;

                    // Assume that we decode in MSB -> LSB order, so
                    // before ORing in the new value, left-shift the
                    // existing value to make space for it.
                    value = (value << v_bitlength) | v;

                    value_bitlength += v_bitlength;
                    bits_left -= v_bitlength;

                    bit_index += v_bitlength;
                    if (bit_index > 7) {
                        bit_index = 0;
                        byte_index++;
                    }
                }
                var f = { name: field.name, value: value };
                if (field.reserved) {
                    f.reserved = field.reserved;
                }
                if (field.obsolete) {
                    f.obsolete = field.obsolete;
                }
                f);
            } else {
                throw "Message Truncated";
            }
        });
        return { fields: fields, truncated: false };
    } catch(e) {
        return { fields: fields, truncated: true };
    }
}

var parseTestUnitReady = [
    { name: "OPERATION CODE", length: 8, byte: 0, bit: 0 },
    { name: "Reserved", value: (encodedCdb[1] << 24) | (encodedCdb[2] << 16) | (encodedCdb[3] << 8) | encodedCdb[4], reserved: true });
    { name: "CONTROL", value: encodedCdb[5] });
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

function parseTestUnitReady(input) {
    
}

var CDB = function() {
};

function parseInt16(value) {
    return parseInt(value, 16);
}

CDB.prototype.decode = function(input) {
    if (input.length == 0) {
        return { truncated: true };
    } else {

        var input_array = input.split(" ");
        input_array = input_array.map(function(value) {
                return parseInt(value, 16);
            });

        var opcode = input_array[0];
        var service_action;

        for (var i = 0; i < service_action_info.length; i++) {
            if (service_action_info[i].opcode == opcode) {
                service_action = get_field(input_array,
                                           service_action_info[i].byte_offset,
                                           service_action_info[i].byte_length,
                                           service_action_info[i].bitmask);
                break;
            }
        }

        // Identify the message type based on the OpCode and optional
        // Service Action.
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

        var parser_output = parseMessage(input_array, testUnitReady);


        var output = {
            name: name,
            fields: parser_output.fields,
            truncated: parser_output.truncated,
        };

        return output;
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
CDB.prototype.parse = function(encodedCdb)
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

      // Check for truncation - complicated.
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
