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
        <Text>前往FS Skills</Text>
        <View className='arrow-icon'></View>
      </View>

      <View className='form-footer' onClick={() => Taro.reLaunch({ url: '/pages/config/index' })}>
        <Text className='btn-submit'>重新开始</Text>
      </View>
    </View>
  );
}
