import { formatMoney } from '../data';

const History = ({ history, onClear }) => {
  // Sắp xếp trên bản sao của mảng, không sửa trực tiếp state
  const sorted = [...history].sort((a, b) => b.prize - a.prize || b.id - a.id);
  const best = history.reduce((max, h) => Math.max(max, h.prize), 0);
  const total = history.reduce((sum, h) => sum + h.prize, 0);

  return (
    <div>
      <h2>Lịch sử các lượt chơi</h2>
      <div className="stats">
        <p>Số lượt chơi: {history.length}</p>
        <p>Tiền thưởng cao nhất: {formatMoney(best)}</p>
        <p>Tổng tiền thưởng: {formatMoney(total)}</p>
      </div>
      <button onClick={onClear} disabled={history.length === 0}>Xóa lịch sử</button>

      {history.length === 0 ? (
        <p>Chưa có lượt chơi nào</p>
      ) : (
        <table className="table history-table">
          <thead>
            <tr>
              <th>Người chơi</th>
              <th>Số câu đúng</th>
              <th>Tiền thưởng</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((h) => (
              <tr key={h.id}>
                <td>{h.name}</td>
                <td>{h.correctCount}</td>
                <td>{formatMoney(h.prize)}</td>
                <td>{h.playedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
