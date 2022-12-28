import path from "path";
import { Plugin } from "vite";
import handleUpload, { ConfigType } from "./util/upload";

export default function pluginConfig(config: ConfigType): Plugin {
  let outDirFinal: string;

  return {
    name: "@vite-plugin-ali-sourcemap",
    apply: "build",
    configResolved(resolvedConfig) {
      // 获取打包文件夹路径
      const { root } = resolvedConfig;
      const { outDir } = resolvedConfig.build;
      outDirFinal = path.resolve(root, outDir);
    },
    closeBundle() {
      handleUpload(config, outDirFinal);
    },
  };
}
