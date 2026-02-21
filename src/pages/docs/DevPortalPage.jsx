import { Link } from 'react-router-dom';
import { StepFlow } from '../../components/Diagrams';

const SECTIONS = [
    { id: 'overview', label: 'Architecture overview' },
    { id: 'app-registry', label: 'App Registry' },
    { id: 'login-flow', label: 'The Login Flow' },
    { id: 'sso', label: 'SSO Session Reuse' },
    { id: 'roles', label: 'Roles & Access' },
    { id: 'access-requests', label: 'Access Requests' },
];

function SSODiagram() {
    return (
        <div className="diagram">
            <div className="diagram-title">SSO Flow (existing session)</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', flexWrap: 'wrap' }}>
                {[
                    { label: '🌐 Your App', color: '#3b82f6', sub: 'calls login()' },
                    null,
                    { label: '🔐 DevPortal', color: '#8b5cf6', sub: 'session found →\ncode issued instantly' },
                    null,
                    { label: '🌐 Your App', color: '#3b82f6', sub: 'receives JWT\nvia handleRedirect()' },
                ].map((item, i) => {
                    if (!item) return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px', marginBottom: '22px' }}>
                            <div style={{ width: '36px', height: '1.5px', background: 'linear-gradient(90deg,rgba(59,130,246,0.6),rgba(139,92,246,0.6))', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', animation: 'slideRight 1.6s ease infinite' }} />
                            </div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)', marginTop: '4px' }}>skips login</div>
                        </div>
                    );
                    return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                                background: `rgba(${item.color === '#3b82f6' ? '59,130,246' : '139,92,246'},0.1)`,
                                border: `1.5px solid rgba(${item.color === '#3b82f6' ? '59,130,246' : '139,92,246'},0.35)`,
                                borderRadius: '10px', padding: '10px 14px', color: item.color, fontWeight: 700, fontSize: '0.82rem', textAlign: 'center',
                            }}>{item.label}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)', textAlign: 'center', whiteSpace: 'pre' }}>{item.sub}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function DevPortalPage() {
    return (
        <>
            <div className="docs-content">
                <h1>How DevPortal Works</h1>
                <p className="doc-lead">
                    DevPortal is the Identity Provider (IdP) powering Auth-A. It manages your application registry,
                    user access, and issues OAuth tokens. Your app never handles passwords — DevPortal does all of that,
                    and your integration happens purely through the auth-a-lib SDK.
                </p>

                <h2 id="overview">Architecture overview</h2>
                <p>
                    DevPortal sits between your application and your users. It owns the authentication layer entirely.
                    Your app talks to DevPortal via a standard OAuth 2.0 + PKCE flow and receives a signed JWT.
                </p>

                <h2 id="app-registry">App Registry</h2>
                <p>
                    Every application that uses Auth-A must be registered on the DevPortal dashboard.
                    Registration establishes trust — DevPortal only issues tokens for known, registered apps.
                </p>
                <p>When you register an app you receive:</p>
                <ul>
                    <li><strong>Client ID</strong> — public identifier for your app, included in every login request</li>
                    <li><strong>Client Secret</strong> — shown <em>once only</em> at registration. Store it securely.</li>
                    <li><strong>Redirect URI</strong> — where DevPortal sends the user after login. Must match exactly.</li>
                    <li><strong>Roles</strong> — custom access levels you define (e.g. "admin", "viewer", "editor")</li>
                </ul>

                <div className="callout warning">
                    <div className="callout-icon">⚠️</div>
                    <div>
                        <div className="callout-title">Client Secret is shown only once</div>
                        <p>Copy and securely store your Client Secret immediately after registration.
                            It cannot be retrieved — if lost, you must rotate it.</p>
                    </div>
                </div>

                <h2 id="login-flow">The Login Flow</h2>
                <p>Here's exactly what happens from the user's perspective and what DevPortal does behind the scenes:</p>
                <div className="diagram">
                    <div className="diagram-title">Detailed Login Flow — 7 Steps</div>
                    <StepFlow steps={[
                        { title: 'Your app calls auth.login(redirectURL)', desc: 'auth-a-lib generates a PKCE verifier + challenge, then redirects the user to auth-a.vercel.app/oauth/login with your clientId, redirectUrl, and code_challenge' },
                        { title: 'DevPortal validates the request', desc: 'DevPortal checks that the clientId is registered and the redirectUrl exactly matches the app\'s registered redirect URI. Invalid requests are rejected.' },
                        { title: 'User authenticates', desc: 'If the user has no active session, they see the DevPortal login form. Credentials are checked against the DevPortal user database — not yours.' },
                        { title: 'DevPortal checks app access', desc: 'DevPortal verifies the user has been granted access to your specific application. Users without access see an error — no token issued.' },
                        { title: 'Authorization code issued', desc: 'A single-use, 10-minute code is generated and the user is redirected to your redirectURL with ?code=...' },
                        { title: 'Token exchange via auth-a-lib', desc: 'handleRedirect() reads the code, sends it with the PKCE verifier to the token endpoint. DevPortal verifies the pair and returns a signed JWT.' },
                        { title: 'JWT delivered to your app', desc: 'The token contains the user\'s identity, their assigned role, and expiry. Your app stores it and uses it for session management.' },
                    ]} />
                </div>

                <h2 id="sso">SSO Session Reuse</h2>
                <p>
                    If a user is already logged in — from DevPortal itself or any other Auth-A-powered app —
                    calling <code>auth.login()</code> skips the login form entirely.
                    DevPortal detects the active session and immediately issues an authorization code.
                    From the user's perspective: click "Sign In", and they're already in.
                </p>
                <SSODiagram />

                <h2 id="roles">Roles & Access</h2>
                <p>
                    When you register an application, you define roles — permission levels within <em>your</em> app
                    (e.g. <code>admin</code>, <code>viewer</code>, <code>editor</code>).
                    The role is assigned per-user, embedded in their access token.
                    Your app reads the role from the token to control what the user can see or do.
                </p>

                <h2 id="access-requests">Access Requests</h2>
                <p>
                    Users who want access visit the DevPortal browse page, find your app,
                    and submit an access request with their desired role.
                    Your app's admin approves or denies the request.
                    Only approved users can log in to your app via Auth-A.
                </p>

                <div className="page-nav">
                    <Link to="/docs/pkce" className="page-nav-btn">
                        <span className="page-nav-label">← Previous</span>
                        <span className="page-nav-title">What is PKCE?</span>
                    </Link>
                    <Link to="/docs/getting-started" className="page-nav-btn next">
                        <span className="page-nav-label">Next →</span>
                        <span className="page-nav-title">Getting Started</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
