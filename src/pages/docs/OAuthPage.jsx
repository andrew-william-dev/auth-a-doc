import { Link } from 'react-router-dom';

const SECTIONS = [
    { id: 'what-is-oauth', label: 'The core idea' },
    { id: 'why-oauth', label: 'Why use OAuth?' },
    { id: 'actors', label: 'The Four Actors' },
    { id: 'the-flow', label: 'Authorization Code Flow' },
    { id: 'tokens', label: 'Access Tokens' },
];

export default function OAuthPage() {
    return (
        <>
            <div className="docs-content">
                <h1>What is OAuth 2.0?</h1>
                <p className="doc-lead">
                    OAuth 2.0 is the industry-standard protocol for authorization. It lets users grant your application
                    access to their identity without ever giving you their password.
                    Instead of handling credentials directly, your app receives a secure, signed token.
                </p>

                <h2 id="what-is-oauth">The core idea</h2>
                <p>
                    Imagine logging into a third-party app using your Google account. Google asks you
                    "do you want to allow this app to know your name and email?" — if you say yes,
                    Google gives that app a token proving who you are. The app never got your Google password.
                    That entire interaction is OAuth.
                </p>
                <p>
                    Auth-A uses it to confirm: <em>"yes, this user has access to this application, and here's their role."</em>
                </p>

                <div className="callout info">
                    <div className="callout-icon">💡</div>
                    <div>
                        <div className="callout-title">Authorization vs Authentication</div>
                        <p><strong>Authentication</strong> = proving who you are. <strong>Authorization</strong> = proving what you're allowed to do.
                            OAuth 2.0 is primarily authorization, but when combined with identity info in a token, it covers both.</p>
                    </div>
                </div>

                <h2 id="why-oauth">Why use OAuth instead of passwords?</h2>
                <p>
                    Traditional password systems are difficult to secure. Storing passwords safely requires salt, hashing, and protection against leaks.
                    OAuth shifts the responsibility back to the Identity Provider (Auth-A).
                </p>
                <ul>
                    <li><strong>Security:</strong> Credentials are never stored in your application.</li>
                    <li><strong>Standardized:</strong> Works across mobile, web, and server-side apps.</li>
                    <li><strong>Frictionless:</strong> If a user is already logged into one Auth-A app, they can log into another with one click (SSO).</li>
                </ul>

                <h2 id="actors">The four actors in OAuth</h2>
                <div className="diagram">
                    <div className="diagram-title">OAuth Actors</div>
                    {/* Inline actor cards diagram */}
                    <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto', padding: '0.25rem 0' }}>
                        {[
                            { icon: '👤', name: 'Resource Owner', desc: 'The user who owns the account and grants permission', color: '#3b82f6' },
                            { icon: '🌐', name: 'Client App', desc: 'Your app — requests access on the user\'s behalf', color: '#8b5cf6' },
                            { icon: '🔐', name: 'Auth Server', desc: 'Auth-A / DevPortal — verifies user and issues tokens', color: '#06d6a0' },
                            { icon: '📦', name: 'Resource Server', desc: 'The API your client app wants to access', color: '#fbbf24' },
                        ].map((a, i, arr) => (
                            <div key={a.name} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                <div style={{
                                    flex: '1',
                                    minWidth: '130px',
                                    background: `rgba(${a.color === '#3b82f6' ? '59,130,246' : a.color === '#8b5cf6' ? '139,92,246' : a.color === '#06d6a0' ? '6,214,160' : '251,191,36'},0.07)`,
                                    border: `1px solid ${a.color}33`,
                                    borderRadius: '10px',
                                    padding: '1.1rem 0.9rem',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}>
                                    <span style={{ fontSize: '1.7rem' }}>{a.icon}</span>
                                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: a.color }}>{a.name}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{a.desc}</span>
                                </div>
                                {i < arr.length - 1 && (
                                    <div key={`arr-${i}`} style={{ display: 'flex', alignItems: 'center', padding: '0 4px', flexShrink: 0 }}>
                                        <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                                            <line x1="2" y1="8" x2="22" y2="8" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="3 2" />
                                            <polygon points="22,4 28,8 22,12" fill="rgba(255,255,255,0.25)" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <h2 id="the-flow">The Authorization Code Flow</h2>
                <p>
                    Auth-A uses the <strong>Authorization Code Flow</strong> — the most secure OAuth grant type.
                    Here's what happens step by step when a user logs in to your app:
                </p>

                <div className="diagram">
                    <div className="diagram-title">Authorization Code Flow</div>
                    {/* Inline numbered timeline */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {[
                            { n: '1', title: 'User clicks "Sign In"', desc: 'Your app calls auth.login() — redirecting to Auth-A with your Client ID, redirect URL, and PKCE challenge.' },
                            { n: '2', title: 'User logs in on Auth-A', desc: 'Auth-A shows the login form. Credentials are entered on Auth-A\'s domain. You never see the password.' },
                            { n: '3', title: 'Auth-A issues an authorization code', desc: 'After successful login, Auth-A redirects back to your redirect URL: ?code=abc123 (short-lived, single-use).' },
                            { n: '4', title: 'Your app exchanges the code', desc: 'auth-a-lib sends the code + PKCE verifier to Auth-A\'s token endpoint. Auth-A verifies and returns a JWT.' },
                            { n: '5', title: 'Access token returned', desc: 'The JWT contains the user\'s identity and role. Store it and use it to identify the user in your app.' },
                        ].map((s, i, arr) => (
                            <div key={s.n} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', position: 'relative' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, fontSize: '0.8rem', color: '#fff', flexShrink: 0,
                                        zIndex: 1, position: 'relative',
                                    }}>{s.n}</div>
                                    {i < arr.length - 1 && (
                                        <div style={{ width: '2px', flex: 1, minHeight: '24px', background: 'linear-gradient(180deg, rgba(59,130,246,0.4), rgba(139,92,246,0.2))', margin: '2px 0' }} />
                                    )}
                                </div>
                                <div style={{ paddingBottom: i < arr.length - 1 ? '1rem' : 0, paddingTop: '4px' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '3px' }}>{s.title}</div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="callout warning">
                    <div className="callout-icon">⚠️</div>
                    <div>
                        <div className="callout-title">Why not send the token directly?</div>
                        <p>The code → token exchange step exists so that the token never appears in the URL or browser history.
                            Tokens are secret; codes are single-use and short-lived. Even if a code is intercepted, it's useless without the PKCE verifier.</p>
                    </div>
                </div>

                <h2 id="tokens">Access Tokens</h2>
                <p>
                    The access token is a <strong>JSON Web Token (JWT)</strong> — a signed, self-contained string. It contains:
                </p>
                <ul>
                    <li>The user's ID, username, and email</li>
                    <li>Their role in your application</li>
                    <li>When the token expires</li>
                    <li>A cryptographic signature from Auth-A that prevents tampering</li>
                </ul>

                <div className="page-nav">
                    <div />
                    <Link to="/docs/pkce" className="page-nav-btn next">
                        <span className="page-nav-label">Next →</span>
                        <span className="page-nav-title">What is PKCE?</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
