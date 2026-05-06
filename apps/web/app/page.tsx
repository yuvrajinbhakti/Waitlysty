import Link from "next/link";
export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 40px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontSize: 20 }}>
          wait<em style={{ color: "var(--accent)" }}>lyst</em>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link
            href="/auth/login"
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--text2)",
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 13,
              background: "var(--accent)",
              color: "var(--accent-text)",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Get started free
          </Link>
        </div>
      </nav>
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--accent-dim)",
            border: "1px solid rgba(212,245,122,0.2)",
            borderRadius: 100,
            padding: "4px 12px",
            fontSize: 12,
            color: "var(--accent)",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
            }}
          />{" "}
          Now in public beta
        </div>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(40px, 7vw, 68px)",
            lineHeight: 1.1,
            letterSpacing: -1,
            maxWidth: 680,
            marginBottom: 20,
          }}
        >
          Launch with a waitlist.
          <br />
          <em style={{ color: "var(--accent)" }}>Not a prayer.</em>
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--text2)",
            maxWidth: 440,
            lineHeight: 1.7,
            marginBottom: 40,
          }}
        >
          One script tag. Collect emails, confirm subscribers, and grow through
          referrals before your product exists.
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/auth/signup"
            style={{
              padding: "11px 24px",
              borderRadius: 8,
              background: "var(--accent)",
              color: "var(--accent-text)",
              fontWeight: 500,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Start for free — no card needed
          </Link>
          <Link
            href="/j/demo"
            style={{
              padding: "11px 24px",
              borderRadius: 8,
              border: "1px solid var(--border2)",
              color: "var(--text)",
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            See live demo ↗
          </Link>
        </div>
      </section>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {[
          {
            icon: "⚡",
            title: "5-minute setup",
            desc: "Paste one script tag. Live on any site — Framer, Webflow, plain HTML.",
          },
          {
            icon: "🔗",
            title: "Referral system",
            desc: "Every subscriber gets a unique link. Share to move up. It markets itself.",
          },
          {
            icon: "📬",
            title: "Email confirmation",
            desc: "Auto-confirm emails. Only real signups count. Export CSV anytime.",
          },
        ].map((f) => (
          <div
            key={f.title}
            style={{
              padding: "32px 28px",
              borderRight: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
              {f.title}
            </div>
            <div
              style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}
            >
              {f.desc}
            </div>
          </div>
        ))}
      </div>
      <footer
        style={{
          padding: "18px 40px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--text3)" }}>
          © 2025 Waitlyst
        </span>
        <span style={{ fontSize: 12, color: "var(--text3)" }}>
          Made for indie founders
        </span>
      </footer>
    </div>
  );
}
