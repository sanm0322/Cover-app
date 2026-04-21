import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AuthGate from './components/AuthGate';
import { useSession } from './useSession';

export default function App() {
  return (
    <AuthGate>
      <Dashboard />
    </AuthGate>
  );
}

function Dashboard() {
  const session = useSession();
  const [coaches, setCoaches] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('coaches')
        .select('name, email, roles')
        .order('name');
      if (error) setError(error.message);
      else setCoaches(data);
    })();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>COVER — logged in smoke test</h1>
        <div>
          <span style={{ marginRight: 12, color: '#666' }}>
            Signed in as <strong>{session.user.email}</strong>
          </span>
          <button onClick={logout} style={{ padding: '6px 12px', cursor: 'pointer' }}>
            Log out
          </button>
        </div>
      </div>

      {error && (
        <pre style={{ background: '#fee', padding: 16 }}>{error}</pre>
      )}

      {!coaches ? (
        <p>Loading coaches…</p>
      ) : (
        <>
          <p>Loaded {coaches.length} coaches from Supabase:</p>
          <ul>
            {coaches.map((c) => (
              <li key={c.email}>
                <strong>{c.name}</strong> · {c.email} · {c.roles.join(', ')}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}