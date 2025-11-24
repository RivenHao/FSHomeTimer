// 声明音频模块
declare module "*.m4a" {
  const src: string;
  export default src;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}

// 声明 JSON 模块（Lottie 动画）
declare module "*.json" {
  const value: any;
  export default value;
}
