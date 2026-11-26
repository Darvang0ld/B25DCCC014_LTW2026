import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NoticeContext = createContext(null);

export const NoticeProvider = ({ children }) => {
  
  const [notice, setNotice] = useState(null);

  const showNotice = useCallback((text) => {
    setNotice({ text });
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  return (
    <NoticeContext.Provider value={showNotice}>
      {notice && <div role="status" className="notice">{notice.text}</div>}
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const showNotice = useContext(NoticeContext);
  if (!showNotice) throw new Error('useNotice phải dùng bên trong NoticeProvider');
  return { showNotice };
};