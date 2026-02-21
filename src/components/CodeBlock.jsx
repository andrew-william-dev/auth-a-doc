import { useState } from 'react';

/* ─────────────────────────────────────────────────────────
   Tokenizer — converts raw code string into colored spans.
   Supports: JS/JSX, bash/terminal, plain text
   ───────────────────────────────────────────────────────── */

const RULES = [
    // Line comment
    { re: /(\/\/.*)/g, cls: 'tok-comment' },
    // Block comment
    { re: /(\/\*[\s\S]*?\*\/)/g, cls: 'tok-comment' },
    // Hash comment (bash)
    { re: /(#.*)/g, cls: 'tok-comment' },
    // Template literal
    { re: /(`(?:[^`\\]|\\.)*`)/g, cls: 'tok-string' },
    // Double-quoted string
    { re: /("(?:[^"\\]|\\.)*")/g, cls: 'tok-string' },
    // Single-quoted string
    { re: /('(?:[^'\\]|\\.)*')/g, cls: 'tok-string' },
    // Keywords
    { re: /\b(import|export|from|default|const|let|var|function|async|await|return|if|else|try|catch|new|class|extends|this|typeof|null|undefined|true|false|void)\b/g, cls: 'tok-kw' },
    // Built-ins / globals
    { re: /\b(console|window|document|localStorage|sessionStorage|crypto|fetch|URL|URLSearchParams|JSON|Promise|Error|Date|Math|Object|Array|String|Boolean|Number|atob|btoa)\b/g, cls: 'tok-builtin' },
    // npm / cli keywords
    { re: /\b(npm|npx|yarn|cd|git|node)\b/g, cls: 'tok-cli' },
    // Method calls / property access
    { re: /\.([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, cls: null, fn: (m, g) => `.<span class="tok-fn">${g}</span>` },
    // Class names (start with capital)
    { re: /\b([A-Z][a-zA-Z0-9_]*)\b/g, cls: 'tok-class' },
    // Numbers
    { re: /\b(\d+)\b/g, cls: 'tok-num' },
    // Punctuation brackets
    { re: /([{}[\]()])/g, cls: 'tok-punct' },
];

function tokenize(code) {
    // We'll build a list of token objects: { start, end, cls, text }
    // Then sort and render non-overlapping tokens.
    const len = code.length;
    const occupied = new Uint8Array(len); // 1 = already claimed by a token
    const tokens = [];

    for (const rule of RULES) {
        const re = new RegExp(rule.re.source, rule.re.flags.includes('g') ? rule.re.flags : rule.re.flags + 'g');
        let m;
        while ((m = re.exec(code)) !== null) {
            const start = m.index;
            const end = m.index + m[0].length;
            // Skip if any character in this range is already claimed
            let overlap = false;
            for (let i = start; i < end; i++) { if (occupied[i]) { overlap = true; break; } }
            if (overlap) continue;

            if (rule.fn) {
                // Custom transform
                tokens.push({ start, end, html: rule.fn(m[0], m[1]) });
            } else {
                tokens.push({ start, end, cls: rule.cls });
            }
            for (let i = start; i < end; i++) occupied[i] = 1;
        }
    }

    // Sort by position
    tokens.sort((a, b) => a.start - b.start);

    // Build output HTML
    let out = '';
    let cursor = 0;
    for (const tok of tokens) {
        if (cursor < tok.start) {
            out += escapeHtml(code.slice(cursor, tok.start));
        }
        if (tok.html) {
            out += tok.html;
        } else {
            out += `<span class="${tok.cls}">${escapeHtml(code.slice(tok.start, tok.end))}</span>`;
        }
        cursor = tok.end;
    }
    if (cursor < len) out += escapeHtml(code.slice(cursor));
    return out;
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ─────────────────────────────────────────────────────────
   CodeBlock component
   ───────────────────────────────────────────────────────── */
export default function CodeBlock({ file, lang, children }) {
    const [copied, setCopied] = useState(false);

    const raw = typeof children === 'string' ? children : '';
    const highlighted = tokenize(raw);

    const handleCopy = () => {
        navigator.clipboard.writeText(raw).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        });
    };

    return (
        <div className="code-block">
            <div className="code-header">
                <div className="code-dots">
                    <div className="code-dot" style={{ background: '#ff5f57' }} />
                    <div className="code-dot" style={{ background: '#febc2e' }} />
                    <div className="code-dot" style={{ background: '#28c840' }} />
                </div>
                <span className="code-filename">{file || 'code'}</span>
                <button className="code-copy" onClick={handleCopy}>
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
            </div>
            <pre>
                <code dangerouslySetInnerHTML={{ __html: highlighted }} />
            </pre>
        </div>
    );
}
