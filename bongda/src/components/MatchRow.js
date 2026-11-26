import { memo, useRef } from 'react';
import { RESULT_LABELS } from '../data';
import { getTeamName, getResult } from '../utils';

const MatchRow = ({ match, onGoals, onRemove }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const home = getTeamName(match.home);
  const away = getTeamName(match.away);
  const result = getResult(match);

  return (
    <tr style={result === 'draw' ? { background: 'rgba(255, 193, 7, 0.25)' } : undefined}>
      <td>{match.round}</td>
      <td>{home}</td>
      <td>
        <input type="number" min="0" max="20" value={match.homeGoals}
               aria-label={`Bàn thắng nhà ${home} - ${away}`}
               onChange={(e) => onGoals(match, 'home', e)} />
      </td>
      <td>
        <input type="number" min="0" max="20" value={match.awayGoals}
               aria-label={`Bàn thắng khách ${home} - ${away}`}
               onChange={(e) => onGoals(match, 'away', e)} />
      </td>
      <td>{away}</td>
      <td>{RESULT_LABELS[result]}</td>
      <td>{renderCount.current}</td>
      <td><button onClick={() => onRemove(match)}>Xóa</button></td>
    </tr>
  );
};

export default memo(MatchRow);