import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';

const SECTIONS = [
  { id: 'install', label: 'Installation' },
  { id: 'prerequisites', label: 'Prerequisites' },
  { id: 'initialize', label: 'Initialize the client' },
  { id: 'pages', label: 'Two pages, two calls' },
  { id: 'token', label: 'Using the token' },
];

export default function GettingStartedPage() {
  return (
    <>
      <div className="docs-content">
        <h1>Getting Started with auth-a-lib</h1>
        <p className="doc-lead">
          auth-a-lib is the official JavaScript SDK for integrating your web application with DevPortal.
          It wraps the full OAuth 2.0 + PKCE flow into two simple method calls.
          This guide gets you from installation to a working login in minutes.
        </p>

        <h2 id="install">Installation</h2>
        <CodeBlock file="terminal">
          {`npm install auth-a-lib`}
        </CodeBlock>
        <CodeBlock file="terminal (yarn)">
          {`yarn add auth-a-lib`}
        </CodeBlock>

        <h2 id="prerequisites">Prerequisites</h2>
        <p>Before writing any code, make sure you have:</p>
        <ol>
          <li>
            <strong>A DevPortal account</strong> —{' '}
            <a href="https://auth-a.vercel.app" target="_blank" rel="noreferrer">sign up at auth-a.vercel.app</a>
          </li>
          <li><strong>A registered application</strong> — from the DevPortal dashboard</li>
          <li><strong>Your Client ID</strong> — visible on your app's dashboard</li>
          <li>
            <strong>A redirect URI registered</strong> — the URL in your app that handles the callback
            (e.g. <code>http://localhost:5173/callback</code>)
          </li>
        </ol>

        <div className="callout info">
          <div className="callout-icon">💡</div>
          <div>
            <div className="callout-title">Client ID vs Client Secret</div>
            <p>auth-a-lib only needs your <strong>Client ID</strong> — it's public and safe in frontend code.
              Your Client Secret is server-side only and should <em>never</em> be in frontend code.</p>
          </div>
        </div>

        <h2 id="initialize">Initialize the client</h2>
        <p>Create one instance and export it for reuse across your app:</p>
        <CodeBlock file="src/auth.js">
          {`import { ClientApp } from 'auth-a-lib';

const auth = new ClientApp('app_your_client_id_here');

export default auth;`}
        </CodeBlock>

        <div className="callout tip">
          <div className="callout-icon">⚡</div>
          <div>
            <div className="callout-title">One instance everywhere</div>
            <p>Export the <code>auth</code> object from a module and import it wherever you need it — no need for multiple instances.</p>
          </div>
        </div>

        <h2 id="pages">Two pages, two calls</h2>

        <h3>Login page — start the flow</h3>
        <CodeBlock file="src/pages/Login.jsx">
          {`import auth from '../auth';

function LoginPage() {
  const handleLogin = async () => {
    // Redirects the user to Auth-A DevPortal
    await auth.login('https://yourapp.com/callback');
  };

  return (
    <button onClick={handleLogin}>
      Sign in with Auth-A
    </button>
  );
}`}
        </CodeBlock>

        <h3>Callback page — exchange code for token</h3>
        <CodeBlock file="src/pages/Callback.jsx">
          {`import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../auth';

function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    async function exchange() {
      const result = await auth.handleRedirect();

      if (result?.access_token) {
        localStorage.setItem('token', result.access_token);
        navigate('/dashboard');
      } else {
        navigate('/login?error=auth_failed');
      }
    }
    exchange();
  }, []);

  return <p>Authenticating...</p>;
}`}
        </CodeBlock>

        <h2 id="token">Using the token</h2>
        <p>Send it in the <code>Authorization</code> header on authenticated API requests:</p>
        <CodeBlock file="src/api.js">
          {`const token = localStorage.getItem('token');

const response = await fetch('https://your-api.com/protected', {
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json',
  }
});`}
        </CodeBlock>

        <p>To read user identity and role, decode the JWT payload:</p>
        <CodeBlock file="src/utils/token.js">
          {`function decodeToken(token) {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
}

const { user, role, exp } = decodeToken(
  localStorage.getItem('token')
);
// user.username => "alice"
// role          => "admin"`}
        </CodeBlock>

        <div className="callout warning">
          <div className="callout-icon">⚠️</div>
          <div>
            <div className="callout-title">Always verify tokens server-side</div>
            <p>Client-side decoding is fine for personalising UI.
              For API route protection, always verify the token signature on your server — never trust unverified client-side decoding for access control.</p>
          </div>
        </div>

        <div className="page-nav">
          <Link to="/docs/devportal" className="page-nav-btn">
            <span className="page-nav-label">← Previous</span>
            <span className="page-nav-title">How DevPortal Works</span>
          </Link>
          <Link to="/docs/login-fn" className="page-nav-btn next">
            <span className="page-nav-label">Next →</span>
            <span className="page-nav-title">login() deep dive</span>
          </Link>
        </div>
      </div>
    </>
  );
}
