import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useFetch from './hooks/useFetch';
import { selectMatches, setMatches, removeMatch, setGoals } from './features/matchesSlice';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import { ROUNDS, RESULT_LABELS } from './data';
import {
  getTeamName, getResult, isValidGoals, calcStandings, calcMatchStats,
} from './utils';

const BUILD_TAG = "bd-5918";

function App() {
  const { data, loading, error } = useFetch('/data/matches.json');
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { showNotice } = useNotice();
  const [roundFilter, setRoundFilter] = useState('all');

  useEffect(() => {
    if (data) dispatch(setMatches(data));
  }, [data, dispatch]);

  const standings = useMemo(() => calcStandings(matches), [matches]);

  const visibleMatches = useMemo(
    () => (roundFilter === 'all'
      ? matches
      : matches.filter((m) => m.round === Number(roundFilter))),
    [matches, roundFilter]
  );

  const stats = useMemo(() => calcMatchStats(visibleMatches), [visibleMatches]);

  if (loading) return <p>Đang tải lịch thi đấu...</p>;
  if (error) return <p>Không tải được lịch thi đấu</p>;

  const leader = standings[0];

  const handleGoals = (match, side, e) => {
    const value = e.target.valueAsNumber;
    if (!isValidGoals(value)) return;
    dispatch(setGoals({
      id: match.id,
      homeGoals: side === 'home' ? value : match.homeGoals,
      awayGoals: side === 'away' ? value : match.awayGoals,
    }));
  };

  const handleRemove = (match) => {
    dispatch(removeMatch(match.id));
    showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
  };

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <h1>Giải bóng đá khoa</h1>
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
      </button>

      <section>
        <h2>Bảng xếp hạng</h2>
        <StandingsTable standings={standings} />
      </section>

      <section>
        <h2>Thống kê</h2>
        <p>{`Số trận: ${stats.count}`}</p>
        <p>{`Tổng số bàn thắng: ${stats.goals}`}</p>
        <p>{`Bàn thắng mỗi trận: ${stats.average.toFixed(2)}`}</p>
        <p>
          {matches.length === 0
            ? 'Đội dẫn đầu: —'
            : `Đội dẫn đầu: ${leader.name} (${leader.points} điểm)`}
        </p>
      </section>

      <section>
        <h2>Lịch thi đấu</h2>
        <label htmlFor="roundFilter">Xem vòng</label>
        <select id="roundFilter" value={roundFilter}
                onChange={(e) => setRoundFilter(e.target.value)}>
          <option value="all">Tất cả</option>
          {ROUNDS.map((r) => (
            <option key={r} value={r}>{`Vòng ${r}`}</option>
          ))}
        </select>

        {visibleMatches.length === 0 ? (
          <p>Chưa có trận đấu nào</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vòng</th><th>Đội nhà</th><th>BT nhà</th><th>BT khách</th>
                <th>Đội khách</th><th>Kết quả</th><th></th>
              </tr>
            </thead>
            <tbody>
              {visibleMatches.map((m) => {
                const home = getTeamName(m.home);
                const away = getTeamName(m.away);
                const result = getResult(m);
                return (
                  <tr key={m.id}
                      style={result === 'draw' ? { background: 'rgba(255, 193, 7, 0.25)' } : undefined}>
                    <td>{m.round}</td>
                    <td>{home}</td>
                    <td>
                      <input type="number" min="0" max="20" value={m.homeGoals}
                             aria-label={`Bàn thắng nhà ${home} - ${away}`}
                             onChange={(e) => handleGoals(m, 'home', e)} />
                    </td>
                    <td>
                      <input type="number" min="0" max="20" value={m.awayGoals}
                             aria-label={`Bàn thắng khách ${home} - ${away}`}
                             onChange={(e) => handleGoals(m, 'away', e)} />
                    </td>
                    <td>{away}</td>
                    <td>{RESULT_LABELS[result]}</td>
                    <td><button onClick={() => handleRemove(m)}>Xóa</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Thêm trận đấu</h2>
        <AddMatchForm />
      </section>

      <section>
        <h2>Mục tiêu điểm</h2>
        <GoalPlanner standings={standings} />
      </section>
    </div>
  );
}

export default App;