"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) { setError("Invalid email or password"); setLoading(false); }
    else router.push("/dashboard");
  }
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: 32, width: "100%", maxWidth: 380 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, textAlign: "center", marginBottom: 24 }}>wait<em style={{ color: "var(--accent)" }}>lyst</em></div>
        <h1 style={{ fontSize: 16, fontWeight: 500, textAlign: "center", marginBottom: 4 }}>Welcome back</h1>
        <p style={{ fontSize: 13, color: "var(--text2)", textAlign: "center", marginBottom: 24 }}>Sign in to your account</p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 5 }}>Email</label><input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div><label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 5 }}>Password</label><input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          {error && <p style={{ fontSize: 12, color: "#f07070", textAlign: "center" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ background: "var(--accent)", color: "var(--accent-text)", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 500, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p style={{ fontSize: 12, color: "var(--text2)", textAlign: "center", marginTop: 16 }}>
          No account? <Link href="/auth/signup" style={{ color: "var(--accent)", textDecoration: "none" }}>Create one free</Link>
        </p>
      </div>
    </div>
  );
}
