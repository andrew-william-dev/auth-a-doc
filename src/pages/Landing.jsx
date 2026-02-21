import { Link } from 'react-router-dom';
import { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

/* ── Syntax-coloured tokens for the browser mockup ── */
const kw = (t) => <span className="tok-kw">{t}</span>;
const str = (t) => <span className="tok-string">{t}</span>;
const fn = (t) => <span className="tok-fn">{t}</span>;
const cm = (t) => <span className="tok-comment">{t}</span>;
const id = (t) => <span className="tok-id">{t}</span>;
const op = (t) => <span className="tok-punct">{t}</span>;

const LINES = [
    <>{kw('import')} {'{ '}{id('ClientApp')}{' }'} {kw('from')} {str("'auth-a-lib'")}{op(';')}</>,
    null,
    <>{cm('// 1 · Register your app on DevPortal → get a Client ID')}</>,
    <>{kw('const')} {id('auth')} {op('=')} {kw('new')} {fn('ClientApp')}{op('(')}{str("'app_abc123def456'")}{op(');')}</>,
    null,
    <>{cm('// 2 · Login button — kicks off OAuth 2.0 + PKCE flow')}</>,
    <>{kw('const')} {fn('handleLogin')} {op('= async () =>')} {'{'}</>,
    <>{'  '}{kw('await')} {id('auth')}{op('.')}{fn('login')}{op('(')}</>,
    <>{'    '}{id('window')}{op('.')}{id('location')}{op('.')}{id('origin')} {op('+')} {str("'/callback'")}</>,
    <><span style={{ color: '#e6edf3' }}>{'  )'}</span>{op(');')}</>,
    <><span style={{ color: '#e6edf3' }}>{'}'}</span>{op(';')}</>,
    null,
    <>{cm('// 3 · Callback page — exchange code for JWT token')}</>,
    <>{kw('const')} {id('result')} {op('=')} {kw('await')} {id('auth')}{op('.')}{fn('handleRedirect')}{op('();')}</>,
    <>{kw('if')} {op('(')}result{op('?.')}{id('access_token')}{op(')')} {'{'}</>,
    <>{'  '}{kw('const')} {'{ '}{id('user')}{', '}{id('role')}{' }'} {op('=')} {id('result')}{op(';')}</>,
    <>{'  '}{cm('// ✓ Store token, redirect to dashboard')}</>,
    <>{'}'}</>,
];

function BrowserMockup() {
    return (
        <div className="browser-wrapper">
            {/* Floating tech badges */}
            <div className="hero-float-badges">
                <div className="float-badge float-badge--pkce">🔑 PKCE</div>
                <div className="float-badge float-badge--jwt">🎫 JWT</div>
                <div className="float-badge float-badge--sso">⚡ SSO</div>
                <div className="float-badge float-badge--oauth">🔐 OAuth 2.0</div>
            </div>

            <div className="browser-window">
                {/* Chrome topbar */}
                <div className="browser-topbar">
                    <div className="browser-dot browser-dot--red" />
                    <div className="browser-dot browser-dot--yellow" />
                    <div className="browser-dot browser-dot--green" />
                    <div className="browser-url">your-app.com / auth.js</div>
                </div>

                {/* Code pane */}
                <div className="browser-code">
                    {/* Line numbers */}
                    <div className="browser-line-nums">
                        {LINES.map((_, i) => (
                            <div key={i}>{i + 1}</div>
                        ))}
                    </div>

                    {/* Code content */}
                    <div className="browser-code-inner">
                        {LINES.map((line, i) =>
                            line === null ? (
                                <div key={i}>&nbsp;</div>
                            ) : (
                                <div key={i}>{line}</div>
                            )
                        )}
                        <div><span className="cursor-blink" /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── DevPortal mock screenshot ── */
function DPScreenshot({ title, badge, rows }) {
    return (
        <div className="dp-screenshot">
            <div className="dp-titlebar">
                <div className="dp-dot dp-dot--r" />
                <div className="dp-dot dp-dot--y" />
                <div className="dp-dot dp-dot--g" />
                <div className="dp-titletext">auth-a.vercel.app — {title}</div>
            </div>
            <div className="dp-body">
                <div className="dp-sidebar">
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} className={`dp-nav-icon${i === 1 ? ' dp-nav-icon--active' : ''}`} />
                    ))}
                </div>
                <div className="dp-content">
                    <div className="dp-header-row">
                        <span className="dp-title-text">{title}</span>
                        <span className={`dp-badge dp-badge--${badge.color}`}>{badge.label}</span>
                    </div>
                    {/* Table header skeleton */}
                    <div className="dp-table-row" style={{ marginBottom: 4 }}>
                        {['--w1', '--w2', '--w3', '--w3'].map((c, i) => (
                            <div key={i} className={`dp-table-cell dp-table-cell${c}`} style={{ background: 'rgba(255,255,255,0.04)' }} />
                        ))}
                    </div>
                    {/* Data rows */}
                    {rows.map((r, ri) => (
                        <div key={ri} className="dp-table-row">
                            <div className="dp-table-cell dp-table-cell--w1" />
                            <div className="dp-table-cell dp-table-cell--w2" />
                            <div className={`dp-table-cell dp-table-cell--${r.accent}`} />
                            <div className={`dp-btn-mini dp-btn-mini--${r.btn}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── Main Landing page ── */
export default function Landing() {
    const [copied, setCopied] = useState(false);

    const copyInstall = () => {
        navigator.clipboard.writeText('npm install auth-a-lib');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="landing">

            {/* ═══════════ HERO ═══════════ */}
            <section className="hero-v2">
                <div className="hero-v2-bg" />
                <div className="hero-v2-grid" />

                <div className="hero-v2-inner">
                    {/* Pill badge */}
                    <div className="hero-v2-pill">
                        <span className="hero-v2-pill-dot" />
                        Open · OAuth 2.0 + PKCE Identity Infrastructure
                    </div>

                    {/* Headline */}
                    <h1>
                        Enterprise-grade auth.<br />
                        <span className="gradient-text">Two function calls.</span>
                    </h1>

                    <p className="hero-v2-sub">
                        <strong>DevPortal</strong> is your Identity Provider — it handles logins,
                        manages user access, and issues cryptographically signed JWT tokens.
                        <strong> auth-a-lib</strong> gives you <code>login()</code> and <code>handleRedirect()</code> — that's the entire integration.
                    </p>

                    {/* CTAs */}
                    <div className="hero-v2-cta">
                        <Link to="/docs/getting-started" className="btn-hero-primary">
                            Get Started →
                        </Link>
                        <a
                            href="https://github.com/andrew-william-dev/auth-a-lib"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-hero-ghost"
                        >
                            ⭐ GitHub
                        </a>
                        <a
                            href="https://auth-a.vercel.app"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-hero-ghost"
                        >
                            ↗ Open DevPortal
                        </a>
                    </div>

                    {/* Browser mockup */}
                    <BrowserMockup />
                </div>
            </section>

            {/* ═══════════ STATS ═══════════ */}
            <div className="stats-section">
                {[
                    { num: '2', label: 'API methods to learn' },
                    { num: 'SHA-256', label: 'PKCE on every login' },
                    { num: 'JWT', label: 'Signed access tokens' },
                    { num: 'SSO', label: 'Across all your apps' },
                    { num: '0', label: 'Passwords you handle' },
                ].map(s => (
                    <div key={s.label} className="stat-item">
                        <div className="stat-num">{s.num}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ═══════════ HOW IT WORKS ═══════════ */}
            <section className="how-section">
                <div className="section-label">From zero to authenticated</div>
                <h2 className="section-title">Three steps. Done.</h2>
                <p className="section-sub">
                    No auth servers to provision. No password databases. No cryptography to implement.
                </p>

                <div className="steps-row">
                    {[
                        {
                            n: '01',
                            icon: '🏢',
                            title: 'Register your app',
                            desc: 'Create an account on DevPortal. Register your app — get a Client ID, define roles, and set your redirect URI. Takes under 60 seconds.',
                        },
                        {
                            n: '02',
                            icon: '📦',
                            title: 'Install the SDK',
                            desc: 'npm install auth-a-lib. Call new ClientApp("your_id") once. No config files. No environment variables.',
                        },
                        {
                            n: '03',
                            icon: '🚀',
                            title: 'Ship it',
                            desc: 'Drop login() on your sign-in button. Put handleRedirect() on your callback page. Users get OAuth 2.0 + PKCE + SSO automatically.',
                        },
                    ].map(s => (
                        <div key={s.n} className="step-card">
                            <div className="step-number">{s.n}</div>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                            <div className="step-title">{s.title}</div>
                            <div className="step-desc">{s.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ DEVPORTAL PREVIEW ═══════════ */}
            <section className="preview-section">
                <div className="section-label">DevPortal dashboard</div>
                <h2 className="section-title">Your identity control panel</h2>
                <p className="section-sub">
                    Manage registered applications, user access, roles, and access requests —
                    all from a clean dashboard. No backend config required.
                </p>

                <div className="preview-grid">
                    <div>
                        <div style={{ textAlign: 'left', marginBottom: '0.7rem' }}>
                            <span className="hero-v2-pill" style={{ animation: 'none' }}>📋 App Registry</span>
                        </div>
                        <DPScreenshot
                            title="Registered Applications"
                            badge={{ label: '3 apps', color: 'blue' }}
                            rows={[
                                { accent: 'accent', btn: 'approve' },
                                { accent: 'accent', btn: 'approve' },
                                { accent: 'yellow', btn: 'deny' },
                            ]}
                        />
                    </div>
                    <div>
                        <div style={{ textAlign: 'left', marginBottom: '0.7rem' }}>
                            <span className="hero-v2-pill" style={{ animation: 'none' }}>👥 Access Requests</span>
                        </div>
                        <DPScreenshot
                            title="Access Requests"
                            badge={{ label: '5 pending', color: 'green' }}
                            rows={[
                                { accent: 'yellow', btn: 'approve' },
                                { accent: 'yellow', btn: 'approve' },
                                { accent: 'green', btn: 'approve' },
                                { accent: 'yellow', btn: 'deny' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* ═══════════ FEATURES ═══════════ */}
            <section className="features-section">
                <div className="section-label">What you get</div>
                <h2 className="section-title">Everything included. Nothing to configure.</h2>
                <div className="feature-grid">
                    {[
                        { icon: '🔐', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'OAuth 2.0 + PKCE', desc: 'Authorization Code flow with SHA-256 code challenges on every login. Tokens never appear in URLs or browser history.' },
                        { icon: '🎫', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', title: 'Signed JWT Tokens', desc: 'Access tokens are cryptographically signed by DevPortal. Verify on your server without a database lookup.' },
                        { icon: '⚡', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', title: 'Two-Function SDK', desc: 'login() starts the flow. handleRedirect() finishes it. All PKCE crypto, sessionStorage, and exchange handled internally.' },
                        { icon: '🔄', color: '#06d6a0', bg: 'rgba(6,214,160,0.1)', title: 'SSO Across Apps', desc: 'Existing DevPortal sessions are reused instantly. Users signed into any Auth-A app get frictionless access to yours.' },
                        { icon: '👥', color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', title: 'Role-Based Access', desc: 'Define custom roles per app. Admins approve requests. Role is embedded in the JWT — no extra lookup needed.' },
                        { icon: '🏢', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', title: 'App Registry', desc: 'Register your app in 60 seconds. Get a Client ID, set redirect URIs, manage app settings — all in the DevPortal dashboard.' },
                    ].map(f => (
                        <div key={f.title} className="feature-card">
                            <div className="feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ INSTALL + CODE ═══════════ */}
            <section className="install-section">
                <div className="section-label">Start now</div>
                <h2 className="section-title">One install. Ready in minutes.</h2>

                <button className="install-cmd" onClick={copyInstall} title="Click to copy">
                    <span className="install-dollar">$</span>
                    npm install auth-a-lib
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                        {copied ? '✓ copied' : '⎘ copy'}
                    </span>
                </button>

                <div style={{ marginTop: '1.5rem' }}>
                    <Link to="/docs/integration" className="btn-hero-ghost" style={{ display: 'inline-flex' }}>
                        See full integration example →
                    </Link>
                </div>
            </section>

            {/* ═══════════ FOOTER ═══════════ */}
            <div className="site-footer">
                <div className="footer-brand">
                    <div className="footer-brand-name">🔐 Auth-A</div>
                    <div className="footer-brand-sub">
                        OAuth 2.0 + PKCE identity infrastructure. Open standard, open source.
                    </div>
                </div>

                <div className="footer-links">
                    <div>
                        <div className="footer-col-title">Product</div>
                        <a href="https://auth-a.vercel.app" className="footer-link" target="_blank" rel="noreferrer">DevPortal ↗</a>
                        <Link to="/docs/getting-started" className="footer-link">Getting Started</Link>
                        <Link to="/docs/integration" className="footer-link">Integration Guide</Link>
                    </div>
                    <div>
                        <div className="footer-col-title">Docs</div>
                        <Link to="/docs/oauth" className="footer-link">What is OAuth 2.0?</Link>
                        <Link to="/docs/pkce" className="footer-link">What is PKCE?</Link>
                        <Link to="/docs/login-fn" className="footer-link">login() reference</Link>
                        <Link to="/docs/handle-redirect" className="footer-link">handleRedirect()</Link>
                    </div>
                    <div>
                        <div className="footer-col-title">Open Source</div>
                        <a href="https://github.com/andrew-william-dev/auth-a" className="footer-link" target="_blank" rel="noreferrer">GitHub ↗</a>
                        <a href="https://github.com/andrew-william-dev/auth-a-lib" className="footer-link" target="_blank" rel="noreferrer">auth-a-lib SDK ↗</a>
                        <a href="https://github.com/andrew-william-dev/auth-a-be" className="footer-link" target="_blank" rel="noreferrer">DevPortal Backend ↗</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© 2026 Auth-A. Open source under MIT licence.</span>
                <div className="footer-bottom-links">
                    <a href="https://auth-a.vercel.app">DevPortal</a>
                    <a href="https://github.com/andrew-william-dev/auth-a-lib">GitHub</a>
                    <Link to="/docs/oauth">Docs</Link>
                </div>
            </div>

        </div>
    );
}
