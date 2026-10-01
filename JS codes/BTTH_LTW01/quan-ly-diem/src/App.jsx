import { useState } from 'react';

// Dữ liệu mẫu ban đầu
const initialStudents = [
  { id: 1, name: "Nguyễn Văn An", score: 8.5, class: "CNTT1" },
  { id: 2, name: "Trần Thị Bình", score: 4.5, class: "CNTT2" },
  { id: 3, name: "Lê Hoàng Cường", score: 6.8, class: "CNTT1" },
  { id: 4, name: "Phạm Minh Đức", score: 9.2, class: "CNTT3" },
];

const rank = (score) => (score >= 8 ? "Giỏi" : score < 5 ? "Trượt" : "Đạt");

// Component cháu: một dòng sinh viên
const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, class: className } = student;
  const level = rank(score);
  const cls = score >= 8 ? "good" : score < 5 ? "bad" : "";
  
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{className}</td>
      <td>{score.toFixed(1)}</td>
      <td><span className={`tag ${cls}`}>{level}</span></td>
      <td><button className="del" onClick={() => onDelete(id)}>Xóa</button></td>
    </tr>
  );
};

// Component con: bảng danh sách
const StudentList = ({ students, onDelete }) => (
  <div className="scroll">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Họ tên</th>
          <th>Lớp</th>
          <th>Điểm</th>
          <th>Xếp loại</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <StudentItem key={s.id} student={s} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
    {students.length === 0 && <div className="empty">Không có dữ liệu sinh viên.</div>}
  </div>
);

// Form thêm sinh viên
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
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (Number.isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setError("Điểm số không hợp lệ (0-10).");
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
        <input name="score" placeholder="Điểm" value={score} onChange={handleChange} />
        <input name="className" placeholder="Lớp" value={className} onChange={handleChange} />
        <button className="primary" onClick={handleSubmit}>Lưu</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

// Component cha: Quản lý ứng dụng
export default function App() {
  const [students, setStudents] = useState(initialStudents);
  const [filter, setFilter] = useState("all");

  const handleAdd = (data) => {
    const nextId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    setStudents([...students, { id: nextId, ...data }]);
  };

  const handleDelete = (id) => setStudents(students.filter((s) => s.id !== id));

  const visible = students.filter((s) =>
    filter === "good" ? s.score >= 8 : filter === "fail" ? s.score < 5 : true
  );

  const total = students.length;
  const average = total ? students.reduce((sum, s) => sum + s.score, 0) / total : 0;

  const filterOptions = [
    { key: "all", label: "Tất cả" },
    { key: "good", label: "Giỏi (≥ 8.0)" },
    { key: "fail", label: "Trượt (< 5.0)" },
  ];

  return (
    <>
      <style>{`
        /* CSS Tối giản - Trắng đen */
        :root {
          --border: 1px solid #000;
          --bg: #fff;
          --fg: #000;
        }
        
        body {
          margin: 0;
          background: var(--bg);
          color: var(--fg);
          font-family: "Segoe UI", system-ui, sans-serif;
          padding: 32px 16px;
          line-height: 1.5;
        }
        
        * { box-sizing: border-box; }
        .wrap { max-width: 800px; margin: 0 auto; }
        
        h1 {
          font-size: 1.8rem;
          border-bottom: 2px solid var(--fg);
          padding-bottom: 8px;
          margin: 0 0 4px 0;
          text-transform: uppercase;
        }
        
        .sub {
          margin: 0 0 24px 0;
          font-size: 0.95rem;
          font-style: italic;
          color: #333;
        }
        
        .stats {
          display: flex;
          margin-bottom: 24px;
          border: var(--border);
        }
        
        .stat {
          padding: 16px;
          flex: 1;
          text-align: center;
        }
        
        .stat:first-child {
          border-right: var(--border);
        }
        
        .stat b {
          font-size: 2rem;
          display: block;
          line-height: 1.2;
        }
        
        .stat span {
          font-size: 0.85rem;
          text-transform: uppercase;
        }
        
        .panel {
          border: var(--border);
          padding: 20px;
          margin-bottom: 24px;
        }
        
        .panel h2 {
          margin: 0 0 16px 0;
          font-size: 1.1rem;
          text-transform: uppercase;
        }
        
        .row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        input {
          flex: 1 1 140px;
          padding: 10px;
          border: var(--border);
          background: var(--bg);
          color: var(--fg);
          font: inherit;
        }
        
        input:focus {
          outline: 2px solid var(--fg);
          outline-offset: 2px;
        }
        
        button {
          padding: 10px 16px;
          border: var(--border);
          background: var(--bg);
          color: var(--fg);
          cursor: pointer;
          font: inherit;
          font-weight: bold;
        }
        
        button:hover, button:focus-visible {
          background: var(--fg);
          color: var(--bg);
        }
        
        .filters { margin-bottom: 16px; }
        
        .filters button {
          margin-right: 8px;
          margin-bottom: 8px;
          border-radius: 99px;
        }
        
        .filters button.on {
          background: var(--fg);
          color: var(--bg);
        }
        
        .error {
          margin: 12px 0 0 0;
          padding: 10px;
          border-left: 4px solid var(--fg);
          font-weight: bold;
        }
        
        .scroll { overflow-x: auto; }
        
        table {
          width: 100%;
          border-collapse: collapse;
          border: var(--border);
        }
        
        th, td {
          border: var(--border);
          padding: 12px;
          text-align: left;
        }
        
        th {
          text-transform: uppercase;
          font-size: 0.85rem;
          background: #f4f4f4;
        }
        
        .tag {
          display: inline-block;
          padding: 4px 10px;
          border: 1px solid var(--fg);
          font-size: 0.8rem;
          border-radius: 4px;
          font-weight: 600;
        }
        
        .tag.good {
          background: var(--fg);
          color: var(--bg);
        }
        
        .tag.bad {
          border-style: dotted;
        }
        
        .del {
          font-size: 0.8rem;
          padding: 6px 12px;
        }
        
        .empty {
          padding: 24px;
          text-align: center;
          border: var(--border);
          border-top: none;
          font-style: italic;
        }
      `}</style>
      
      <div className="wrap">
        <h1>Quản lý điểm</h1>
        <p className="sub">{`Hiển thị ${visible.length} / ${total} hồ sơ`}</p>

        <div className="stats">
          <div className="stat"><b>{total}</b><span>Tổng sinh viên</span></div>
          <div className="stat"><b>{average.toFixed(2)}</b><span>Điểm trung bình</span></div>
        </div>

        <StudentForm onAdd={handleAdd} />

        <div className="panel">
          <div className="row filters">
            {filterOptions.map(({ key, label }) => (
              <button key={key} className={filter === key ? "on" : ""} onClick={() => setFilter(key)}>
                {label}
              </button>
            ))}
          </div>
          <StudentList students={visible} onDelete={handleDelete} />
        </div>
      </div>
    </>
  );
}