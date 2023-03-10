import fs from "fs";
import { readDir, readFile, delFile, mkFileDir, transFile } from "./file";
import Client, { ClientConfigType, UploadDefaultConfigType } from "../client";
export type ConfigType = {
  clientConfig: ClientConfigType;
  uploadDefaultConfig: UploadDefaultConfigType;
  maxRetryTimes?: number;
  disabled?: boolean;
  deleteSourceFile?: boolean;
  uploadPath?: string;
};

// 兜底， 最大重试次数
let maxRetryTimesVal = 3;
export default async function (
  { clientConfig, uploadDefaultConfig, maxRetryTimes, disabled = false, deleteSourceFile = true, uploadPath = '' }: ConfigType,
  outDirFinal: string
) {
  const { accessKeyId, accessKeySecret } = clientConfig;
  const { pid } = uploadDefaultConfig;
  if (!accessKeyId || !accessKeySecret || !pid) {
    console.log("请输入必填项");
    return;
  }
  if (!fs.existsSync(outDirFinal)) {
    console.log("path is not exists");
    return;
  }
  if (disabled) {
    return;
  }
  if (typeof maxRetryTimes === "number") {
    maxRetryTimesVal = maxRetryTimes;
  }
  console.log("start time:", new Date().toISOString());

  const uploadFilePath = outDirFinal+ '/' + uploadPath;
  
  let allMapFiles = (await readDir(uploadFilePath))?.filter((file) =>
    file.endsWith(".map")
  );

  console.log("allMapFiles:", uploadFilePath, allMapFiles?.length);

  if(deleteSourceFile) {
    await mkFileDir(outDirFinal, 'sourcemap');
    const newMapFiles: string[] = [];
    await allMapFiles?.forEach(async (item) => {
      const path = await transFile(outDirFinal, item , 'sourcemap');
      if(path) {
        newMapFiles.push(path);
      }
    })

    allMapFiles = newMapFiles;
    console.log("移动后文件:", allMapFiles?.length , allMapFiles?.[0]);
  }

  const uploadClient = new Client(clientConfig, uploadDefaultConfig);
  // allMapFiles.forEach(file => {
  //   const fileData = readFile(outDirFinal + "/" + file);
  //   uploadClient.main({ fileName: file, file: fileData });
  //   console.log(new Date().toISOString());
  // });
  // return;

  // 上面可能会触发阿里云风控，端口调用限制，
  // 处理方案是一个一个上传， 触发风控后就让未上传的列表等等， 5秒后继续
  let laterList = [];
  let retryInfo: { [key: string]: number } = {};

  const handleUpload = (fileList: string[], index: number) => {
    if (index > fileList.length - 1) return;

    const filePath = fileList[index];
    const pathArr = filePath.split("/");
    const fileName = pathArr[pathArr.length - 1];

    const fileData = readFile(filePath);
    uploadClient
      .main({ fileName, file: fileData })
      .then(() => {
        console.log(`'${fileName}' upload success`);
        if (index < fileList.length - 1) {
          handleUpload(fileList, index + 1);
        } else {
          console.log("end time:", new Date().toISOString());
        }
      })
      .catch((err) => {
        console.log(err);
        laterList = fileList.slice(index);
        retryInfo[fileName] = retryInfo[fileName] ? retryInfo[fileName] + 1 : 1;
        // 同一个文件阻塞最大次数， 跳过
        if (retryInfo[fileName] >= maxRetryTimesVal) {
          console.log("failed upload: " + fileName);
          index < fileList.length - 1 && handleUpload(laterList, 1);
          return;
        }
        console.log("wait 5 sec...");
        setTimeout(() => {
          handleUpload(laterList, 0);
        }, 1000 * 5);
      })
  };

  handleUpload(allMapFiles, 0);
}
