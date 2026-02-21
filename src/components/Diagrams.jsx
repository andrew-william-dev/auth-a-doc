/* ==========================================
   Diagrams.jsx — Polished diagram components
   ==========================================
   StepFlow     → Numbered vertical steps with connectors
   ActorDiagram → Horizontal actor cards with animated arrows
   SequenceDiagram → Multi-lane message sequence diagram
   ========================================== */

/* ─────────────────────────────────────────
   StepFlow — Numbered, animated vertical steps
   ───────────────────────────────────────── */
export function StepFlow({ steps }) {
    return (
        <div className="sf-root">
            {steps.map((s, i) => (
                <div key={i} className="sf-item" style={{ animationDelay: `${i * 0.07}s` }}>
                    {/* Left column: number + connector line */}
                    <div className="sf-track">
                        <div className="sf-num">{i + 1}</div>
                        {i < steps.length - 1 && <div className="sf-connector" />}
                    </div>

                    {/* Content card */}
                    <div className="sf-card">
                        <span className="sf-title">{s.title}</span>
                        {s.desc && <span className="sf-desc">{s.desc}</span>}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────
   ActorDiagram — Horizontal actors + labelled arrows
   ───────────────────────────────────────── */
export function ActorDiagram({ actors }) {
    return (
        <div className="ad-root">
            {actors.map((a, i) => (
                <div key={i} className="ad-pair">
                    {/* Actor bubble */}
                    <div className="ad-actor">
                        <div className="ad-icon">{a.icon}</div>
                        <div className="ad-name">{a.name}</div>
                        {a.desc && <div className="ad-desc">{a.desc}</div>}
                    </div>

                    {/* Connector arrow (between pairs) */}
                    {i < actors.length - 1 && (
                        <div className="ad-arrow">
                            <div className="ad-arrow-line">
                                <span className="ad-shimmer" />
                            </div>
                            {/* Arrowhead */}
                            <svg className="ad-arrowhead" width="10" height="14" viewBox="0 0 10 14">
                                <path d="M1 1L9 7L1 13" stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────
   SequenceDiagram — Swimlane message diagram
   ───────────────────────────────────────── */
export function SequenceDiagram({ lanes, messages }) {
    const n = lanes.length;
    return (
        <div className="sd-root" style={{ '--sd-cols': n }}>
            {/* Lane headers */}
            <div className="sd-headers">
                {lanes.map((l, i) => (
                    <div key={i} className="sd-lane-header"
                        style={{ '--lc': l.color }}>
                        <span className="sd-lane-icon">{l.icon}</span>
                        <span>{l.name}</span>
                    </div>
                ))}
            </div>

            {/* Swimlane vertical lines */}
            <div className="sd-lane-lines">
                {lanes.map((l, i) => (
                    <div key={i} className="sd-lane-line" style={{ '--lc': l.color }} />
                ))}
            </div>

            {/* Messages */}
            <div className="sd-messages">
                {messages.map((msg, mi) => {
                    const fromIdx = lanes.findIndex(l => l.id === msg.from);
                    const toIdx = lanes.findIndex(l => l.id === msg.to);
                    const leftIdx = Math.min(fromIdx, toIdx);
                    const span = Math.abs(toIdx - fromIdx);
                    const goRight = toIdx > fromIdx;

                    return (
                        <div key={mi} className="sd-msg-row"
                            style={{ animationDelay: `${mi * 0.1}s` }}>
                            {/* Spacer columns before the arrow */}
                            {Array.from({ length: leftIdx }).map((_, k) => (
                                <div key={k} className="sd-msg-spacer" />
                            ))}
                            {/* Arrow spanning the lanes */}
                            <div className="sd-msg-arrow"
                                style={{ gridColumn: `span ${Math.max(span, 1)}` }}>
                                <div className={`sd-arrow-line ${goRight ? 'sd-arrow--right' : 'sd-arrow--left'}`}>
                                    <span className="sd-shimmer" />
                                </div>
                                <div className="sd-msg-label">{msg.label}</div>
                            </div>
                            {/* Filler to end of row */}
                            {Array.from({ length: n - leftIdx - Math.max(span, 1) }).map((_, k) => (
                                <div key={k} className="sd-msg-spacer" />
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
