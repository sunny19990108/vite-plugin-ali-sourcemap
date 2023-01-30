"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("../util/file");
const path_1 = __importDefault(require("path"));
async function testReadDir() {
    const fileList = await (0, file_1.readDir)(path_1.default.resolve(__dirname, ".."));
    if (fileList.includes(path_1.default.resolve(__dirname, "utils.spec.js")) &&
        fileList.includes(path_1.default.resolve(__dirname, "..", "client.js"))) {
        console.log("pass");
    }
    else {
        console.log("fail: utils=>readDir");
    }
}
function testReadFile() {
    const file = (0, file_1.readFile)(__dirname + "/utils.spec.js");
    if (file.includes("testReadFile")) {
        console.log("pass");
    }
    else {
        console.log("fail: utils=>readFile");
    }
}
function default_1() {
    testReadDir();
    testReadFile();
}
exports.default = default_1;
