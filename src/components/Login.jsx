import { useState } from 'react';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname,
      },
    });

    if (error) { setStatus('error'); setErrorMsg(error.message); }
    else { setStatus('sent'); }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <img src={logo} alt="Dom City" style={styles.logo} />
        <div style={styles.kicker}>SHIFT COVERAGE</div>
        <h1 style={styles.title}>COVER</h1>
        <p style={styles.sub}>
          Sign in with your coaching email.<br />
          We'll send you a one-time link — no password needed.
        </p>

        {status === 'sent' ? (
          <div style={styles.sentBox}>
            <div style={styles.checkMark}>✓</div>
            <p style={styles.sentTitle}>Check your inbox</p>
            <p style={styles.sentSub}>
              We sent a login link to <strong>{email}</strong>. It expires in 1 hour.
            </p>
            <button onClick={() => { setStatus('idle'); setEmail(''); }} style={styles.secondaryBtn}>
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={submit} style={styles.form}>
            <label style={styles.label}>EMAIL</label>
            <input
              type="email" required autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={styles.input}
              disabled={status === 'sending'}
            />
            {status === 'error' && <div style={styles.errorBox}>{errorMsg}</div>}
            <button type="submit" disabled={status === 'sending'} style={styles.primaryBtn}>
              {status === 'sending' ? 'Sending…' : 'Send me a login link'}
            </button>
          </form>
        )}

        <p style={styles.footnote}>Coaches only. If you need access, ask a manager.</p>
      </div>
    </div>
  );
}

const NAVY = '#1c2a4a';
const NAVY_LIGHT = '#2a3a5e';
const CREAM = '#ece7da';
const WHITE = '#ffffff';

const styles = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: NAVY, fontFamily: 'Archivo, sans-serif' },
  card: { maxWidth: 420, width: '100%', background: NAVY, border: `1px solid ${NAVY_LIGHT}`, borderRadius: 6, padding: 32, textAlign: 'center' },
  logo: {
    display: 'block',
    height: 64,
    width: 'auto',
    margin: '0 auto 16px',
  }, 
  logoPlaceholder: { display: 'block', height: 96, width: 96, margin: '0 auto 20px', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' },
  kicker: { fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 6 },
  title: { fontFamily: 'Bebas Neue, sans-serif', fontSize: 56, letterSpacing: '0.05em', margin: '0 0 10px', color: WHITE, lineHeight: 1 },
  sub: { color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.5, marginTop: 0, marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' },
  label: { fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.55)' },
  input: { padding: '12px 14px', border: `1px solid ${NAVY_LIGHT}`, borderRadius: 4, fontSize: 15, background: 'rgba(255,255,255,0.06)', color: WHITE, fontFamily: 'Archivo, sans-serif', outline: 'none' },
  primaryBtn: { padding: '13px 18px', background: CREAM, color: NAVY, fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.05em', border: 'none', borderRadius: 4, cursor: 'pointer', marginTop: 6 },
  secondaryBtn: { padding: '10px 16px', background: 'transparent', color: WHITE, border: `1px solid ${NAVY_LIGHT}`, borderRadius: 4, fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 12, cursor: 'pointer', marginTop: 14 },
  errorBox: { background: 'rgba(192,52,52,0.15)', border: '1px solid #c03434', color: '#ff6b6b', padding: 10, borderRadius: 4, fontSize: 12 },
  sentBox: { textAlign: 'center', padding: '14px 0' },
  checkMark: { fontSize: 40, color: '#63c58c', lineHeight: 1, marginBottom: 10 },
  sentTitle: { fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 16, color: WHITE, margin: '0 0 6px' },
  sentSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: 0, lineHeight: 1.5 },
  footnote: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 24, marginBottom: 0, textAlign: 'center', fontStyle: 'italic' },
};