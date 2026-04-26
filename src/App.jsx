import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useSession } from './useSession';
import AuthGate from './components/AuthGate';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import ManagerView from './components/ManagerView';
import RoleToggle from './components/RoleToggle';
import PostShiftModal from './components/PostShiftModal';
import ConfirmClaimModal from './components/ConfirmClaimModal';
import ConfirmCancelModal from './components/ConfirmCancelModal';
import ConfirmUnclaimModal from './components/ConfirmUnclaimModal';
import { useShifts } from './lib/useShifts';
import { useCoachLookup } from './lib/useCoachLookup';
import { useNotifications } from './lib/useNotifications';
import { addHoursToTime } from './lib/helpers';
import { styles } from './lib/styles';
import BackToTop from './components/BackToTop';

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
  const { notifications, refetch: refetchNotifs } = useNotifications(50);
  const coachById = useCoachLookup(allCoaches);

  const [modal, setModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState('coach');  // 'coach' | 'manager'

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

  const handlePostShift = async (entries) => {
    setIsSubmitting(true);
    try {
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
            location: entry.location,
            reason: entry.reason || null,
            status: 'open',
          });
        }
      });

      const { data: inserted, error } = await supabase
        .from('shifts')
        .insert(rows)
        .select('id');
      if (error) throw error;

      await supabase.from('notifications').insert({
        type: 'posted',
        group_id: groupId,
        shift_ids: inserted.map((s) => s.id),
        actor_id: currentCoach.id,
      });

      await Promise.all([refetch(), refetchNotifs()]);
      setModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToRequest = async (entries, existingGroup) => {
    setIsSubmitting(true);
    try {
      // Reuse the existing group's group_id
      const groupId = existingGroup[0].groupId || existingGroup[0].id;

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
            location: entry.location,
            reason: entry.reason || existingGroup[0].reason || null,
            status: 'open',
          });
        }
      });

      const { data: inserted, error } = await supabase
        .from('shifts')
        .insert(rows)
        .select('id');
      if (error) throw error;

      await supabase.from('notifications').insert({
        type: 'posted',
        group_id: groupId,
        shift_ids: inserted.map((s) => s.id),
        actor_id: currentCoach.id,
      });

      await Promise.all([refetch(), refetchNotifs()]);
      setModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        .eq('status', 'open');
      if (error) throw error;

      await supabase.from('notifications').insert({
        type: 'claimed',
        group_id: selectedShifts[0].groupId || selectedShifts[0].id,
        shift_ids: ids,
        actor_id: currentCoach.id,
      });

      await Promise.all([refetch(), refetchNotifs()]);
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
        .eq('status', 'open');
      if (error) throw error;

      await supabase.from('notifications').insert({
        type: 'cancelled',
        group_id: shiftsToCancel[0].groupId || shiftsToCancel[0].id,
        shift_ids: ids,
        actor_id: currentCoach.id,
      });

      await Promise.all([refetch(), refetchNotifs()]);
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
        .eq('claimed_by', currentCoach.id);
      if (error) throw error;

      await supabase.from('notifications').insert({
        type: 'released',
        group_id: shiftsToRelease[0].groupId || shiftsToRelease[0].id,
        shift_ids: ids,
        actor_id: currentCoach.id,
      });

      await Promise.all([refetch(), refetchNotifs()]);
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

  const isManager = currentCoach.roles?.includes('manager');

  return (
    <div style={styles.root}>
      <TopBar coach={currentCoach} onLogout={handleLogout} />
      <main style={styles.main}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 20px 0' }}>
          {isManager && <RoleToggle role={role} onChange={setRole} />}
        </div>

        {isManager && role === 'manager' ? (
          <ManagerView
            shifts={shifts}
            notifications={notifications}
            coachById={coachById}
            allCoaches={allCoaches}
          />
        ) : (
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
            onAddToRequest={(group) => setModal({ type: 'add-to-request', existingGroup: group })}
          />
        )}
      </main>

      {modal?.type === 'add-to-request' && (
        <PostShiftModal
          onClose={() => setModal(null)}
          onSubmit={(entries) => handleAddToRequest(entries, modal.existingGroup)}
          isSubmitting={isSubmitting}
          existingGroup={modal.existingGroup}
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
      <BackToTop />
    </div>
  );
}