"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
interface Waitlist { id: string; name: string; slug: string; _count: { subscribers: number }; }
const bars = [22, 28, 16, 36, 40, 12, 8];
const days = ["M","T","W","T","F","S","S"];
export default function OverviewPage() {
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const max = Math.max(...bars);
  useEffect(() => { fetch("/api/waitlists").then(r => r.json()).then(d => setWaitlists(d.waitlists ?? [])); }, []);
  const totalSubs = waitlists.reduce((a, w) => a + w._count.subscribers, 0);
  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      <div style={{ padding: "0 28px", height: 56, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>Overview</span>
        <Link href="/dashboard/waitlists" style={{ padding: "6px 14px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-text)", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>+ New waitlist</Link>
      </div>
      <div style={{ padding: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total signups", value: totalSubs.toLocaleString(), note: "All time" },
            { label: "Waitlists", value: waitlists.length, note: "1 free slot" },
            { label: "Via referral", value: "—", note: "Coming soon" },
            { label: "Confirmed", value: "—", note: "Coming soon" },
          ].map(s => (
            <div key={s.label} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 300, fontFamily: "Georgia, serif" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{s.note}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Daily signups</span>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>Last 7 days</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
            {bars.map((val, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, height: "100%" }}>
                <div style={{ width: "100%", height: `${(val / max) * 100}%`, background: i === 4 ? "var(--accent)" : "var(--bg4)", borderRadius: "4px 4px 0 0" }} />
                <span style={{ fontSize: 10, color: "var(--text3)" }}>{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Your waitlists</div>
        {waitlists.length === 0 ? (
          <div style={{ background: "var(--bg2)", border: "1px dashed var(--border2)", borderRadius: 10, padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}>No waitlists yet</div>
            <Link href="/dashboard/waitlists" style={{ padding: "8px 18px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-text)", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Create your first waitlist</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {waitlists.map(w => (
              <Link key={w.id} href={`/dashboard/subscribers?slug=${w.slug}`} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, textDecoration: "none", display: "block" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{w.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "monospace", marginTop: 2 }}>waitlyst.co/j/{w.slug}</div>
                  </div>
                  <span style={{ padding: "3px 9px", borderRadius: 100, fontSize: 11, background: "rgba(122,204,122,0.12)", color: "#7acc7a" }}>Live</span>
                </div>
                <div style={{ paddingTop: 14, borderTop: "1px solid var(--border)", fontSize: 13, color: "var(--text2)" }}>{w._count.subscribers} subscribers</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
