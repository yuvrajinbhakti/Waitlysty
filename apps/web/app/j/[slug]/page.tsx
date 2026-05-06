"use client";
import { useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
function Signup() {
  const { slug } = useParams() as { slug: string };
  const ref = useSearchParams().get("ref");
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const [result, setResult] = useState<{ position: number; referralLink: string } | null>(null);
  const [copied, setCopied] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const res = await fetch(`/api/waitlists/${slug}/join`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name, ref }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Something went wrong"); setLoading(false); return; }
    setResult({ position: data.position, referralLink: data.referralLink });
  }
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 24 }}>
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 20, padding: "48px 40px", width: "100%", maxWidth: 420, textAlign: "center" }}>
        {!result ? (
          <>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "var(--accent-dim)", border: "1px solid rgba(212,245,122,0.15)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: "var(--accent)", marginBottom: 20 }}>✦ Early access</span>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 32, lineHeight: 1.2, marginBottom: 10, letterSpacing: -0.5 }}>{slug.split("-").map((w: string) => w[0].toUpperCase() + w.slice(1)).join(" ")}</h1>
            <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 28, lineHeight: 1.6 }}>Be the first to know when we launch.</p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input type="text" placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)} />
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              {error && <p style={{ fontSize: 12, color: "#f07070" }}>{error}</p>}
              <button type="submit" disabled={loading} style={{ background: "var(--accent)", color: "var(--accent-text)", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 500, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>{loading ? "Joining..." : "Join waitlist →"}</button>
            </form>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 16 }}>Powered by Waitlyst</div>
          </>
        ) : (
          <>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 16px" }}>✓</div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, marginBottom: 8 }}>You're on the list!</h2>
            <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 20 }}>You're <strong style={{ color: "var(--text)" }}>#{result.position}</strong>. Share your link to move up.</p>
            <div style={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--accent)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{result.referralLink}</span>
              <button onClick={() => { navigator.clipboard.writeText(result.referralLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ background: "var(--bg4)", border: "1px solid var(--border2)", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "var(--text2)", cursor: "pointer", flexShrink: 0 }}>{copied ? "Copied!" : "Copy"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default function PublicPage() { return <Suspense><Signup /></Suspense>; }
