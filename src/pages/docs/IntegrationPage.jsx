import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';

const SECTIONS = [
  { id: 'overview', label: "What we're building" },
  { id: 'setup', label: 'Project setup' },
  { id: 'auth-module', label: 'Auth module' },
  { id: 'login-page', label: 'Login page' },
  { id: 'callback-page', label: 'Callback page' },
  { id: 'protected-page', label: 'Protected page' },
  { id: 'guard', label: 'Route guard' },
];

export default function IntegrationPage() {
  return (
    <>
      <div className="docs-content">
        <h1>Full Integration Example</h1>
        <p className="doc-lead">
          A complete, working example of auth-a-lib integrated into a React + React Router application.
          Covers the auth module, login page, callback handler, protected dashboard, and a route guard
          with token expiry checking.
        </p>

        <h2 id="overview">Route structure</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', margin: '1.5rem 0' }}>
          {[
            { route: '/login', label: 'Login Page', desc: 'Shows "Sign in" button', color: '#3b82f6' },
            { route: '/callback', label: 'Callback Page', desc: 'Exchanges code for token', color: '#8b5cf6' },
            { route: '/dashboard', label: 'Dashboard', desc: 'Protected — requires token', color: '#06d6a0' },
          ].map(r => (
            <div key={r.route} style={{
              background: 'var(--color-surface-2)', border: `1px solid ${r.color}33`,
              borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: r.color, marginBottom: '0.4rem' }}>{r.route}</div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.3rem' }}>{r.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{r.desc}</div>
            </div>
          ))}
        </div>

        <h2 id="setup">Project setup</h2>
        <CodeBlock file="terminal">
          {`npm create vite@latest my-app -- --template react
cd my-app
npm install auth-a-lib react-router-dom`}
        </CodeBlock>

        <h2 id="auth-module">Auth module</h2>
        <CodeBlock file="src/auth.js">
          {`import { ClientApp } from 'auth-a-lib';

const auth = new ClientApp('app_your_client_id_here');

export default auth;`}
        </CodeBlock>

        <h2 id="login-page">Login page</h2>
        <CodeBlock file="src/pages/Login.jsx">
          {`import auth from '../auth';

export default function Login() {
  const handleLogin = async () => {
    try {
      // Dynamic redirect URI — works in dev and production
      await auth.login(window.location.origin + '/callback');
    } catch (err) {
      console.error('Login failed:', err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem' }}>
      <h1>Welcome</h1>
      <p>Sign in to continue.</p>
      <button onClick={handleLogin}>Sign in with Auth-A</button>
    </div>
  );
}`}
        </CodeBlock>

        <div className="callout tip">
          <div className="callout-icon">⚡</div>
          <div>
            <div className="callout-title">Dynamic redirect URI</div>
            <p>Using <code>window.location.origin + '/callback'</code> means the same code works in development and production.
              Register both <code>http://localhost:5173/callback</code> and your production URL in DevPortal.</p>
          </div>
        </div>

        <h2 id="callback-page">Callback page</h2>
        <CodeBlock file="src/pages/Callback.jsx">
          {`import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../auth';

export default function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function exchange() {
      try {
        const result = await auth.handleRedirect();

        if (result === null) {
          navigate('/login');
          return;
        }

        if (result.success && result.access_token) {
          localStorage.setItem('token', result.access_token);
          localStorage.setItem('user',  JSON.stringify(result.user));
          localStorage.setItem('role',  result.role);
          navigate('/dashboard');
        } else {
          setError('Authentication failed. Please try again.');
        }
      } catch (err) {
        setError('An error occurred during authentication.');
        console.error(err);
      }
    }
    exchange();
  }, [navigate]);

  if (error) return (
    <div>
      <p>{error}</p>
      <a href="/login">Try again</a>
    </div>
  );

  return <p>Authenticating, please wait...</p>;
}`}
        </CodeBlock>

        <h2 id="protected-page">Protected page</h2>
        <CodeBlock file="src/pages/Dashboard.jsx">
          {`import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: <strong>{role}</strong></p>

      {role === 'admin' && (
        <div>
          <h2>Admin Panel</h2>
          <p>You have admin access to this application.</p>
        </div>
      )}

      <button onClick={handleLogout}>Sign out</button>
    </div>
  );
}`}
        </CodeBlock>

        <h2 id="guard">Route guard</h2>
        <CodeBlock file="src/components/ProtectedRoute.jsx">
          {`import { Navigate } from 'react-router-dom';

function isTokenExpired(token) {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= exp * 1000;
  } catch {
    return true; // Treat invalid tokens as expired
  }
}

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}`}
        </CodeBlock>

        <CodeBlock file="src/App.jsx">
          {`import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login    from './pages/Login';
import Callback from './pages/Callback';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}`}
        </CodeBlock>

        <div className="callout info">
          <div className="callout-icon">🔒</div>
          <div>
            <div className="callout-title">Frontend route guards are UX, not security</div>
            <p>Client-side route guards prevent unauthenticated users from seeing protected UI.
              For APIs that expose sensitive data, always verify the JWT signature server-side.</p>
          </div>
        </div>

        <div className="page-nav">
          <Link to="/docs/handle-redirect" className="page-nav-btn">
            <span className="page-nav-label">← Previous</span>
            <span className="page-nav-title">handleRedirect()</span>
          </Link>
          <div />
        </div>
      </div>
    </>
  );
}
