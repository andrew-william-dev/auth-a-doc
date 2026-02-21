import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import { StepFlow } from '../../components/Diagrams';

const SECTIONS = [
    { id: 'problem', label: 'The problem' },
    { id: 'what-is-pkce', label: 'What is PKCE?' },
    { id: 'how-it-works', label: 'How PKCE works' },
    { id: 's256', label: 'The S256 method' },
    { id: 'auth-a', label: 'PKCE in auth-a-lib' },
];

export default function PKCEPage() {
    return (
        <>
            <div className="docs-content">
                <h1>What is PKCE?</h1>
                <p className="doc-lead">
                    PKCE — Proof Key for Code Exchange — is a security extension to the OAuth 2.0 Authorization Code flow.
                    It prevents attackers from intercepting authorization codes and exchanging them for tokens.
                    Auth-A enforces PKCE on every login.
                </p>

                <h2 id="problem">The problem PKCE solves</h2>
                <p>
                    In a standard Authorization Code flow, the authorization code travels through the browser URL.
                    A malicious app registered with the same redirect URI could intercept that code and exchange
                    it for a token — stealing the user's session.
                </p>
                <p>
                    The fix: prove that the party exchanging the code is the <em>same party</em> that started the login.
                    That's exactly what PKCE does.
                </p>

                <div className="callout tip">
                    <div className="callout-icon">✅</div>
                    <div>
                        <div className="callout-title">PKCE is recommended for all clients</div>
                        <p>The OAuth 2.1 draft requires PKCE for all grant types including web apps.
                            Auth-A enforces it universally — you don't configure it, it just works.</p>
                    </div>
                </div>

                <h2 id="what-is-pkce">What is PKCE?</h2>
                <p>Before starting a login, the SDK generates two related values:</p>
                <ul>
                    <li>
                        <strong>code_verifier</strong> — a cryptographically random 32-byte secret (stored client-side, never sent in a URL)
                    </li>
                    <li>
                        <strong>code_challenge</strong> — the SHA-256 hash of the verifier, encoded in base64url.
                    </li>
                </ul>
                <p>
                    The server stores the challenge. When the client later exchanges the authorization code,
                    it also sends the verifier. The server hashes the verifier and compares — if they match,
                    the exchange is legitimate.
                </p>

                <h2 id="how-it-works">How PKCE works — step by step</h2>
                <div className="diagram">
                    <div className="diagram-title">PKCE Full Flow</div>
                    <StepFlow steps={[
                        { title: 'Generate a random verifier', desc: '32 cryptographically random bytes via Web Crypto API — kept secret in sessionStorage' },
                        { title: 'Derive a challenge', desc: 'code_challenge = BASE64URL(SHA-256(verifier)) — one-way hash, safe to send publicly' },
                        { title: 'Auth request includes the challenge', desc: 'Login URL includes code_challenge and code_challenge_method=S256. DevPortal stores it alongside the auth code.' },
                        { title: 'User authenticates on DevPortal', desc: 'DevPortal shows the login form — your app never sees credentials' },
                        { title: 'Client sends code + verifier', desc: 'auth-a-lib reads the code from the callback URL and POSTs it together with the raw verifier to the token endpoint' },
                        { title: 'DevPortal verifies the pair', desc: 'SHA-256(verifier) is computed and compared to the stored challenge. Match → token issued. No match → request rejected.' },
                    ]} />
                </div>

                <h2 id="s256">The S256 method</h2>
                <p>Auth-A uses the <code>S256</code> challenge method. The challenge is:</p>
                <CodeBlock file="formula">
                    {`code_challenge = BASE64URL(SHA256(ASCII(code_verifier)))`}
                </CodeBlock>
                <p>
                    BASE64URL encodes using <code>-</code> instead of <code>+</code>, <code>_</code> instead of <code>/</code>, and no padding.
                    This makes it safely embeddable in URLs. The <code>plain</code> method (where verifier equals challenge) is not accepted by Auth-A.
                </p>

                <h2 id="auth-a">PKCE in auth-a-lib</h2>
                <p>
                    You never implement any of this yourself. <code>auth-a-lib</code> handles it entirely inside <code>login()</code>:
                </p>
                <CodeBlock file="src/sdk/idp.js (simplified)">
                    {`// 1. Generate 32 cryptographically random bytes
const array = new Uint8Array(32);
crypto.getRandomValues(array);
const verifier = base64UrlEncode(array);

// 2. Hash the verifier with SHA-256 (Web Crypto API)
const encoder = new TextEncoder();
const data = encoder.encode(verifier);
const hash = await crypto.subtle.digest('SHA-256', data);
const challenge = base64UrlEncode(new Uint8Array(hash));

// 3. Store verifier — never sent over the network
sessionStorage.setItem('auth_a_code_verifier', verifier);

// 4. Redirect with challenge in the URL
location.href = authUrl
  + '&code_challenge=' + challenge
  + '&code_challenge_method=s256';`}
                </CodeBlock>

                <div className="callout info">
                    <div className="callout-icon">🔒</div>
                    <div>
                        <div className="callout-title">Why sessionStorage and not localStorage?</div>
                        <p>sessionStorage is scoped to the current browser tab and cleared when the tab closes.
                            The verifier is only needed for a single login — sessionStorage is the right scope.</p>
                    </div>
                </div>

                <div className="page-nav">
                    <Link to="/docs/oauth" className="page-nav-btn">
                        <span className="page-nav-label">← Previous</span>
                        <span className="page-nav-title">What is OAuth 2.0?</span>
                    </Link>
                    <Link to="/docs/devportal" className="page-nav-btn next">
                        <span className="page-nav-label">Next →</span>
                        <span className="page-nav-title">How DevPortal Works</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
