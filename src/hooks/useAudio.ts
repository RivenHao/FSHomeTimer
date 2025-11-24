import { useRef } from 'react';
import Taro from '@tarojs/taro';
import { AudioConfig } from '../config/audio';

/**
 * 音频管理 Hook
 * 负责管理所有音效和背景音乐的播放
 */
export const useAudio = (audioConfig: AudioConfig) => {
  // 使用 ref 存储音频实例，避免重复创建
  const audioInstancesRef = useRef<{
    battleStarting?: Taro.InnerAudioContext;
    tenSeconds?: Taro.InnerAudioContext;
    countdownSwitch?: Taro.InnerAudioContext;
    countdownFinish?: Taro.InnerAudioContext;
    countdownStart?: Taro.InnerAudioContext;
    backgroundMusic?: Taro.InnerAudioContext;
  }>({});

  // 当前音效音量
  const sfxVolumeRef = useRef(audioConfig.defaultVolume.sfx);
  // 当前背景音乐音量
  const bgmVolumeRef = useRef(audioConfig.defaultVolume.bgm);

  /**
   * 预加载所有音频
   * 在比赛开始前调用，确保音频文件已经加载
   */
  const preloadAudio = () => {
    console.log('预加载音频...');
    
    // 预加载音效
    if (!audioInstancesRef.current.battleStarting) {
      audioInstancesRef.current.battleStarting = Taro.createInnerAudioContext();
      audioInstancesRef.current.battleStarting.src = audioConfig.battleStarting;
    }
    
    if (!audioInstancesRef.current.tenSeconds) {
      audioInstancesRef.current.tenSeconds = Taro.createInnerAudioContext();
      audioInstancesRef.current.tenSeconds.src = audioConfig.tenSeconds;
    }
    
    if (!audioInstancesRef.current.countdownSwitch) {
      audioInstancesRef.current.countdownSwitch = Taro.createInnerAudioContext();
      audioInstancesRef.current.countdownSwitch.src = audioConfig.countdownSwitch;
    }
    
    if (!audioInstancesRef.current.countdownFinish) {
      audioInstancesRef.current.countdownFinish = Taro.createInnerAudioContext();
      audioInstancesRef.current.countdownFinish.src = audioConfig.countdownFinish;
    }
    
    if (!audioInstancesRef.current.countdownStart) {
      audioInstancesRef.current.countdownStart = Taro.createInnerAudioContext();
      audioInstancesRef.current.countdownStart.src = audioConfig.countdownStart;
    }
    
    // 预加载背景音乐（如果有）
    // if (audioConfig.backgroundMusic && !audioInstancesRef.current.backgroundMusic) {
    //   audioInstancesRef.current.backgroundMusic = Taro.createInnerAudioContext();
    //   audioInstancesRef.current.backgroundMusic.src = audioConfig.backgroundMusic;
    //   audioInstancesRef.current.backgroundMusic.loop = true; // 循环播放
    // }
  };

  /**
   * 播放音效的通用方法
   */
  const playSound = (audioKey: keyof typeof audioInstancesRef.current) => {
    const audio = audioInstancesRef.current[audioKey];
    if (audio) {
      audio.volume = sfxVolumeRef.current;
      // 如果正在播放，先停止再重新播放
      audio.stop();
      audio.play();
    }
  };

  /**
   * 播放"战斗开始"音效
   * 触发时机：准备阶段最后5秒
   */
  const playBattleStarting = () => {
    console.log('播放: 战斗开始');
    playSound('battleStarting');
  };

  /**
   * 播放"10秒"提醒音效
   * 触发时机：每回合最后11秒
   */
  const playTenSeconds = () => {
    console.log('播放: 10秒提醒');
    playSound('tenSeconds');
  };

  /**
   * 播放"切换选手"音效
   * 触发时机：每回合最后5秒（非最后一轮最后一人）
   */
  const playCountdownSwitch = () => {
    console.log('播放: 切换选手');
    playSound('countdownSwitch');
  };

  /**
   * 播放"比赛结束"音效
   * 触发时机：最后一轮最后一人的最后5秒
   */
  const playCountdownFinish = () => {
    console.log('播放: 比赛结束');
    playSound('countdownFinish');
  };

  /**
   * 播放"倒计时开始"音效
   * 触发时机：间隔时间最后4秒
   */
  const playCountdownStart = () => {
    console.log('播放: 倒计时开始');
    playSound('countdownStart');
  };

  /**
   * 播放背景音乐
   */
  const playBackgroundMusic = () => {
    const bgm = audioInstancesRef.current.backgroundMusic;
    if (bgm) {
      bgm.volume = bgmVolumeRef.current;
      bgm.play();
      console.log('播放背景音乐');
    }
  };

  /**
   * 暂停背景音乐
   */
  const pauseBackgroundMusic = () => {
    const bgm = audioInstancesRef.current.backgroundMusic;
    if (bgm) {
      bgm.pause();
      console.log('暂停背景音乐');
    }
  };

  /**
   * 继续播放背景音乐
   */
  const resumeBackgroundMusic = () => {
    const bgm = audioInstancesRef.current.backgroundMusic;
    if (bgm) {
      bgm.play();
      console.log('继续播放背景音乐');
    }
  };

  /**
   * 停止背景音乐
   */
  const stopBackgroundMusic = () => {
    const bgm = audioInstancesRef.current.backgroundMusic;
    if (bgm) {
      bgm.stop();
      console.log('停止背景音乐');
    }
  };

  /**
   * 设置音效音量
   */
  const setVolume = (volume: number) => {
    sfxVolumeRef.current = volume;
    console.log('设置音效音量:', volume);
  };

  /**
   * 设置背景音乐音量
   */
  const setBgmVolume = (volume: number) => {
    bgmVolumeRef.current = volume;
    const bgm = audioInstancesRef.current.backgroundMusic;
    if (bgm) {
      bgm.volume = volume;
    }
    console.log('设置背景音乐音量:', volume);
  };

  // 返回所有音频控制方法
  return {
    playBattleStarting,
    playTenSeconds,
    playCountdownSwitch,
    playCountdownFinish,
    playCountdownStart,
    playBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    stopBackgroundMusic,
    preloadAudio,
    setVolume,
    setBgmVolume,
  };
};