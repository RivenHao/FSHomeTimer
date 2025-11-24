// 计时器配置接口
export interface TimerConfig {
  participants: number; // 参与人数
  rounds: number; // 轮次
  roundTime: number; // 每回合时间（秒）
  prepTime: number; // 首轮准备时间（秒）
  intervalTime: number; // 每轮间隔时间（秒）
}

// 计时器阶段类型
export type Phase = "prep" | "round" | "interval" | "completed";

// 页面状态接口
export interface TimerState {
  showForm: boolean; // 是否显示配置表单
  config: TimerConfig; // 计时器配置
  currentRound: number; // 当前轮次
  currentParticipant: number; // 当前选手
  currentTime: number; // 当前剩余时间
  phase: Phase; // 当前阶段
  isPaused: boolean; // 是否暂停
  isCompleted: boolean; // 是否完成
}

// 状态信息接口
export interface StatusInfo {
  title: string; // 标题
  detail: string; // 详细信息
}
