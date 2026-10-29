// used: { fifty, audience } - quyền nào đã dùng thì bị khóa
const Lifelines = ({ used, status, onFifty, onAudience, onQuit }) => {
  const locked = status !== 'answering';
  return (
    <div className="lifelines">
      <button onClick={onFifty} disabled={used.fifty || locked}>50:50</button>
      <button onClick={onAudience} disabled={used.audience || locked}>Hỏi khán giả</button>
      <button className="quit" onClick={onQuit} disabled={locked}>Dừng cuộc chơi</button>
    </div>
  );
};

export default Lifelines;
