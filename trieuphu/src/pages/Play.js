import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);              // câu hiện tại (0-based)
  const [status, setStatus] = useState('answering');  // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const total = questions.length;
  const question = questions[index];

  // Số câu đã trả lời đúng khi kết thúc = index (hoặc total nếu thắng)
  const finish = (reason, correctCount) => {
    const prize = calcPrize(correctCount, reason);
    navigate('/result', {
      replace: true,
      state: { name: playerName, prize, correctCount, reason },
    });
  };

  const handleSelect = (i) => {
    if (status !== 'answering') return;
    setSelected(i);
    setStatus('locked');
  };

  // Đồng hồ: chỉ chạy khi đang trả lời
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
          setTimeLeft(TIME_PER_QUESTION);
          setStatus('answering');
        }
      }, 2000);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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
          onSelect={handleSelect}
        />
      </section>
      <aside>
        <MoneyLadder current={index} />
      </aside>
    </div>
  );
};

export default Play;
