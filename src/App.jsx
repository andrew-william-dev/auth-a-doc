import { BrowserRouter, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import './index.css';
import ScrollToTop from './components/ScrollToTop';
import Landing from './pages/Landing';
import DocsLayout from './layouts/DocsLayout';
import OAuthPage from './pages/docs/OAuthPage';
import PKCEPage from './pages/docs/PKCEPage';
import DevPortalPage from './pages/docs/DevPortalPage';
import GettingStartedPage from './pages/docs/GettingStartedPage';
import LoginFnPage from './pages/docs/LoginFnPage';
import HandleRedirectPage from './pages/docs/HandleRedirectPage';
import IntegrationPage from './pages/docs/IntegrationPage';

function Navbar() {
  const loc = useLocation();
  const inDocs = loc.pathname.startsWith('/docs');
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="brand-icon">A</div>
        Auth-A
      </Link>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
        <NavLink to="/docs/oauth" className={() => `nav-link ${inDocs ? 'active' : ''}`}>Docs</NavLink>
        <a href="https://auth-a.vercel.app" target="_blank" rel="noreferrer" className="nav-link">DevPortal ↗</a>
        <a href="https://auth-a.vercel.app" target="_blank" rel="noreferrer" className="navbar-cta">Get Started →</a>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<OAuthPage />} />
          <Route path="oauth" element={<OAuthPage />} />
          <Route path="pkce" element={<PKCEPage />} />
          <Route path="devportal" element={<DevPortalPage />} />
          <Route path="getting-started" element={<GettingStartedPage />} />
          <Route path="login-fn" element={<LoginFnPage />} />
          <Route path="handle-redirect" element={<HandleRedirectPage />} />
          <Route path="integration" element={<IntegrationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
