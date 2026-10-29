import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions }) => {
  const [level, setLevel] = useState('0'); // '0' = Tất cả
  const [query, setQuery] = useState('');

  const handleLevelChange = (e) => setLevel(e.target.value);
  const handleQueryShift = (e) => setQuery(e.target.value);

  const keyword = query.trim().toLowerCase();
  const filtered = questions.filter(
    (q) =>
      (level === '0' || q.level === Number(level)) &&
      q.question.toLowerCase().includes(keyword)
  );

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>
      <div className="toolbar">
        <label>
          Mức độ:{' '}
          <select value={level} onChange={handleLevelChange}>
            <option value="0">Tất cả</option>
            {Object.entries(LEVELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label>
          Tìm kiếm:{' '}
          <input
            type="text"
            value={query}
            onChange={handleQueryShift}
            placeholder="Nhập nội dung câu hỏi"
          />
        </label>
      </div>
      <p>Có {filtered.length} câu hỏi</p>
      <table className="table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((q, index) => (
            <tr key={q.id}>
              <td>{index + 1}</td>
              <td>{LEVELS[q.level]}</td>
              <td><Link to={`/questions/${q.id}`}>{q.question}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;
