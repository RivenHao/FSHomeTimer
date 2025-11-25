import { Canvas } from '@tarojs/components';
import { useEffect, useRef, useState } from 'react';
import Taro from '@tarojs/taro';
import lottie from 'lottie-miniprogram';

interface LottieAnimationProps {
  animationData?: any; // Lottie JSON 数据（直接传入）
  path?: string; // Lottie JSON URL 路径
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
  canvasId: string; // 必须唯一
  onComplete?: () => void;
}

export default function LottieAnimation({
  animationData,
  path,
  loop = true,
  autoplay = true,
  style,
  canvasId,
  onComplete
}: LottieAnimationProps) {
  const animationRef = useRef<any>(null);
  const [loadedData, setLoadedData] = useState<any>(null);

  // 如果提供了 path，从 URL 加载数据
  useEffect(() => {
    if (path) {
      Taro.request({
        url: path,
        method: 'GET',
        success: (res) => {
          setLoadedData(res.data);
        },
        fail: (err) => {
          console.error('加载 Lottie 动画失败:', err);
        }
      });
    } else if (animationData) {
      setLoadedData(animationData);
    }
  }, [path, animationData]);

  useEffect(() => {
    if (!loadedData) return;

    // 延迟初始化，确保 Canvas 已渲染
    setTimeout(() => {
      Taro.createSelectorQuery()
        .select(`#${canvasId}`)
        .node((res) => {
          const canvas = res.node;
          const context = canvas.getContext('2d');

          // 设置 Canvas 尺寸
          const dpr = Taro.getSystemInfoSync().pixelRatio;
          canvas.width = 300 * dpr;
          canvas.height = 300 * dpr;
          context.scale(dpr, dpr);

          // 初始化 Lottie
          animationRef.current = lottie.setup(canvas);
          animationRef.current.loadAnimation({
            loop,
            autoplay,
            animationData: loadedData,
            rendererSettings: {
              context
            }
          });

          // 监听完成事件
          if (onComplete) {
            animationRef.current.addEventListener('complete', onComplete);
          }
        })
        .exec();
    }, 100);

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [loadedData, loop, autoplay, canvasId, onComplete]);

  return (
    <Canvas
      type='2d'
      id={canvasId}
      style={{
        width: '300px',
        height: '300px',
        ...style
      }}
    />
  );
}
