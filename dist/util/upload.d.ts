import { ClientConfigType, UploadDefaultConfigType } from "../client";
export type ConfigType = {
    clientConfig: ClientConfigType;
    uploadDefaultConfig: UploadDefaultConfigType;
    maxRetryTimes?: number;
    disabled?: boolean;
    deleteSourceFile?: boolean;
    uploadPath?: string;
};
export default function ({ clientConfig, uploadDefaultConfig, maxRetryTimes, disabled, deleteSourceFile, uploadPath }: ConfigType, outDirFinal: string): Promise<void>;
