"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthPanel() {
  const { login, register, error } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [localError, setLocalError] = useState("");

  const isRegister = mode === "register";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (!email.trim() || !password.trim()) return;

    setPending(true);
    try {
      if (isRegister) {
        await register({ email, password });
      } else {
        await login({ email, password });
      }
      setEmail("");
      setPassword("");
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px" }}>
      <form className="glass-panel" style={{ width: "100%", maxWidth: "420px", padding: "24px" }} onSubmit={handleSubmit}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>Welcome to NoteHive</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
          {isRegister ? "Create your account" : "Sign in to continue"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            className="glass-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="glass-input"
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {(localError || error) && (
          <p style={{ color: "var(--danger-color)", marginTop: "12px", fontSize: "0.9rem" }}>
            {localError || error}
          </p>
        )}

        <button className="btn btn-primary" style={{ marginTop: "16px", width: "100%", justifyContent: "center" }} disabled={pending}>
          {pending ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
        </button>

        <button
          type="button"
          className="btn"
          style={{ marginTop: "8px", width: "100%", justifyContent: "center" }}
          onClick={() => setMode(isRegister ? "login" : "register")}
          disabled={pending}
        >
          {isRegister ? "Already have an account? Sign in" : "No account? Register"}
        </button>
      </form>
    </main>
  );
}
