import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useSession } from './useSession';
import AuthGate from './components/AuthGate';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import { useShifts } from './lib/useShifts';
import { useCoachLookup } from './lib/useCoachLookup';
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
  const { shifts, loading, error } = useShifts();
  const coachById = useCoachLookup(allCoaches);

  useEffect(() => {
    if (!session?.user?.email) return;
    (async () => {
      const { data } = await supabase
        .from('coaches')
        .select('id, name, email, initials, roles')
        .order('name');
      if (!data) return;
      setAllCoaches(data);
      const me = data.find(
        (c) => c.email.toLowerCase() === session.user.email.toLowerCase()
      );
      setCurrentCoach(me || null);
    })();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Placeholder handlers — wired up properly in Part 5
  const handlePostShift = () => alert('Post shift — coming in Part 5');
  const handleClaim = (shifts) => alert(`Claim ${shifts.length} shift(s) — coming in Part 5`);
  const handleCancel = (shifts) => alert(`Cancel ${shifts.length} shift(s) — coming in Part 5`);

  if (!currentCoach) {
    return (
      <div style={styles.root}>
        <TopBar coach={null} onLogout={handleLogout} />
        <div style={{ padding: 40, color: '#87837b' }}>
          Loading your coach profile…
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <TopBar coach={currentCoach} onLogout={handleLogout} />
      <main style={styles.main}>
        <Dashboard
          currentCoach={currentCoach}
          coachById={coachById}
          shifts={shifts}
          loading={loading}
          error={error}
          onPostShift={handlePostShift}
          onClaim={handleClaim}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}