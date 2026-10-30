import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const location = useLocation();

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (isRegister && !form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (form.password.length < 6) nextErrors.password = "Use at least 6 characters for this demo.";
    if (isRegister && form.password !== form.confirm) nextErrors.confirm = "Your passwords do not match.";
    setErrors(nextErrors);
    setMessage(Object.keys(nextErrors).length ? "" : "This is a demo form. No account was created and no password was saved.");
  }

  return <section className="auth-page container"><div className="auth-aside"><Link to="/" className="wordmark auth-wordmark"><img src={`${import.meta.env.BASE_URL}zenova-logo.svg`} alt="ZENOVA — Everything You Need. One Place." /></Link><span className="eyebrow">Everything You Need. One Place.</span><h1>Good things<br />start <em>here.</em></h1><p>Your ZENOVA account experience, made for this demo.</p><div className="auth-aside__mark">Z.</div></div><div className="auth-panel"><Link to="/" className="wordmark auth-wordmark auth-wordmark--mobile"><img src={`${import.meta.env.BASE_URL}zenova-logo.svg`} alt="ZENOVA — Everything You Need. One Place." /></Link><div className="auth-panel__icon"><LockKeyhole size={20} /></div><span className="eyebrow">{isRegister ? "Join ZENOVA" : "Welcome back"}</span><h2>{isRegister ? "Create your account" : "Sign in to ZENOVA"}</h2><p className="auth-subtitle">Everything You Need. One Place.</p><div className="demo-notice">Demo only — no real authentication. Passwords are never stored.</div><form className="auth-form" onSubmit={submit} noValidate>
    {isRegister && <><label htmlFor="auth-name">Your name</label><input id="auth-name" autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} />{errors.name && <span className="field-error">{errors.name}</span>}</>}
    <label htmlFor="auth-email">Email address</label><input id="auth-email" type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} />{errors.email && <span className="field-error">{errors.email}</span>}
    <label htmlFor="auth-password">Password</label><div className="password-field"><input id="auth-password" type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} value={form.password} onChange={(event) => update("password", event.target.value)} aria-invalid={Boolean(errors.password)} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{errors.password && <span className="field-error">{errors.password}</span>}
    {isRegister && <><label htmlFor="auth-confirm">Confirm password</label><input id="auth-confirm" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.confirm} onChange={(event) => update("confirm", event.target.value)} aria-invalid={Boolean(errors.confirm)} />{errors.confirm && <span className="field-error">{errors.confirm}</span>}</>}
    <button className="button button--primary" type="submit">{isRegister ? "Create demo account" : "Sign in"}</button>
  </form>{message && <p className="auth-success" role="status">{message}</p>}<p className="auth-switch">{isRegister ? "Already have an account?" : "New to ZENOVA?"} <Link to={isRegister ? `/login${location.search}` : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p></div></section>;
}
