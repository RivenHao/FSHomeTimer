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
          <Image className='main-card-img' src='https://objectstorageapi.bja.sealos.run/w7g0b67k-fs-book/completedLogo.png' />
          <Text className='main-card-text'>全网最全招式库
            解锁专属花足成就</Text>
          <Text className='main-card-text2'></Text>
        </View>
      </View>
      <View className='form-footer' onClick={() => Taro.reLaunch({ url: '/pages/config/index' })}>
        <Text className='btn-submit'>重新开始</Text>
      </View>
    </View>
  );
}
