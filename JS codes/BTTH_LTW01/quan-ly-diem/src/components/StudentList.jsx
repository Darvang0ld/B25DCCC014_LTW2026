import StudentItem from './StudentItem';

const StudentList = ({ students, onDelete }) => (
  <div className="scroll">
    <table>
      <thead>
        <tr><th>ID</th><th>Họ tên</th><th>Lớp</th><th>Điểm</th><th>Xếp loại</th><th></th></tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <StudentItem key={s.id} student={s} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
    {students.length === 0 && <div className="empty">Không có sinh viên nào phù hợp.</div>}
  </div>
);

export default StudentList;