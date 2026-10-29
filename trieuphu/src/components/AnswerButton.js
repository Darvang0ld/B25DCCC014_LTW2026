// state: '' | 'selected' | 'correct' | 'wrong'; hidden: bị 50:50 ẩn đi
const AnswerButton = ({ letter, text, state, hidden, disabled, onClick }) => {
  if (hidden) {
    // Vẫn giữ chỗ trong lưới nhưng không có chữ và không bấm được
    return <button className="answer ghost" disabled aria-hidden="true" tabIndex={-1} />;
  }
  return (
    <button className={`answer ${state}`} disabled={disabled} onClick={onClick}>
      {`${letter}. ${text}`}
    </button>
  );
};

export default AnswerButton;
