"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transFile = exports.mkFileDir = exports.delFile = exports.readFile = exports.readDir = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// 读文件夹
function readDir(dirPath) {
    console.log('dirPath', dirPath);
    const fileList = [];
    const handleRead = (dirPathVal) => {
        fs_1.default.readdirSync(dirPathVal, { withFileTypes: true }).forEach((item) => {
            const filePath = path_1.default.join(dirPathVal, item.name);
            if (item.isFile()) {
                fileList.push(filePath);
            }
            else if (item.isDirectory()) {
                handleRead(filePath);
            }
        });
    };
    try {
        handleRead(dirPath);
        console.log("fileList", fileList);
        return fileList;
    }
    catch (err) {
        console.log(err);
    }
}
exports.readDir = readDir;
// 读文件 File这个参数要传UTF-8格式编码的string字符串类型
function readFile(filePath) {
    try {
        const buff = fs_1.default.readFileSync(filePath, 'utf-8');
        return buff;
    }
    catch (err) {
        console.log(err);
    }
}
exports.readFile = readFile;
// 删除文件
function delFile(file) {
    fs_1.default.unlink(file, function (error) {
        if (error) {
            console.log(`删除文件${file}失败`, error);
            return false;
        }
    });
}
exports.delFile = delFile;
// 创建和 dist 同级的文件目录
async function mkFileDir(outDirFinal, fileName) {
    fs_1.default.mkdir(outDirFinal.split('dist')[0] + fileName, function (error) {
        if (error) {
            console.log(' 创建和 dist 同级的文件目录失败', error);
            return false;
        }
    });
}
exports.mkFileDir = mkFileDir;
/**
 * 把指定文件移动到指定目录
 * @param outDirFinal 当前绝对路径
 * @param oldFilePath 要移动的文件原绝对路径
 * @param newFileDirName 新文件父文件夹名
 */
async function transFile(outDirFinal, oldFilePath, newFileDirName) {
    const oldFileName = oldFilePath.split('/')[oldFilePath.split('/').length - 1];
    const newPath = outDirFinal.split('dist')[0] + newFileDirName + '/' + oldFileName;
    fs_1.default.rename(oldFilePath, newPath, function (error) {
        if (error) {
            console.log(`移动${oldFileName}失败`, error);
            return false;
        }
    });
    return newPath;
}
exports.transFile = transFile;
