// 音频配置 - 使用字符串路径
export const AUDIO_CONFIG = {
  // 音效文件路径（相对路径）
  battleStarting: "https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/audio/timer_battleStarting321.m4a",
  tenSeconds: "https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/audio/timer_10seconds.m4a",
  countdownSwitch: "https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/audio/timer_321switch.m4a",
  countdownFinish: "https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/audio/timer_321finish.m4a",
  countdownStart: "https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/audio/timer_321start.m4a",
  backgroundMusic: 'https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/audio/timer_Madrock.mp3',

  // 默认音量配置
  defaultVolume: {
    sfx: 0.7, // 音效音量
    bgm: 0.3, // 背景音乐音量
  },
};

export type AudioConfig = typeof AUDIO_CONFIG;
