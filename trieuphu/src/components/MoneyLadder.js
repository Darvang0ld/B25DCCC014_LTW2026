import { PRIZES, MILESTONES, formatMoney } from '../data';

// current: vị trí (0-based) của câu đang chơi
const MoneyLadder = ({ current }) => (
  <ul className="ladder">
    {PRIZES.map((prize, i) => {
      const className = [
        'ladder-step',
        i === current ? 'current' : '',
        MILESTONES.includes(i + 1) ? 'milestone' : '',
      ].join(' ');
      return (
        <li key={i} className={className}>
          <span className="step-no">{i + 1}</span>
          <span>{formatMoney(prize)}</span>
        </li>
      );
    }).reverse()}
  </ul>
);

export default MoneyLadder;
