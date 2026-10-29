import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ buildTag }) => (
  <div className="app" data-build={buildTag}>
    <NavBar />
    <main className="content">
      <Outlet />
    </main>
  </div>
);

export default Layout;
