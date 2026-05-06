"use client";
import { useEffect, useState } from "react";
interface Waitlist { id: string; name: string; slug: string; }
export default function EmbedPage() {
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const [selected, setSelected] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => { fetch("/api/waitlists").then(r => r.json()).then(d => { const list = d.waitlists ?? []; setWaitlists(list); if (list[0]) setSelected(list[0].slug); }); }, []);
  const code = `<script\n  src="https://waitlyst.co/widget.js"\n  data-waitlist-id="${selected}"\n  data-theme="dark">\n</script>`;
  function copy() { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      <div style={{ padding: "0 28px", height: 56, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center" }}><span style={{ fontSize: 14, fontWeight: 500 }}>Embed code</span></div>
      <div style={{ padding: 28, maxWidth: 600 }}>
        {waitlists.length > 1 && <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 5 }}>Select waitlist</label><select value={selected} onChange={e => setSelected(e.target.value)} style={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "var(--text)", width: "100%" }}>{waitlists.map(w => <option key={w.id} value={w.slug}>{w.name}</option>)}</select></div>}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 10 }}>Paste before &lt;/body&gt;</div>
          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, position: "relative" }}>
            <pre style={{ fontFamily: "monospace", fontSize: 12, color: "#a8d8a8", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{code}</pre>
            <button onClick={copy} style={{ position: "absolute", top: 10, right: 10, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border2)", background: "var(--bg2)", color: "var(--text2)", fontSize: 11, cursor: "pointer" }}>{copied ? "Copied!" : "Copy"}</button>
          </div>
        </div>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>How to install</div>
          {["Copy the script tag above", "Paste it before </body> on any HTML page, Framer or Webflow site", "The widget appears automatically — no extra code needed"].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--accent-dim)", border: "1px solid rgba(212,245,122,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--accent)", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 13, color: "var(--text2)", paddingTop: 2 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
