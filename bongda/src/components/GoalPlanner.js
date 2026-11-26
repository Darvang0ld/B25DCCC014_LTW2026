import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectGoal, setTeamId, setTarget, setRemaining } from '../features/goalSlice';
import { TEAMS } from '../data';
import { calcNeeded } from '../utils';

const GoalPlanner = ({ standings }) => {
  const { teamId, target, remaining } = useSelector(selectGoal);
  const dispatch = useDispatch();

  const message = useMemo(
    () => calcNeeded(standings, teamId, target, remaining),
    [standings, teamId, target, remaining]
  );

  return (
    <div>
      <div>
        <label htmlFor="goalTeam">Đội của bạn</label>
        <select id="goalTeam" value={teamId}
                onChange={(e) => dispatch(setTeamId(e.target.value))}>
          {TEAMS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="goalTarget">Số điểm mục tiêu</label>
        <input id="goalTarget" type="number" value={target}
               onChange={(e) => dispatch(setTarget(e.target.value))} />
      </div>
      <div>
        <label htmlFor="goalRemaining">Số trận còn lại</label>
        <input id="goalRemaining" type="number" value={remaining}
               onChange={(e) => dispatch(setRemaining(e.target.value))} />
      </div>
      <p>{message}</p>
    </div>
  );
};

export default GoalPlanner;