import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

export default function Completed() {
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

      <View className='jump-button' onClick={() => handleCopyLink('https://freestyler.site')}>
        <Text>复制链接后用浏览器打开，前往FS Skills</Text>
        <Image className='jump-img' src='https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/copy.png' />
      </View>

      <View className='main'>
        <View className='main-title'>
          <View className='main-title-one'>
            <Image className='main-title-one-img' src='https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/logo.png'></Image>
            <Text className='main-title-one-text'>比赛结束</Text>
          </View>
          <View className='main-title-two'>
            <Text>更多精彩内容，尽在FS Skills！</Text>
          </View>
        </View>

        <View className='main-card'>
          <View className='main-card-logo'>
            <Image className='main-card-img-people' src='https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/peopleLogo.png' />
            <View className='main-card-log-right'>
              <View className='main-card-log-right-top'>
                <Image className='main-card-img-logo' src='https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/mainLogo.png'/>
                <Text className='main-card-log-right-top-text'> Freestyle Skills</Text>
              </View>
              <Text className='main-card-log-right-text'>最强花式足球网站</Text>
            </View>
          </View>

          <View className='main-card-tip'>
            <Text className='main-card-tip-title'>招式库</Text>
            <Text className='main-card-tip-desc'>花式足球技巧动作 1000+</Text>
          </View>
          <View className='main-card-tip'>
            <Text className='main-card-tip-title'>每周挑战赛</Text>
            <Text className='main-card-tip-desc'>全新接力玩法，有奖赛季制</Text>
          </View>
          <View className='main-card-tip'>
            <Text className='main-card-tip-title'>个人成就墙</Text>
            <Text className='main-card-tip-desc'>通关招式，解锁FS头衔</Text>
          </View>
        </View>
      </View>
      <View className='form-footer' onClick={() => Taro.reLaunch({ url: '/pages/config/index' })}>
        <Text className='btn-submit'>重新开始</Text>
      </View>
    </View>
  );
}
