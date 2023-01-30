export declare function readDir(dirPath: string): string[];
export declare function readFile(filePath: string): string | undefined;
export declare function delFile(file: any): void;
export declare function mkFileDir(outDirFinal: any, fileName: any): Promise<void>;
/**
 * 把指定文件移动到指定目录
 * @param outDirFinal 当前绝对路径
 * @param oldFilePath 要移动的文件原绝对路径
 * @param newFileDirName 新文件父文件夹名
 */
export declare function transFile(outDirFinal: any, oldFilePath: any, newFileDirName: any): Promise<string>;
