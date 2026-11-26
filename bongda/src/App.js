import { useReducer, useEffect, useMemo, useRef, useState } from 'react';
import useFetch from './hooks/useFetch';
import matchesReducer from './matchesReducer';
import { TEAMS, ROUNDS, RESULT_LABELS, formatDiff } from './data';
import {
  getTeamName, getResult, isValidGoals, calcStandings, calcMatchStats,
} from './utils';

const BUILD_TAG = "bd-5918";

const EMPTY_FORM = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };

function App() {
  const { data, loading, error } = useFetch('/data/matches.json');
  const [matches, dispatch] = useReducer(matchesReducer, []);
  const [roundFilter, setRoundFilter] = useState('all');
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const homeRef = useRef(null);

  useEffect(() => {
    if (data) dispatch({ type: 'LOAD', payload: data });
  }, [data]);

  // Bảng xếp hạng: luôn tính trên TẤT CẢ trận
  const standings = useMemo(() => calcStandings(matches), [matches]);

  // Lọc theo vòng
  const visibleMatches = useMemo(
    () => (roundFilter === 'all'
      ? matches
      : matches.filter((m) => m.round === Number(roundFilter))),
    [matches, roundFilter]
  );

  // 3 dòng đầu của thống kê: theo trận đang xem
  const stats = useMemo(() => calcMatchStats(visibleMatches), [visibleMatches]);

  // KHÔNG được đặt hook nào sau các lệnh return sớm bên dưới
  if (loading) return <p>Đang tải lịch thi đấu...</p>;
  if (error) return <p>Không tải được lịch thi đấu</p>;

  const lastIndex = standings.length - 1;
  const leader = standings[0];

  const handleGoals = (match, side, e) => {
    const value = e.target.valueAsNumber;
    if (!isValidGoals(value)) return; // trống hoặc sai thì bỏ qua
    dispatch({
      type: 'SET_GOALS',
      payload: {
        id: match.id,
        homeGoals: side === 'home' ? value : match.homeGoals,
        awayGoals: side === 'away' ? value : match.awayGoals,
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    const home = Number(form.home);
    const away = Number(form.away);

    if (!form.home) errs.home = 'Hãy chọn đội nhà';
    if (!form.away) {
      errs.away = 'Hãy chọn đội khách';
    } else if (form.home && form.home === form.away) {
      errs.away = 'Hai đội phải khác nhau';
    } else if (
      form.home &&
      matches.some(
        (m) => (m.home === home && m.away === away) ||
               (m.home === away && m.away === home)
      )
    ) {
      errs.away = 'Hai đội đã đá với nhau rồi';
    }

    const hg = form.homeGoals === '' ? NaN : Number(form.homeGoals);
    const ag = form.awayGoals === '' ? NaN : Number(form.awayGoals);
    if (!isValidGoals(hg)) errs.homeGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    if (!isValidGoals(ag)) errs.awayGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    dispatch({
      type: 'ADD',
      payload: {
        round: Number(form.round),
        home: Number(form.home),
        away: Number(form.away),
        homeGoals: Number(form.homeGoals),
        awayGoals: Number(form.awayGoals),
      },
    });
    setForm(EMPTY_FORM);
    homeRef.current.focus();
  };

  return (
    <div className="app" data-build={BUILD_TAG}>
      <h1>Giải bóng đá khoa</h1>

      <section>
        <h2>Bảng xếp hạng</h2>
        <table>
          <thead>
            <tr>
              <th>Hạng</th><th>Đội</th><th>Trận</th><th>Thắng</th><th>Hòa</th>
              <th>Thua</th><th>BT</th><th>BB</th><th>HS</th><th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((t, i) => (
              <tr key={t.id} style={i === lastIndex ? { color: '#c62828' } : undefined}>
                <td>{i + 1}</td><td>{t.name}</td><td>{t.played}</td>
                <td>{t.won}</td><td>{t.drawn}</td><td>{t.lost}</td>
                <td>{t.gf}</td><td>{t.ga}</td><td>{formatDiff(t.diff)}</td>
                <td>{t.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
                    <td>
                      <button onClick={() => dispatch({ type: 'REMOVE', payload: m.id })}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Thêm trận đấu</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="round">Vòng</label>
            <select id="round" name="round" value={form.round} onChange={handleChange}>
              {ROUNDS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="home">Đội nhà</label>
            <select id="home" name="home" ref={homeRef} value={form.home} onChange={handleChange}>
              <option value="">-- Chọn đội --</option>
              {TEAMS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {errors.home && <div role="alert">{errors.home}</div>}
          </div>

          <div>
            <label htmlFor="away">Đội khách</label>
            <select id="away" name="away" value={form.away} onChange={handleChange}>
              <option value="">-- Chọn đội --</option>
              {TEAMS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {errors.away && <div role="alert">{errors.away}</div>}
          </div>

          <div>
            <label htmlFor="homeGoals">Bàn thắng đội nhà</label>
            <input id="homeGoals" name="homeGoals" type="number"
                   value={form.homeGoals} onChange={handleChange} />
            {errors.homeGoals && <div role="alert">{errors.homeGoals}</div>}
          </div>

          <div>
            <label htmlFor="awayGoals">Bàn thắng đội khách</label>
            <input id="awayGoals" name="awayGoals" type="number"
                   value={form.awayGoals} onChange={handleChange} />
            {errors.awayGoals && <div role="alert">{errors.awayGoals}</div>}
          </div>

          <button type="submit">Thêm trận</button>
        </form>
      </section>
    </div>
  );
}

export default App;