import { MILESTONES, PRIZES } from './data';

// reason: 'wrong' | 'timeout' | 'quit' | 'won'
export const calcPrize = (correctCount, reason) => {
  // Dừng cuộc chơi: nhận đúng số tiền của câu vừa trả lời đúng gần nhất
  if (reason === 'quit') return correctCount > 0 ? PRIZES[correctCount - 1] : 0;

  // Sai / hết giờ / thắng: chỉ nhận tiền của mốc cao nhất đã vượt qua
  const passed = MILESTONES.filter((m) => m <= correctCount);
  return passed.length > 0 ? PRIZES[Math.max(...passed) - 1] : 0;
};
