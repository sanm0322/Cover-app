import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useSession } from './useSession';
import AuthGate from './components/AuthGate';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import PostShiftModal from './components/PostShiftModal';
import { useShifts } from './lib/useShifts';
import { useCoachLookup } from './lib/useCoachLookup';
import { addHoursToTime } from './lib/helpers';
import { styles } from './lib/styles';
import ConfirmClaimModal from './components/ConfirmClaimModal';
import ConfirmCancelModal from './components/ConfirmCancelModal';
import ConfirmUnclaimModal from './components/ConfirmUnclaimModal';

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
  const { shifts, loading, error, refetch } = useShifts();
  const coachById = useCoachLookup(allCoaches);

  const [modal, setModal] = useState(null);     // null | { type: 'post-shift' } | ...
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  /**
   * Post one or more shift coverage requests.
   *
   * `entries` is an array where each entry has { date, time, className, shifts (1-6), reason }.
   * We flatten back-to-back classes (shifts > 1 means "N hourly classes starting at time"),
   * group them all under a single group_id, and insert as one batch.
   */
  const handlePostShift = async (entries) => {
    setIsSubmitting(true);
    try {
      // Generate a single group_id for this whole submission
      const groupId = crypto.randomUUID();
      const rows = [];
      entries.forEach((entry) => {
        const count = Math.max(1, Math.min(6, Number(entry.shifts) || 1));
        for (let i = 0; i < count; i++) {
          rows.push({
            group_id: groupId,
            posted_by: currentCoach.id,
            date: entry.date,
            time: i === 0 ? entry.time : addHoursToTime(entry.time, i),
            class_name: entry.className,
            reason: entry.reason || null,
            status: 'open',
          });
        }
      });

      const { error } = await supabase.from('shifts').insert(rows);
      if (error) throw error;

      await refetch();
      setModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stubs for Parts 3 and 4 of this playbook
  const handleClaim = async (selectedShifts) => {
    setIsSubmitting(true);
    try {
      const ids = selectedShifts.map((s) => s.id);
      const { error } = await supabase
        .from('shifts')
        .update({
          status: 'claimed',
          claimed_by: currentCoach.id,
          claimed_at: new Date().toISOString(),
        })
        .in('id', ids)
        .eq('status', 'open');  // Only update if still open (guards against race conditions)

      if (error) throw error;

      await refetch();
      setModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = async (shiftsToCancel) => {
    setIsSubmitting(true);
    try {
      const ids = shiftsToCancel.map((s) => s.id);
      const { error } = await supabase
        .from('shifts')
        .update({ status: 'cancelled' })
        .in('id', ids)
        .eq('status', 'open');  // Only cancel if still open

      if (error) throw error;

      await refetch();
      setModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleUnclaim = async (shiftsToRelease) => {
    setIsSubmitting(true);
    try {
      const ids = shiftsToRelease.map((s) => s.id);
      const { error } = await supabase
        .from('shifts')
        .update({
          status: 'open',
          claimed_by: null,
          claimed_at: null,
        })
        .in('id', ids)
        .eq('claimed_by', currentCoach.id);  // Only release shifts you actually claimed

      if (error) throw error;

      await refetch();
      setModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          onPostShift={() => setModal({ type: 'post-shift' })}
          onClaim={(shifts) => setModal({ type: 'confirm-claim', shifts })}
          onCancel={(shifts) => setModal({ type: 'confirm-cancel', shifts })}
          onRelease={(shifts) => setModal({ type: 'confirm-unclaim', shifts })}
        />
      </main>

      {modal?.type === 'post-shift' && (
        <PostShiftModal
          onClose={() => setModal(null)}
          onSubmit={handlePostShift}
          isSubmitting={isSubmitting}
        />
      )}
      {modal?.type === 'confirm-claim' && (
        <ConfirmClaimModal
          shifts={modal.shifts}
          onClose={() => setModal(null)}
          onConfirm={handleClaim}
          coachById={coachById}
          isSubmitting={isSubmitting}
        />
      )}
      {modal?.type === 'confirm-cancel' && (
        <ConfirmCancelModal
          shifts={modal.shifts}
          onClose={() => setModal(null)}
          onConfirm={handleCancel}
          isSubmitting={isSubmitting}
        />
      )}
      {modal?.type === 'confirm-unclaim' && (
        <ConfirmUnclaimModal
          shifts={modal.shifts}
          onClose={() => setModal(null)}
          onConfirm={handleUnclaim}
          coachById={coachById}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}