import { formatDiff } from '../data';

const StandingsTable = ({ standings }) => {
  const lastIndex = standings.length - 1;
  return (
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
  );
};

export default StandingsTable;