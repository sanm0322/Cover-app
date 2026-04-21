import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useSession } from './useSession';
import AuthGate from './components/AuthGate';
import TopBar from './components/TopBar';
import { styles } from './lib/styles';

export default function App() {
  return (
    <AuthGate>
      <Shell />
    </AuthGate>
  );
}

function Shell() {
  const session = useSession();
  const [currentCoach, setCurrentCoach] = useState(null);
  const [allCoaches, setAllCoaches] = useState([]);

  // Load the logged-in user's coach row + the full roster
  useEffect(() => {
    if (!session?.user?.email) return;
    (async () => {
      const { data } = await supabase
        .from('coaches')
        .select('id, name, email, initials, roles')
        .order('name');
      if (!data) return;
      setAllCoaches(data);
      // Match by email (case-insensitive to be safe)
      const me = data.find(
        (c) => c.email.toLowerCase() === session.user.email.toLowerCase()
      );
      setCurrentCoach(me || null);
    })();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={styles.root}>
      <TopBar coach={currentCoach} onLogout={handleLogout} />

      <main style={styles.main}>
        <PlaceholderDashboard
          currentCoach={currentCoach}
          allCoaches={allCoaches}
        />
      </main>
    </div>
  );
}

// Temporary. Will be replaced by the real Dashboard in Part 4.
function PlaceholderDashboard({ currentCoach, allCoaches }) {
  if (!currentCoach) {
    return (
      <div style={{ padding: 40, color: '#87837b' }}>
        Loading your coach profile…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>
      <div style={styles.kicker}>DASHBOARD</div>
      <h1 style={styles.pageTitle}>Hey, {currentCoach.name.split(' ')[0]}.</h1>
      <p style={{ color: '#3a3a3a', marginBottom: 32 }}>
        Welcome to COVER. The real dashboard is coming in Part 4.
      </p>
      <div style={{ padding: 20, background: '#faf7ed', border: '1px solid #d9d2bf', borderRadius: 6 }}>
        <div style={styles.kicker}>TEAM ROSTER</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {allCoaches.map((c) => (
            <li key={c.id} style={{ padding: '6px 0', borderBottom: '1px solid #e5e0cf' }}>
              <strong>{c.name}</strong>
              <span style={{ color: '#87837b', marginLeft: 12, fontSize: 12 }}>
                {c.initials} · {c.roles.join(', ')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}