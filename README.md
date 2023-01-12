# vite-plugin-ali-sourcemap

基于 https://next.api.aliyun.com/api/ARMS/2019-08-08/Upload?lang=TYPESCRIPT&params={}
自动上传 sourcemap 到 阿里 ARMS

通过 vite 的自带钩子 configResolved 获取到打包后的路径,
在 closeBundle 钩子 自动遍历指定路径下的.map 文件， 并上传到阿里云 arms 的 source map 列表中

抛出一个方法， 接收参数：config: ConfigType

```typescript
// 其他选项去这个包 @alicloud/openapi-client,
type ClientConfigType = {
  accessKeyId: string; // https://usercenter.console.aliyun.com/
  accessKeySecret: string;
  regionId?: string; // 默认 cn-beijing
  [key: string]: any;
};
// 其他选项在@alicloud/arms20190808
type UploadDefaultConfigType = {
  pid: string; //应用ID
  [key: string]: any;
};

type ConfigType = {
  clientConfig: ClientConfigType;
  uploadDefaultConfig: UploadDefaultConfigType;
  maxRetryTimes?: number; //上传失败后重试次数，默认六次
  disabled?: boolean; // 是否上传， 默认是
  deleteSourceFile?: boolean; // 上传后是否删除源文件，默认是
};
```

注意文件大小， 太大了传不上去， 要分包



有问题联系：18332651783(微信)


