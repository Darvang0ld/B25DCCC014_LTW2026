import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION, LETTERS } from '../data';
import { calcPrize, pickHidden, calcAudience } from '../utils';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';

const Play = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);              // câu hiện tại (0-based)
  const [status, setStatus] = useState('answering');  // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [hidden, setHidden] = useState([]);           // đáp án bị 50:50 ẩn (của câu hiện tại)
  const [audience, setAudience] = useState(null);     // [%A, %B, %C, %D] hoặc null
  const [used, setUsed] = useState({ fifty: false, audience: false });

  const total = questions.length;
  const question = questions[index];

  // Kết thúc lượt chơi: lưu lịch sử (App) rồi sang trang kết quả
  const finish = (reason, correctCount) => {
    const prize = calcPrize(correctCount, reason);
    onFinish({ name: playerName, prize, correctCount });
    navigate('/result', {
      replace: true,
      state: { name: playerName, prize, correctCount, reason },
    });
  };

  const handleSelect = (i) => {
    if (status !== 'answering' || hidden.includes(i)) return;
    setSelected(i);
    setStatus('locked');
  };

  const handleFifty = () => {
    setHidden(pickHidden(question.answer));
    setUsed({ ...used, fifty: true });
  };

  const handleAudience = () => {
    setAudience(calcAudience(question.answer, hidden));
    setUsed({ ...used, audience: true });
  };

  // Dừng cuộc chơi: nhận tiền của câu vừa trả lời đúng gần nhất
  const handleQuit = () => finish('quit', index);

  // Đồng hồ: chỉ chạy khi đang trả lời, cleanup bằng clearInterval
  useEffect(() => {
    if (status !== 'answering') return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(t - 1, 0)), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Hết giờ = trả lời sai
  useEffect(() => {
    if (status === 'answering' && timeLeft === 0) finish('timeout', index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Các bước chờ: locked -> (1s) -> revealed -> (2s) -> câu sau / kết thúc
  useEffect(() => {
    if (status === 'locked') {
      const id = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(id);
    }
    if (status === 'revealed') {
      const id = setTimeout(() => {
        if (selected !== question.answer) {
          finish('wrong', index);
        } else if (index === total - 1) {
          finish('won', total);
        } else {
          setIndex(index + 1);
          setSelected(null);
          setHidden([]);
          setAudience(null); // biểu đồ biến mất khi sang câu mới
          setTimeLeft(TIME_PER_QUESTION);
          setStatus('answering');
        }
      }, 2000);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Phím tắt A-D: đăng ký khi mount, gỡ khi unmount
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (i === -1 || status !== 'answering' || hidden.includes(i)) return;
      setSelected(i);
      setStatus('locked');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, hidden]);

  // Tiêu đề tab: Câu 7/15 – An; rời màn hình chơi thì trả lại tiêu đề cũ
  useEffect(() => {
    document.title = `Câu ${index + 1}/${total} – ${playerName}`;
    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [index, total, playerName]);

  return (
    <div className="play">
      <section className="play-main">
        <Timer timeLeft={timeLeft} />
        <QuestionCard
          question={question}
          index={index}
          total={total}
          status={status}
          selected={selected}
          hidden={hidden}
          onSelect={handleSelect}
        />
        <Lifelines
          used={used}
          status={status}
          onFifty={handleFifty}
          onAudience={handleAudience}
          onQuit={handleQuit}
        />
        {audience && <AudienceChart percents={audience} />}
      </section>
      <aside>
        <MoneyLadder current={index} />
      </aside>
    </div>
  );
};

export default Play;
