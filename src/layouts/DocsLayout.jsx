import { NavLink, Outlet, useLocation } from 'react-router-dom';

const NAV = [
    {
        group: 'Introduction',
        items: [
            { to: '/docs/oauth', label: 'What is OAuth 2.0?' },
            { to: '/docs/pkce', label: 'What is PKCE?' },
        ],
    },
    {
        group: 'DevPortal',
        items: [
            { to: '/docs/devportal', label: 'How DevPortal Works' },
        ],
    },
    {
        group: 'auth-a-lib SDK',
        items: [
            { to: '/docs/getting-started', label: 'Getting Started' },
            { to: '/docs/login-fn', label: 'login()' },
            { to: '/docs/handle-redirect', label: 'handleRedirect()' },
            { to: '/docs/integration', label: 'Full Integration Example' },
        ],
    },
];

export default function DocsLayout() {
    return (
        <div className="docs-shell">
            {/* Sidebar */}
            <aside className="docs-sidebar">
                {NAV.map(section => (
                    <div key={section.group} className="sidebar-group">
                        <div className="sidebar-group-label">{section.group}</div>
                        {section.items.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                            >
                                <span className="sidebar-dot" />
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </aside>

            {/* Main */}
            <main className="docs-main">
                <Outlet />
            </main>
        </div>
    );
}
