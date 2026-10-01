import { useState } from 'react';

const StudentForm = ({ onAdd }) => {
  const [form, setForm] = useState({ name: "", score: "", className: "" });
  const [error, setError] = useState("");
  const { name, score, className } = form;

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    const scoreNum = Number(score);
    if (!name.trim() || score.trim() === "" || !className.trim()) {
      setError("Vui lòng nhập đầy đủ họ tên, điểm số và lớp.");
      return;
    }
    if (Number.isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setError("Điểm số phải là số từ 0 đến 10.");
      return;
    }
    onAdd({ name: name.trim(), score: scoreNum, class: className.trim() });
    setForm({ name: "", score: "", className: "" });
    setError("");
  };

  return (
    <div className="panel">
      <h2>Thêm sinh viên</h2>
      <div className="row">
        <input name="name" placeholder="Họ tên" value={name} onChange={handleChange} />
        <input name="score" placeholder="Điểm (0-10)" value={score} onChange={handleChange} />
        <input name="className" placeholder="Lớp" value={className} onChange={handleChange} />
        <button className="primary" onClick={handleSubmit}>Thêm</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default StudentForm;