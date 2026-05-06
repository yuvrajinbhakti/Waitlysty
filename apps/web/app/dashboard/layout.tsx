"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
const NAV = [
  { href: "/dashboard", label: "Overview", icon: "▦" },
  { href: "/dashboard/waitlists", label: "Waitlists", icon: "≡" },
  { href: "/dashboard/subscribers", label: "Subscribers", icon: "◉" },
  { href: "/dashboard/embed", label: "Embed code", icon: "<>" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const initials = session?.user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() ?? "U";
  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)" }}>
      <div style={{ width: 220, background: "var(--bg2)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid var(--border)", fontFamily: "Georgia, serif", fontSize: 18 }}>
          wait<em style={{ color: "var(--accent)" }}>lyst</em>
        </div>
        <nav style={{ padding: 10, flex: 1 }}>
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, fontSize: 13, textDecoration: "none", marginBottom: 1, background: active ? "var(--bg4)" : "transparent", color: active ? "var(--text)" : "var(--text2)" }}>
                <span style={{ fontSize: 12, opacity: active ? 1 : 0.6 }}>{item.icon}</span>{item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", borderRadius: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent-dim)", border: "1px solid rgba(212,245,122,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: "var(--accent)", flexShrink: 0 }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session?.user?.name ?? session?.user?.email}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>Free plan</div>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/" })} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 11 }}>Out</button>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>{children}</div>
    </div>
  );
}
