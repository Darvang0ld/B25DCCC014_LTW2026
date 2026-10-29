import { MILESTONES, PRIZES } from './data';

// reason: 'wrong' | 'timeout' | 'quit' | 'won'
export const calcPrize = (correctCount, reason) => {
  // Dừng cuộc chơi: nhận đúng số tiền của câu vừa trả lời đúng gần nhất
  if (reason === 'quit') return correctCount > 0 ? PRIZES[correctCount - 1] : 0;

  // Sai / hết giờ / thắng: chỉ nhận tiền của mốc cao nhất đã vượt qua
  const passed = MILESTONES.filter((m) => m <= correctCount);
  return passed.length > 0 ? PRIZES[Math.max(...passed) - 1] : 0;
};

// ---------- Quyền trợ giúp ----------

// 50:50: giữ lại ngẫu nhiên 1 đáp án sai, ẩn 2 đáp án sai còn lại
export const pickHidden = (answer) => {
  const wrong = [0, 1, 2, 3].filter((i) => i !== answer);
  const keep = Math.floor(Math.random() * wrong.length);
  return wrong.filter((_, k) => k !== keep);
};

// Chia ngẫu nhiên `total` thành `parts` số nguyên không âm, có tổng đúng bằng `total`
const split = (total, parts) => {
  const cuts = Array.from({ length: parts - 1 }, () => Math.floor(Math.random() * (total + 1)))
    .sort((a, b) => a - b);
  return [...cuts, total].map((c, i) => c - (i > 0 ? cuts[i - 1] : 0));
};

// Hỏi khán giả: trả về mảng 4 phần trăm (tổng = 100)
export const calcAudience = (answer, hidden = []) => {
  const wrong = [0, 1, 2, 3].filter((i) => i !== answer && !hidden.includes(i));
  // Chỉ còn 1 đáp án sai thì đáp án đúng phải >= 51% mới luôn là cột cao nhất
  const min = wrong.length === 1 ? 51 : 40;
  const correct = min + Math.floor(Math.random() * (71 - min)); // min..70
  let parts;
  do {
    parts = split(100 - correct, wrong.length);
  } while (parts.some((p) => p >= correct));

  const percents = [0, 0, 0, 0];
  percents[answer] = correct;
  wrong.forEach((idx, k) => {
    percents[idx] = parts[k];
  });
  return percents;
};
