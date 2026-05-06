"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
interface Waitlist { id: string; name: string; slug: string; _count: { subscribers: number }; }
export default function WaitlistsPage() {
  const router = useRouter();
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const [name, setName] = useState(""); const [slug, setSlug] = useState(""); const [tagline, setTagline] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [showForm, setShowForm] = useState(false);
  useEffect(() => { fetch("/api/waitlists").then(r => r.json()).then(d => setWaitlists(d.waitlists ?? [])); }, []);
  function handleNameChange(val: string) { setName(val); setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const res = await fetch("/api/waitlists", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, slug, tagline }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push("/dashboard");
  }
  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      <div style={{ padding: "0 28px", height: 56, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>Waitlists</span>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "6px 14px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-text)", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>+ New waitlist</button>
      </div>
      <div style={{ padding: 28 }}>
        {showForm && (
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, maxWidth: 480, marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 18 }}>Create waitlist</div>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 5 }}>Product name</label><input type="text" placeholder="Job App Tracker" value={name} onChange={e => handleNameChange(e.target.value)} required /></div>
              <div><label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 5 }}>Slug</label><input type="text" value={slug} onChange={e => setSlug(e.target.value)} required /><div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>waitlyst.co/j/{slug || "your-slug"}</div></div>
              <div><label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 5 }}>Tagline</label><input type="text" placeholder="Be first to know..." value={tagline} onChange={e => setTagline(e.target.value)} /></div>
              {error && <p style={{ fontSize: 12, color: "#f07070" }}>{error}</p>}
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-text)", fontWeight: 500, fontSize: 13, border: "none", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>{loading ? "Creating..." : "Create waitlist →"}</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: "10px 16px", borderRadius: 8, background: "var(--bg3)", color: "var(--text2)", fontSize: 13, border: "1px solid var(--border2)", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {waitlists.map(w => (
            <div key={w.id} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div><div style={{ fontSize: 15, fontWeight: 500 }}>{w.name}</div><div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "monospace", marginTop: 2 }}>{w.slug}</div></div>
                <span style={{ padding: "3px 9px", borderRadius: 100, fontSize: 11, background: "rgba(122,204,122,0.12)", color: "#7acc7a" }}>Live</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>{w._count.subscribers} subscribers</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
