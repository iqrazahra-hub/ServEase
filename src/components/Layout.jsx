import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = {
  customer: [['/workers', 'Find workers'], ['/requests', 'My requests'], ['/bookings', 'Bookings']],
  worker: [['/jobs', 'Open jobs'], ['/bookings', 'My bookings'], ['/my-profile', 'My profile']],
  admin: [['/admin', 'Admin dashboard'], ['/workers', 'Workers']],
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const links = user ? LINKS[user.role] : [['/workers', 'Find workers']];

  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <Link to="/" className="brand">Serv<span>Ease</span></Link>
          <nav className="nav">
            {links.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
          </nav>
          <div className="nav-end">
            {user ? (
              <>
                <span className="who">{user.name}</span>
                <button className="btn ghost sm" onClick={() => { logout(); nav('/'); }}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn ghost sm">Log in</Link>
                <Link to="/register" className="btn sm">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="wrap page">{children}</main>
      <footer className="footer wrap">ServEase - a MERN stack project</footer>
    </>
  );
}
