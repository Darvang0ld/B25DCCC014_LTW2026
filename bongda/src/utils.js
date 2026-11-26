import { TEAMS, POINTS, MAX_GOALS } from './data';

export const getTeamName = (id) =>
  TEAMS.find((t) => t.id === id)?.name ?? '';

export const getResult = ({ homeGoals, awayGoals }) => {
  if (homeGoals > awayGoals) return 'home';
  if (homeGoals < awayGoals) return 'away';
  return 'draw';
};

export const isValidGoals = (n) =>
  Number.isInteger(n) && n >= 0 && n <= MAX_GOALS;

export const calcStandings = (matches) => {
  // luôn đủ 6 đội, tạo mảng MỚI
  const rows = TEAMS.map((t) => ({
    id: t.id, name: t.name,
    played: 0, won: 0, drawn: 0, lost: 0,
    gf: 0, ga: 0, diff: 0, points: 0,
  }));
  const byId = {};
  rows.forEach((r) => { byId[r.id] = r; });

  matches.forEach((m) => {
    const h = byId[m.home];
    const a = byId[m.away];
    if (!h || !a) return;
    h.played += 1; a.played += 1;
    h.gf += m.homeGoals; h.ga += m.awayGoals;
    a.gf += m.awayGoals; a.ga += m.homeGoals;
    const result = getResult(m);
    if (result === 'home') {
      h.won += 1; a.lost += 1; h.points += POINTS.win;
    } else if (result === 'away') {
      a.won += 1; h.lost += 1; a.points += POINTS.win;
    } else {
      h.drawn += 1; a.drawn += 1;
      h.points += POINTS.draw; a.points += POINTS.draw;
    }
  });

  rows.forEach((r) => { r.diff = r.gf - r.ga; });

  return rows.sort(
    (x, y) =>
      y.points - x.points ||
      y.diff - x.diff ||
      y.gf - x.gf ||
      x.name.localeCompare(y.name, 'vi')
  );
};

export const calcMatchStats = (matches) => {
  const counts = { home: 0, draw: 0, away: 0 };
  let goals = 0;
  matches.forEach((m) => {
    goals += m.homeGoals + m.awayGoals;
    counts[getResult(m)] += 1;
  });
  const count = matches.length;
  const average = count === 0 ? 0 : Math.round((goals / count) * 100) / 100;
  return { count, goals, average, counts };
};