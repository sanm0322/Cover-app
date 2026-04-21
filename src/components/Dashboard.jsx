import { Plus, Inbox, Bell, Shield } from 'lucide-react';
import { styles } from '../lib/styles';
import { groupShifts, isPast } from '../lib/helpers';
import Stat from './primitives/Stat';
import Section from './primitives/Section';
import EmptyState from './primitives/EmptyState';
import ShiftCard from './ShiftCard';

/**
 * The main logged-in view. Shows the hero greeting, stat counts,
 * and three sections (open / mine / covering) of shifts.
 *
 * Props:
 *   currentCoach: the logged-in coach's row
 *   coachById: lookup function
 *   shifts: array of all shifts
 *   loading: is the shift list still loading?
 *   error: optional error string
 *   onPostShift: () => void  (stub in Part 4, real handler in Part 5)
 *   onClaim: (shifts) => void
 *   onCancel: (shifts) => void
 *   onOpenCalendar: () => void  (stub for now)
 */
export default function Dashboard({
    currentCoach,
    coachById,
    shifts,
    loading,
    error,
    onPostShift,
    onClaim,
    onCancel,
}) {
    if (error) {
        return (
            <div style={{ maxWidth: 720, margin: '0 auto', padding: 40 }}>
                <h2>Something went wrong</h2>
                <pre style={{ background: '#fee', padding: 16, borderRadius: 6 }}>{error}</pre>
            </div>
        );
    }

    const activeShifts = shifts.filter((s) => !isPast(s.date, s.time));
    const openShifts = activeShifts.filter((s) => s.status === 'open' && s.postedBy !== currentCoach.id);
    const myOpenShifts = activeShifts.filter((s) => s.postedBy === currentCoach.id && s.status === 'open');
    const myCoverShifts = activeShifts.filter((s) => s.claimedBy === currentCoach.id);

    const openGroups = groupShifts(openShifts);
    const myGroups = groupShifts(myOpenShifts);
    const coverGroups = groupShifts(myCoverShifts);

    const firstName = currentCoach.name.split(' ')[0].toUpperCase();

    return (
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px 20px' }}>
            <div style={styles.heroRow}>
                <div>
                    <div style={styles.kicker}>Coach dashboard</div>
                    <h1 style={styles.hero}>HEY, {firstName}.</h1>
                    <p style={styles.heroSub}>
                        {loading
                            ? 'Loading shifts…'
                            : openShifts.length > 0
                                ? `${openShifts.length} open ${openShifts.length === 1 ? 'class needs' : 'classes need'} coverage.`
                                : 'No open shifts right now. Nice.'}
                    </p>
                </div>
                <button onClick={onPostShift} style={styles.bigPostBtn}>
                    <Plus size={18} strokeWidth={2.5} />
                    <span>I need coverage</span>
                </button>
            </div>

            <div style={styles.statRow}>
                <Stat label="Open in community" value={openShifts.length} accent="red" />
                <Stat label="My requests" value={myOpenShifts.length} accent="ink" />
                <Stat label="I'm covering" value={myCoverShifts.length} accent="green" />
            </div>

            <Section title="Open shifts" count={openShifts.length} icon={<Inbox size={14} />}>
                {openGroups.length === 0 ? (
                    <EmptyState message={loading ? 'Loading…' : 'Nothing open right now. The board is clean.'} />
                ) : (
                    openGroups.map((g) => (
                        <ShiftCard
                            key={g[0].groupId || g[0].id}
                            group={g}
                            variant="open-other"
                            currentUserId={currentCoach.id}
                            coachById={coachById}
                            onClaim={onClaim}
                        />
                    ))
                )}
            </Section>

            <Section title="My requests" count={myOpenShifts.length} icon={<Bell size={14} />}>
                {myGroups.length === 0 ? (
                    <EmptyState message="You haven't posted any classes needing cover." />
                ) : (
                    myGroups.map((g) => (
                        <ShiftCard
                            key={g[0].groupId || g[0].id}
                            group={g}
                            variant="mine"
                            currentUserId={currentCoach.id}
                            coachById={coachById}
                            onCancel={onCancel}
                        />
                    ))
                )}
            </Section>

            <Section title="Classes I'm covering" count={myCoverShifts.length} icon={<Shield size={14} />}>
                {coverGroups.length === 0 ? (
                    <EmptyState message="You haven't picked up any classes yet." />
                ) : (
                    coverGroups.map((g) => (
                        <ShiftCard
                            key={g[0].groupId || g[0].id}
                            group={g}
                            variant="covering"
                            currentUserId={currentCoach.id}
                            coachById={coachById}
                        />
                    ))
                )}
            </Section>
        </div>
    );
}