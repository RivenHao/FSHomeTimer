import { View, Text, Image, Slider } from '@tarojs/components';
import { useState, useEffect, useRef } from 'react';
import Taro, { useLoad } from '@tarojs/taro';
import { useAudio } from '../../hooks/useAudio';
import { AUDIO_CONFIG } from '../../config/audio';
import { TimerConfig, Phase, StatusInfo } from '../../types/timer';
import './index.scss';

export default function Timer() {
  // ========== 配置参数 ==========
  const [config, setConfig] = useState<TimerConfig>({
    participants: 2,
    rounds: 3,
    roundTime: 30,
    prepTime: 10,
    intervalTime: 0
  });

  // 用于显示的音量值（0-100）
  const [displaySfxVolume, setDisplaySfxVolume] = useState(70);
  const [displayBgmVolume, setDisplayBgmVolume] = useState(30);

  // ========== 计时器状态 ==========
  const [currentRound, setCurrentRound] = useState(1);
  const [currentParticipant, setCurrentParticipant] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [phase, setPhase] = useState<Phase>('prep');
  const [isPaused, setIsPaused] = useState(false);

  // ========== Refs ==========
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioTriggeredRef = useRef<{ [key: string]: boolean }>({});
  const isPausedRef = useRef(isPaused);

  // 使用 ref 来跟踪最新的状态值
  const phaseRef = useRef<Phase>(phase);
  const roundRef = useRef(currentRound);
  const participantRef = useRef(currentParticipant);
  const configRef = useRef<TimerConfig>(config);

  // ========== 同步 ref 和 state ==========
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    roundRef.current = currentRound;
  }, [currentRound]);

  useEffect(() => {
    participantRef.current = currentParticipant;
  }, [currentParticipant]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // ========== 音频管理 ==========
  const {
    playBattleStarting,
    playTenSeconds,
    playCountdownStart,
    playCountdownSwitch,
    playCountdownFinish,
    playBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    stopBackgroundMusic,
    preloadAudio,
    setVolume,
    setBgmVolume: setAudioBgmVolume,
  } = useAudio(AUDIO_CONFIG);

  // ========== 页面加载时获取参数 ==========
  useLoad((options) => {
    console.log('Timer 页面加载，参数：', options);

    // 从 URL 参数中获取配置
    const newConfig: TimerConfig = {
      participants: parseInt(options.participants || '2'),
      rounds: parseInt(options.rounds || '3'),
      roundTime: parseInt(options.roundTime || '30'),
      prepTime: parseInt(options.prepTime || '10'),
      intervalTime: parseInt(options.intervalTime || '0')
    };

    const newSfxVolume = parseInt(options.sfxVolume || '70');
    const newBgmVolume = parseInt(options.bgmVolume || '30');

    setConfig(newConfig);
    
    // 设置音量显示值（0-100）
    setDisplaySfxVolume(newSfxVolume);
    setDisplayBgmVolume(newBgmVolume);

    // 初始化计时器状态
    setCurrentRound(1);
    setCurrentParticipant(1);
    setCurrentTime(newConfig.prepTime);
    setPhase('prep');
    setIsPaused(false);

    // 重置音频触发标记
    audioTriggeredRef.current = {};

    // 预加载音频
    preloadAudio();

    // 设置音量（转换为 0-1 的小数）
    setVolume(newSfxVolume / 100);
    setAudioBgmVolume(newBgmVolume / 100);

    // 稍后播放背景音乐
    setTimeout(() => {
      playBackgroundMusic();
    }, 100);

    // 设置屏幕常亮
    Taro.setKeepScreenOn({
      keepScreenOn: true,
      success: () => console.log('屏幕保持常亮'),
      fail: () => console.log('设置屏幕常亮失败')
    });

    // 启动定时器
    timerRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrentTime(prev => {
          const newTime = prev - 1;

          // 时间到了，切换阶段
          if (newTime <= 0) {
            setTimeout(() => {
              handlePhaseTransition();
            }, 0);
            return 0;
          }

          return newTime;
        });
      }
    }, 1000);
  });

  // ========== 计时器核心逻辑 ==========

  /**
   * 处理阶段转换
   */
  const handlePhaseTransition = () => {
    const currentPhase = phaseRef.current;
    const currentRoundNum = roundRef.current;
    const currentParticipantNum = participantRef.current;
    const currentConfig = configRef.current;

    console.log('阶段转换:', { currentPhase, currentRoundNum, currentParticipantNum, currentConfig });

    // 1. 准备阶段结束 → 第1轮第1人
    if (currentPhase === 'prep') {
      console.log('准备阶段结束 → 第1轮第1人');
      setPhase('round');
      setCurrentTime(currentConfig.roundTime);
      return;
    }

    // 2. 回合阶段
    if (currentPhase === 'round') {
      // 2.1 不是最后一个玩家 → 下一个玩家
      if (currentParticipantNum < currentConfig.participants) {
        console.log(`第${currentRoundNum}轮第${currentParticipantNum}人结束 → 第${currentParticipantNum + 1}人`);
        setCurrentParticipant(currentParticipantNum + 1);
        setCurrentTime(currentConfig.roundTime);
        return;
      }

      // 2.2 是最后一个玩家
      // 2.2.1 不是最后一轮
      if (currentRoundNum < currentConfig.rounds) {
        console.log(`第${currentRoundNum}轮结束 → 进入间隔或第${currentRoundNum + 1}轮`);
        setCurrentParticipant(1);

        // 如果有间隔时间 → 进入间隔阶段
        if (currentConfig.intervalTime > 0) {
          setPhase('interval');
          setCurrentTime(currentConfig.intervalTime);
        } else {
          // 没有间隔时间 → 直接进入下一轮
          setCurrentRound(currentRoundNum + 1);
          setCurrentTime(currentConfig.roundTime);
        }
        return;
      }

      // 2.2.2 最后一轮最后一个玩家 → 完成
      console.log('比赛完成！');
      complete();
      return;
    }

    // 3. 间隔阶段结束 → 下一轮第1人
    if (currentPhase === 'interval') {
      console.log(`间隔结束 → 第${currentRoundNum + 1}轮第1人`);
      setPhase('round');
      setCurrentRound(currentRoundNum + 1);
      setCurrentParticipant(1);
      setCurrentTime(currentConfig.roundTime);
      return;
    }
  };

  /**
   * 完成比赛
   */
  const complete = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    stopBackgroundMusic();

    // 取消屏幕常亮
    Taro.setKeepScreenOn({
      keepScreenOn: false
    });

    // 跳转到完成页面
    Taro.redirectTo({
      url: '/pages/completed/index'
    });
  };

  /**
   * 暂停/继续
   */
  const togglePause = () => {
    setIsPaused(prev => {
      const newPausedState = !prev;

      if (newPausedState) {
        pauseBackgroundMusic();
      } else {
        resumeBackgroundMusic();
      }

      return newPausedState;
    });
  };

  /**
   * 重置 - 返回配置页
   */
  const reset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    stopBackgroundMusic();

    // 取消屏幕常亮
    Taro.setKeepScreenOn({
      keepScreenOn: false
    });

    // 返回配置页
    Taro.navigateBack();
  };

  /**
   * 格式化时间显示
   */
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * 获取状态信息
   */
  const getStatusInfo = (): StatusInfo => {
    switch (phase) {
      case 'prep':
        return {
          title: '准备阶段',
          detail: ''
        };
      case 'round':
        return {
          title: `第 ${currentRound} 轮 - 第 ${currentParticipant} 位选手`,
          detail: ''
        };
      case 'interval':
        return {
          title: `第 ${currentRound} 轮结束`,
          detail: ''
        };
      default:
        return { title: '', detail: '' };
    }
  };

  // ========== 音效触发逻辑 ==========
  useEffect(() => {
    if (isPaused) return;

    const audioKey = `${phase}-${currentRound}-${currentParticipant}-${currentTime}`;

    // 避免重复触发
    if (audioTriggeredRef.current[audioKey]) return;

    // 1. Battle Starting: 首轮准备时间最后5秒时播放
    if (phase === 'prep' && currentTime === 5) {
      playBattleStarting();
      audioTriggeredRef.current[audioKey] = true;
    }

    // 2. 10 Seconds: 每个玩家每回合最后11秒时播放
    else if (phase === 'round' && currentTime === 11) {
      playTenSeconds();
      audioTriggeredRef.current[audioKey] = true;
    }

    // 3. Countdown Switch/Finish: 每个玩家每回合最后5秒时播放
    else if (phase === 'round' && currentTime === 5) {
      const isLastPlayer = currentParticipant === configRef.current.participants;
      const isLastRound = currentRound === configRef.current.rounds;

      if (isLastPlayer && isLastRound) {
        playCountdownFinish();
      } else {
        playCountdownSwitch();
      }
      audioTriggeredRef.current[audioKey] = true;
    }

    // 4. Countdown Start: 每轮间隔时间最后4秒时播放
    else if (phase === 'interval' && currentTime === 4) {
      playCountdownStart();
      audioTriggeredRef.current[audioKey] = true;
    }
  }, [currentTime, phase, currentRound, currentParticipant, isPaused, playBattleStarting, playTenSeconds, playCountdownSwitch, playCountdownFinish, playCountdownStart]);

  // ========== 清理定时器 ==========
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopBackgroundMusic();
      // 取消屏幕常亮
      Taro.setKeepScreenOn({
        keepScreenOn: false
      });
    };
  }, []);

  // ========== 渲染 ==========
  const statusInfo = getStatusInfo();

  return (
    <View className='page-container'>
      <View className='title'>
        <Image className='title-img' src='https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/logo.png' />
        <Text className='title-text'>BATTLE计时器</Text>
      </View>

      {/* 圆弧分隔线 */}
      <View className='arc-line' />

      {/* 计时层 */}
      <View className='timer-main'>
        <Text className='timer-display'>{formatTime(currentTime)}</Text>
      </View>

      {/* 文字提示 */}
      <View className='timer-status'>
        <Image className='timer-status-img' src='https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/toparow.png' />
        <Text className='timer-status-text'>{statusInfo.title}</Text>
      </View>

      {/* 音量控制 */}
      <View className='timer-voice'>
        <View className='volume-control-item'>
          <View className='volume-control-item-tip'>
            <Text className='volume-control-item-tip-label'>MC人声</Text>
            <Text className='volume-control-item-tip-value'>音量：{Math.round(displaySfxVolume)}%</Text>
          </View>
          <Slider 
            className='volume-control-item-slider' 
            value={displaySfxVolume} 
            onChange={(e) => {
              const newVolume = e.detail.value;
              setDisplaySfxVolume(newVolume);
              setVolume(newVolume / 100);
            }} 
            activeColor='#5F2AFF' 
            backgroundColor='#BED4FF99' 
            blockSize={16} 
          />
        </View>
        <View className='volume-control-item'>
          <View className='volume-control-item-tip'>
            <Text className='volume-control-item-tip-label'>背景音乐</Text>
            <Text className='volume-control-item-tip-value'>音量：{Math.round(displayBgmVolume)}%</Text>
          </View>
          <Slider 
            className='volume-control-item-slider' 
            value={displayBgmVolume} 
            onChange={(e) => {
              const newVolume = e.detail.value;
              setDisplayBgmVolume(newVolume);
              setAudioBgmVolume(newVolume / 100);
            }} 
            activeColor='#004FE1' 
            backgroundColor='#BED4FF99' 
            blockSize={16} 
          />
        </View>
        <View className='volume-control-item'>
          <Text className='volume-control-item-text'>背景音调至&ldquo;0&rdquo;，支持同时使用其他软件的音乐~</Text>
        </View>
      </View>
      {/* 按钮区 */}
      <View className='controls'>
        <Text onClick={reset} className='controls-reset controls-btn'>重置</Text>
        <Text onClick={togglePause} className='controls-secondary controls-btn'>
          {isPaused ? '继续' : '暂停'}
        </Text>
      </View>
    </View>
  );
}

