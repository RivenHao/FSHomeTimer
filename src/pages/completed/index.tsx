import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

export default function Completed() {
  /**
   * 开始新比赛 - 返回配置页
   */
  const startNewCompetition = () => {
    // 返回到配置页（首页）
    Taro.reLaunch({
      url: '/pages/config/index'
    });
  };

  return (
    <View className='container'>
      <View className='completed'>
        <Text className='completed-title'>🎉 比赛结束！</Text>
        <Text className='completed-text'>所有轮次已完成</Text>
        <Button onClick={startNewCompetition} className='btn'>开始新比赛</Button>
      </View>
    </View>
  );
}

