import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
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

  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
        <h2>Error</h2>
        <pre style={{ background: '#fee', padding: 16, whiteSpace: 'pre-wrap' }}>{error}</pre>
        <p>
          If this is a permission/authentication error — expected. RLS is blocking
          anonymous reads, which is the correct behaviour.
        </p>
      </div>
    );
  }

  if (!coaches) return <div style={{ padding: 40 }}>Loading…</div>;

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>COVER — smoke test</h1>
      <p>Loaded {coaches.length} coaches from Supabase:</p>
      <ul>
        {coaches.map((c) => (
          <li key={c.email}>
            <strong>{c.name}</strong> · {c.email} · {c.roles.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
