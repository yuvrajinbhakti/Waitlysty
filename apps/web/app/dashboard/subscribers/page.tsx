"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
interface Subscriber { id: string; email: string; name: string | null; position: number; confirmed: boolean; referralCount: number; createdAt: string; }
function Content() {
  const params = useSearchParams();
  const slug = params.get("slug") ?? "";
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    fetch(`/api/waitlists/${slug}/subscribers`).then(r => r.json()).then(d => { setSubscribers(d.subscribers ?? []); setTotal(d.total ?? 0); setLoading(false); });
  }, [slug]);
  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      <div style={{ padding: "0 28px", height: 56, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div><span style={{ fontSize: 14, fontWeight: 500 }}>Subscribers</span>{slug && <span style={{ fontSize: 12, color: "var(--text3)", marginLeft: 8 }}>{slug} · {total} total</span>}</div>
        {slug && <button onClick={() => window.open(`/api/waitlists/${slug}/subscribers?format=csv`)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border2)", background: "transparent", color: "var(--text)", fontSize: 13, cursor: "pointer" }}>Export CSV</button>}
      </div>
      <div style={{ padding: 28 }}>
        {!slug && <div style={{ color: "var(--text3)", fontSize: 13 }}>Select a waitlist from Overview to view subscribers.</div>}
        {slug && loading && <div style={{ color: "var(--text3)", fontSize: 13 }}>Loading...</div>}
        {slug && !loading && (
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>{["#","Email","Name","Joined","Referrals","Status"].map(h => <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 500 }}>{h}</th>)}</tr></thead>
              <tbody>
                {subscribers.map(s => (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "11px 18px" }}><span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--bg3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{s.position}</span></td>
                    <td style={{ padding: "11px 18px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--bg4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 500, flexShrink: 0 }}>{s.email[0].toUpperCase()}</div>{s.email}</div></td>
                    <td style={{ padding: "11px 18px", color: "var(--text2)" }}>{s.name ?? "—"}</td>
                    <td style={{ padding: "11px 18px", color: "var(--text3)" }}>{new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                    <td style={{ padding: "11px 18px", color: "#5b8def", fontWeight: 500 }}>{s.referralCount}</td>
                    <td style={{ padding: "11px 18px" }}><span style={{ padding: "3px 9px", borderRadius: 100, fontSize: 11, fontWeight: 500, background: s.confirmed ? "rgba(122,204,122,0.12)" : "var(--bg4)", color: s.confirmed ? "#7acc7a" : "var(--text3)" }}>{s.confirmed ? "Confirmed" : "Pending"}</span></td>
                  </tr>
                ))}
                {subscribers.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "var(--text3)", fontSize: 13 }}>No subscribers yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default function SubscribersPage() { return <Suspense><Content /></Suspense>; }
