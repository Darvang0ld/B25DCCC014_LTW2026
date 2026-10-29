import { LETTERS } from '../data';
import AnswerButton from './AnswerButton';

const QuestionCard = ({ question, index, total, status, selected, onSelect }) => {
  // Màu của từng nút theo trạng thái câu hiện tại
  const getState = (i) => {
    if (status === 'locked') return i === selected ? 'selected' : '';
    if (status === 'revealed') {
      if (i === question.answer) return 'correct';
      if (i === selected) return 'wrong';
    }
    return '';
  };

  return (
    <div className="question-card">
      <p className="question-no">Câu {index + 1}/{total}</p>
      <p className="question-text">{question.question}</p>
      <div className="answers">
        {question.options.map((option, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={option}
            state={getState(i)}
            disabled={status !== 'answering'}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
