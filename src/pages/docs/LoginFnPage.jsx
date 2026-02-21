import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import { StepFlow } from '../../components/Diagrams';

const SECTIONS = [
    { id: 'usage', label: 'Usage' },
    { id: 'parameters', label: 'Parameters' },
    { id: 'what-it-does', label: 'What it does' },
];

export default function LoginFnPage() {
    return (
        <>
            <div className="docs-content">
                <h1>auth.login()</h1>
                <p className="doc-lead">
                    Starts the OAuth 2.0 Authorization Code flow with PKCE. It generates a verifier,
                    computes a challenge, and redirects the user to the DevPortal login screen.
                </p>

                <h2 id="usage">Usage</h2>
                <CodeBlock file="src/login.js">
                    {`await auth.login('https://myapp.com/callback');`}
                </CodeBlock>

                <h2 id="parameters">Parameters</h2>
                <div className="method-card">
                    <div className="method-header">
                        <div className="method-badge">async</div>
                        <div className="method-name">auth.login(redirectURL)</div>
                    </div>
                    <div className="method-body">
                        <table className="param-table">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Type</th>
                                    <th>Required</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>redirectURL</code></td>
                                    <td><code>string</code></td>
                                    <td><span className="param-required">required</span></td>
                                    <td>The URL Auth-A redirects back to after authentication. Must exactly match the Redirect URI registered in your DevPortal app.</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="method-returns">
                            <strong>Returns:</strong> <code>Promise&lt;void&gt;</code> — resolves then immediately redirects,
                            so you typically won't observe the resolution.
                        </div>
                    </div>
                </div>

                <h2 id="what-it-does">What it does</h2>
                <div className="diagram">
                    <div className="diagram-title">login() internals</div>
                    <StepFlow steps={[
                        { title: 'Validate clientId', desc: 'Checks that a Client ID was provided when constructing ClientApp — throws if missing' },
                        { title: 'Validate redirectURL', desc: 'Checks that redirectURL is not empty — throws if missing' },
                        { title: 'Generate 32 random bytes → code_verifier', desc: 'Uses crypto.getRandomValues() — OS-level randomness, cryptographically unpredictable, base64url-encoded' },
                        { title: 'SHA-256(verifier) → code_challenge', desc: 'One-way hash computed with Web Crypto API. Safe to transmit publicly. Server can verify without knowing the verifier.' },
                        { title: 'Store verifier in sessionStorage', desc: 'sessionStorage.setItem("auth_a_code_verifier", verifier) — kept in this tab\'s memory only, never sent over the network' },
                        { title: 'Redirect to DevPortal', desc: 'Constructs the URL with response_type=code, client_id, redirect_uri, code_challenge, and code_challenge_method=S256' },
                    ]} />
                </div>

                <div className="page-nav">
                    <Link to="/docs/getting-started" className="page-nav-btn">
                        <span className="page-nav-label">← Previous</span>
                        <span className="page-nav-title">Getting Started</span>
                    </Link>
                    <Link to="/docs/handle-redirect" className="page-nav-btn next">
                        <span className="page-nav-label">Next →</span>
                        <span className="page-nav-title">auth.handleRedirect()</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
