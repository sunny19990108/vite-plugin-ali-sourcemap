import path from "path";
import fs from "fs";

// 读文件夹
export function readDir(dirPath: string) {
  const fileList: string[] = [];
  const handleRead = (dirPathVal: string) => {
    fs.readdirSync(dirPathVal, { withFileTypes: true }).forEach((item) => {
      const filePath = path.join(dirPathVal, item.name);
      if (item.isFile()) {
        fileList.push(filePath);
      } else if (item.isDirectory()) {
        handleRead(filePath);
      }
    });
  };
  try {
    handleRead(dirPath);
    return fileList;
  } catch (err) {
    console.log(err);
  }
}

// 读文件
export function readFile(filePath: string): string | undefined {
  try {
    const buff = fs.readFileSync(filePath);
    return buff.toString();
  } catch (err) {
    console.log(err);
  }
}

// 删除文件
export function delFile(file) {
  fs.unlink(file,function(error){
    if(error){
        console.log(`删除文件${file}失败`, error);
        return false;
    }
  })
}

// 创建和 dist 同级的文件目录
export function mkFileDir(outDirFinal, fileName) {
  fs.mkdir(outDirFinal.split('dist')[0] + fileName, function(error){
    if(error){
        console.log(' 创建和 dist 同级的文件目录失败', error);
        return false;
    }
  });
}

/**
 * 把指定文件移动到指定目录
 * @param outDirFinal 当前绝对路径
 * @param oldFilePath 要移动的文件原绝对路径
 * @param newFileDirName 新文件父文件夹名
 */
 export function transFile(outDirFinal, oldFilePath , newFileDirName) {
  const oldFileName = oldFilePath.split('/')[oldFilePath.split('/').length - 1];
  const newPath = outDirFinal.split('dist')[0] + newFileDirName + '/' + oldFileName;
  fs.rename(oldFilePath, newPath, function(error){
    if(error){
      console.log(`移动${oldFileName}失败`, error);
      return false;
    }
  }) 
  return newPath;
}
