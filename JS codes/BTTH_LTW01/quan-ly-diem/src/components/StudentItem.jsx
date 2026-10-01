const rank = (score) => (score >= 8 ? "Giỏi" : score < 5 ? "Trượt" : "Đạt");

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

export default StudentItem;