import { useNavigate } from 'react-router-dom';
import { PRIZES, MILESTONES, TIME_PER_QUESTION, formatMoney } from '../data';

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();

  const handleChange = (e) => setPlayerName(e.target.value);

  const handleStart = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    setPlayerName(playerName.trim());
    navigate('/play');
  };

  return (
    <div>
      <h1>Ai là triệu phú</h1>
      <ul className="rules">
        <li>Trả lời lần lượt {PRIZES.length} câu hỏi trắc nghiệm, mỗi câu có {TIME_PER_QUESTION} giây.</li>
        <li>Trả lời đúng cả {PRIZES.length} câu để nhận {formatMoney(PRIZES[PRIZES.length - 1])}.</li>
        <li>Câu {MILESTONES.join(', ')} là các mốc an toàn. Trả lời sai hoặc hết giờ, bạn chỉ nhận tiền của mốc cao nhất đã vượt qua.</li>
        <li>Có 3 quyền trợ giúp, mỗi quyền dùng một lần. Bạn cũng có thể dừng cuộc chơi để mang tiền về.</li>
      </ul>
      <form className="start-form" onSubmit={handleStart}>
        <label>
          Tên người chơi:{' '}
          <input
            type="text"
            value={playerName}
            onChange={handleChange}
            placeholder="Nhập tên của bạn"
          />
        </label>
        <button type="submit" disabled={!playerName.trim()}>Bắt đầu</button>
      </form>
    </div>
  );
};

export default Home;
