import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectMatches, addMatch } from '../features/matchesSlice';
import { useNotice } from '../context/NoticeContext';
import { TEAMS, ROUNDS } from '../data';
import { getTeamName, isValidGoals } from '../utils';

const EMPTY_FORM = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };
const GOALS_ERROR = 'Số bàn thắng phải là số nguyên từ 0 đến 20';

const AddMatchForm = () => {
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const { showNotice } = useNotice();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const homeRef = useRef(null);

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
    if (!isValidGoals(hg)) errs.homeGoals = GOALS_ERROR;
    if (!isValidGoals(ag)) errs.awayGoals = GOALS_ERROR;
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const home = Number(form.home);
    const away = Number(form.away);
    dispatch(addMatch({
      round: Number(form.round),
      home,
      away,
      homeGoals: Number(form.homeGoals),
      awayGoals: Number(form.awayGoals),
    }));
    showNotice(`Đã thêm trận ${getTeamName(home)} - ${getTeamName(away)}`);
    setForm(EMPTY_FORM);
    homeRef.current.focus();
  };

  return (
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
  );
};

export default AddMatchForm;