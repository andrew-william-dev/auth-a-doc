import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import { StepFlow } from '../../components/Diagrams';

const SECTIONS = [
    { id: 'usage', label: 'Usage' },
    { id: 'what-it-does', label: 'What it does' },
];

export default function HandleRedirectPage() {
    return (
        <>
            <div className="docs-content">
                <h1>auth.handleRedirect()</h1>
                <p className="doc-lead">
                    Finishes the authentication flow by exchanging the authorization code for a JWT access token.
                    It automatically reads the <code>code</code> from the URL, verifies it against the <code>code_verifier</code> in sessionStorage,
                    and returns the user's identity.
                </p>

                <h2 id="usage">Usage</h2>
                <CodeBlock file="src/callback.js">
                    {`const result = await auth.handleRedirect();

if (result) {
    console.log('Logged in as:', result.user.username);
    console.log('Token:', result.access_token);
}`}
                </CodeBlock>

                <div className="method-card">
                    <div className="method-header">
                        <div className="method-badge">async</div>
                        <div className="method-name">auth.handleRedirect()</div>
                    </div>
                    <div className="method-body">
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                            No parameters — reads everything from the current URL and <code>sessionStorage</code>.
                        </p>
                        <div className="method-returns">
                            <strong>Returns:</strong> <code>Promise&lt;TokenResponse | null&gt;</code>
                            — <code>null</code> if no <code>code</code> is in the URL; a <code>TokenResponse</code> on success.
                        </div>
                    </div>
                </div>

                <h2 id="what-it-does">What it does</h2>
                <div className="diagram">
                    <div className="diagram-title">handleRedirect() Internals</div>
                    <StepFlow steps={[
                        { title: 'Read ?code= from URL', desc: 'URLSearchParams extracts the authorization code that DevPortal appended to your redirect URI' },
                        { title: 'Clean the URL', desc: 'history.replaceState removes ?code= from the browser address bar and history — codes should never persist or be bookmarked' },
                        { title: 'Retrieve verifier', desc: 'sessionStorage.getItem("auth_a_code_verifier") gets the secret verifier generated during the login() step' },
                        { title: 'Exchange code for token', desc: 'SDK makes a POST request to Auth-A\'s /oauth/token endpoint with client_id, code, and code_verifier' },
                        { title: 'Server verifies and signs', desc: 'Auth-A verifies the verifier against the original challenge. If valid, it issues a signed JWT containing user info and roles.' },
                    ]} />
                </div>

                <div className="page-nav">
                    <Link to="/docs/login-fn" className="page-nav-btn">
                        <span className="page-nav-label">← Previous</span>
                        <span className="page-nav-title">auth.login()</span>
                    </Link>
                    <Link to="/docs/integration" className="page-nav-btn next">
                        <span className="page-nav-label">Next →</span>
                        <span className="page-nav-title">Full Integration Example</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
