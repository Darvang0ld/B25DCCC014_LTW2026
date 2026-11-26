import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useFetch from './hooks/useFetch';
import useLocalStorage from './hooks/useLocalStorage';
import useDebounce from './hooks/useDebounce';
import { selectMatches, setMatches, removeMatch, setGoals } from './features/matchesSlice';
import { hasSaved } from './store';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import MatchRow from './components/MatchRow';
import { ROUNDS, RESULT_LABELS } from './data';
import {
  getTeamName, isValidGoals, calcStandings, calcMatchStats,
} from './utils';

const BUILD_TAG = "bd-5918";

function App() {
  const { data, loading, error } = useFetch('/data/matches.json');
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { showNotice } = useNotice();
  const [roundFilter, setRoundFilter] = useLocalStorage('ltw_bongda_round', 'all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchRef = useRef(null);

  useEffect(() => {
    if (data && !hasSaved) dispatch(setMatches(data));
  }, [data, dispatch]);

  useEffect(() => {
    const handleKey = (e) => {
      const tag = e.target.tagName;
      const typing = tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
      if (e.key === '/' && !typing) {
        e.preventDefault();
        if (searchRef.current) searchRef.current.focus();
      } else if (e.key === 'Escape' && e.target === searchRef.current) {
        setSearch('');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const standings = useMemo(() => calcStandings(matches), [matches]);

  const roundMatches = useMemo(
    () => (roundFilter === 'all'
      ? matches
      : matches.filter((m) => m.round === Number(roundFilter))),
    [matches, roundFilter]
  );

  // Lọc thêm theo ô tìm đội (dùng cho bảng lịch thi đấu)
  const visibleMatches = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (q === '') return roundMatches;
    return roundMatches.filter(
      (m) =>
        getTeamName(m.home).toLowerCase().includes(q) ||
        getTeamName(m.away).toLowerCase().includes(q)
    );
  }, [roundMatches, debouncedSearch]);

  const stats = useMemo(() => calcMatchStats(roundMatches), [roundMatches]);

  const leader = standings[0];

  // Tiêu đề tab
  useEffect(() => {
    document.title = matches.length > 0
      ? `${leader.name} dẫn đầu – Giải bóng đá khoa`
      : 'Giải bóng đá khoa';
  }, [matches.length, leader.name]);

  const handleGoals = useCallback((match, side, e) => {
    const value = e.target.valueAsNumber;
    if (!isValidGoals(value)) return;
    dispatch(setGoals({
      id: match.id,
      homeGoals: side === 'home' ? value : match.homeGoals,
      awayGoals: side === 'away' ? value : match.awayGoals,
    }));
  }, [dispatch]);

  const handleRemove = useCallback((match) => {
    dispatch(removeMatch(match.id));
    showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
  }, [dispatch, showNotice]);

  const handleTeamShift = (e) => {
    setSearch(e.target.value);
  };

  const handleReset = () => {
    if (!data) return;
    dispatch(setMatches(data));
    showNotice('Đã đặt lại dữ liệu mẫu');
  };

  if (!hasSaved) {
    if (loading) return <p>Đang tải lịch thi đấu...</p>;
    if (error) return <p>Không tải được lịch thi đấu</p>;
  }

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

        <h3>Phân bố kết quả</h3>
        <ul>
          {Object.keys(RESULT_LABELS).map((key) => (
            <li key={key}>
              {`${RESULT_LABELS[key]}: ${stats.counts[key]}`}
              <span
                className="bar"
                style={{ width: `${24 * stats.counts[key]}px` }}
              />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Lịch thi đấu</h2>
        <div>
          <label htmlFor="roundFilter">Xem vòng</label>
          <select id="roundFilter" value={roundFilter}
                  onChange={(e) => setRoundFilter(e.target.value)}>
            <option value="all">Tất cả</option>
            {ROUNDS.map((r) => (
              <option key={r} value={String(r)}>{`Vòng ${r}`}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="teamSearch">Tìm đội</label>
          <input id="teamSearch" type="text" ref={searchRef}
                 value={search} onChange={handleTeamShift} />
        </div>
        <p>{`Tìm thấy ${visibleMatches.length} trận`}</p>

        {visibleMatches.length === 0 ? (
          <p>Chưa có trận đấu nào</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vòng</th><th>Đội nhà</th><th>BT nhà</th><th>BT khách</th>
                <th>Đội khách</th><th>Kết quả</th><th>Số lần render</th><th></th>
              </tr>
            </thead>
            <tbody>
              {visibleMatches.map((m) => (
                <MatchRow key={m.id} match={m}
                          onGoals={handleGoals} onRemove={handleRemove} />
              ))}
            </tbody>
          </table>
        )}

        <button onClick={handleReset}>Đặt lại dữ liệu mẫu</button>
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