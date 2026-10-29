import { LETTERS } from '../data';

// percents: mảng 4 số, mỗi cột là một div có chiều rộng bằng tỉ lệ %
const AudienceChart = ({ percents }) => (
  <div className="chart">
    <p className="chart-title">Ý kiến khán giả</p>
    {percents.map((percent, i) => (
      <div key={i} className="chart-row">
        <div className="bar" style={{ width: `${percent}%` }}>
          {`${LETTERS[i]}: ${percent}%`}
        </div>
      </div>
    ))}
  </div>
);

export default AudienceChart;
