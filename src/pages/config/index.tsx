import { View, Text, Input, Image, Slider } from '@tarojs/components';
import { useState } from 'react';
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import './index.scss';

export default function Config() {
  // 分享给朋友
  useShareAppMessage(() => {
    return {
      title: 'BATTLE计时器 - 专业的花式足球比赛计时工具',
      path: '/pages/config/index',
      imageUrl: 'https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/logo.png'
    };
  });

  // 分享到朋友圈
  useShareTimeline(() => {
    return {
      title: 'BATTLE计时器 - 专业的花式足球比赛计时工具',
      imageUrl: 'https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/logo.png'
    };
  });
  // 表单字段（直接用字符串存储）
  const [participants, setParticipants] = useState('2');
  const [rounds, setRounds] = useState('3');
  const [roundTime, setRoundTime] = useState('30');
  const [prepTime, setPrepTime] = useState('5');
  const [intervalTime, setIntervalTime] = useState('0');

  // 音量
  const [sfxVolume, setSfxVolume] = useState(50);
  const [bgmVolume, setBgmVolume] = useState(50);

  // 提交时校验
  const handleSubmit = () => {
    const p = parseInt(participants);
    const r = parseInt(rounds);
    const rt = parseInt(roundTime);
    const pt = parseInt(prepTime);
    const it = parseInt(intervalTime);

    if (!participants || Number.isNaN(p) || p < 1) {
      Taro.showToast({ title: '参与人数至少为1人', icon: 'none' });
      return;
    }
    if (!rounds || Number.isNaN(r) || r < 1) {
      Taro.showToast({ title: '轮次至少为1轮', icon: 'none' });
      return;
    }
    if (!roundTime || Number.isNaN(rt) || rt < 15) {
      Taro.showToast({ title: '回合时间至少为15秒', icon: 'none' });
      return;
    }
    if (!prepTime || Number.isNaN(pt) || pt < 5) {
      Taro.showToast({ title: '首轮准备时间至少为5秒', icon: 'none' });
      return;
    }
    if (intervalTime && !Number.isNaN(it) && it > 0 && it < 5) {
      Taro.showToast({ title: '间隔时间必须为0或≥5秒', icon: 'none' });
      return;
    }

    Taro.navigateTo({
      url: `/pages/timer/index?participants=${p}&rounds=${r}&roundTime=${rt}&prepTime=${pt}&intervalTime=${it || 0}&sfxVolume=${sfxVolume}&bgmVolume=${bgmVolume}`,
    });
  };

  // 复制链接
  const handleCopyLink = (link: string) => {
    Taro.setClipboardData({
      data: link,
      success: () => {
        Taro.showToast({
          title: '链接已复制',
          icon: 'success',
          duration: 2000
        });
      }
    });
  };

  return (
    <View className='page-container'>
      <Image src='https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/headImage.png' className='header-bg' mode='aspectFill' />
      <Image src='https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/mainbackground.png' className='footer-bg' mode='aspectFill' />

      <Text className='head-text'>访问我们的官网，了解更多内容</Text>
      <View className='jump-button' onClick={() => handleCopyLink('https://freestyler.site')}>
        <Text>复制链接后用浏览器打开，前往FS Skills</Text>
        <Image className='jump-img' src='https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/copy.png' />
      </View>

      <View className='content-wrapper'>
        <View className='content-form'>
          <View className='form-title'>
            <Image src='https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/logo.png' className='form-title-image' />
            <Text>FS Skills：欢迎使用battle计时器功能！</Text>
          </View>

          <View className='form-grid'>
            <View className='form-grid-item-container1'>
              <View className='form-grid-item1'>
                <Text className='label'>参与人数</Text>
                <Input className='form-input form-input-small' type='number' value={participants} onInput={(e) => setParticipants(e.detail.value)} />
              </View>
              <View className='form-grid-item1'>
                <Text className='label'>轮次</Text>
                <Input className='form-input form-input-small' type='number' value={rounds} onInput={(e) => setRounds(e.detail.value)} />
              </View>
              <View className='form-grid-item1'>
                <Text className='label'>回合时间(s)</Text>
                <Input className='form-input form-input-small' type='number' value={roundTime} onInput={(e) => setRoundTime(e.detail.value)} />
              </View>
            </View>
            <View className='form-grid-item-container2'>
              <View className='form-grid-item2'>
                <Text className='label'>首轮准备时间(s)</Text>
                <Input type='number' className='form-input form-input-big' value={prepTime} onInput={(e) => setPrepTime(e.detail.value)} />
                <Text className='form-input-tip'>≥5秒</Text>
              </View>
              <View className='form-grid-item2'>
                <Text className='label'>每轮间隔时间(s)</Text>
                <Input type='number' className='form-input form-input-big' value={intervalTime} onInput={(e) => setIntervalTime(e.detail.value)} />
                <Text className='form-input-tip'>0或≥5秒</Text>
              </View>
            </View>
            
          </View>
        </View>

        <View className='volume-control'>
          <View className='volume-control-item'>
            <View className='volume-control-item-tip'>
              <Text className='volume-control-item-title'>MC人声音量</Text>
              <Text className='volume-control-item-tip-value'>音量：{Math.round(sfxVolume)}%</Text>
            </View>
            <Slider className='volume-control-item-slider' value={sfxVolume} onChange={(e) => setSfxVolume(e.detail.value)} activeColor='#5F2AFF' backgroundColor='#BED4FF99' blockSize={16} />
          </View>
          <View className='volume-control-item'>
            <View className='volume-control-item-tip'>
              <Text className='volume-control-item-title'>背景音乐音量</Text>
              <Text className='volume-control-item-tip-value'>音量：{Math.round(bgmVolume)}%</Text>
            </View>
            <Slider className='volume-control-item-slider' value={bgmVolume} onChange={(e) => setBgmVolume(e.detail.value)} activeColor='#004FE1' backgroundColor='#BED4FF99' blockSize={16} />
          </View>
            <Text className='volume-control-item-text'>背景音调至&ldquo;0&rdquo;，支持同时使用其他软件的音乐~</Text>
        </View>
      </View>

      <View className='form-footer' onClick={handleSubmit}>
        <Text className='btn-submit'>开始计时</Text>
      </View>
    </View>
  );
}
