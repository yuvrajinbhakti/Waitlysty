"use client";
import { useState, useEffect } from "react";
interface Waitlist { id: string; name: string; slug: string; tagline: string | null; confirmSubject: string; }
export default function SettingsPage() {
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const [selected, setSelected] = useState<Waitlist | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { fetch("/api/waitlists").then(r => r.json()).then(d => { const list = d.waitlists ?? []; setWaitlists(list); if (list[0]) setSelected(list[0]); }); }, []);
  if (!selected) return <div style={{ flex: 1, overflow: "auto" }}><div style={{ padding: "0 28px", height: 56, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center" }}><span style={{ fontSize: 14, fontWeight: 500 }}>Settings</span></div><div style={{ padding: 28, color: "var(--text3)", fontSize: 13 }}>Create a waitlist first.</div></div>;
  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      <div style={{ padding: "0 28px", height: 56, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center" }}><span style={{ fontSize: 14, fontWeight: 500 }}>Settings</span></div>
      <div style={{ padding: 28 }}>
        <div style={{ background: "var(--accent-dim)", border: "1px solid rgba(212,245,122,0.15)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div><div style={{ fontSize: 13, fontWeight: 500 }}>Free plan</div><div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>1 waitlist · 100 subscribers</div></div>
          <button style={{ padding: "7px 14px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-text)", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>Upgrade to Pro — $9/mo</button>
        </div>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, maxWidth: 480 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>{selected.name}</div>
          <form onSubmit={e => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 5 }}>Name</label><input type="text" value={selected.name} onChange={e => setSelected({ ...selected, name: e.target.value })} /></div>
            <div><label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 5 }}>Slug</label><input type="text" value={selected.slug} readOnly style={{ opacity: 0.6 }} /><div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>Cannot be changed after creation</div></div>
            <div><label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 5 }}>Tagline</label><input type="text" value={selected.tagline ?? ""} onChange={e => setSelected({ ...selected, tagline: e.target.value })} placeholder="Be first to know..." /></div>
            <div><label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 5 }}>Confirmation email subject</label><input type="text" value={selected.confirmSubject} onChange={e => setSelected({ ...selected, confirmSubject: e.target.value })} /></div>
            <button type="submit" style={{ padding: "10px", borderRadius: 8, background: saved ? "var(--bg4)" : "var(--accent)", color: saved ? "var(--text2)" : "var(--accent-text)", fontWeight: 500, fontSize: 13, border: "none", cursor: "pointer" }}>{saved ? "Saved ✓" : "Save changes"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
