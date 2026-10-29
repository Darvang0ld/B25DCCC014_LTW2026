const BUILD_TAG = "tp-4186";
/* eslint-disable import/first */
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');

  // Mounting: gọi API lấy câu hỏi, cleanup bằng controller.abort()
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        if (!Array.isArray(res.data)) throw new Error('Dữ liệu không hợp lệ');
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return; // request bị hủy thì bỏ qua
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  // Trang nào cần dữ liệu câu hỏi thì bọc bằng hàm này
  const withStatus = (page) => {
    if (loading) return <p className="notice">Đang tải câu hỏi...</p>;
    if (error) return <p className="notice error">Không tải được câu hỏi</p>;
    return page;
  };

  return (
    <Routes>
      <Route path="/" element={<Layout buildTag={BUILD_TAG} />}>
        <Route
          index
          element={<Home playerName={playerName} setPlayerName={setPlayerName} />}
        />
        <Route
          path="play"
          element={
            playerName.trim()
              ? withStatus(<Play questions={questions} playerName={playerName} />)
              : <Navigate to="/" replace />
          }
        />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<History />} />
        <Route path="questions" element={withStatus(<QuestionBank questions={questions} />)} />
        <Route path="questions/:id" element={withStatus(<QuestionDetail questions={questions} />)} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
