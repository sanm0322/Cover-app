import { useState } from 'react';
import { AlertCircle, Activity, Calendar } from 'lucide-react';
import { styles } from '../lib/styles';
import { isPast, hoursUntil, formatDay, formatRelative, groupShifts } from '../lib/helpers';
import Stat from './primitives/Stat';
import Section from './primitives/Section';
import EmptyState from './primitives/EmptyState';
import ShiftCard from './ShiftCard';
import ViewModeToggle from './ViewModeToggle';
import CalendarView from './CalendarView';

/**
 * The manager's overview dashboard: team-wide stats, urgent banner,
 * filter pills, list or calendar of all shifts, and an activity log.
 *
 * Read-only. No action buttons on cards; managers see what's happening
 * but don't post/claim/cancel on behalf of others.
 *
 * Props:
 *   shifts: all non-cancelled shifts (already filtered in useShifts)
 *   notifications: all recent notifications
 *   coachById: coach lookup function
 *   allCoaches: the full roster (for the active-coaches stat)
 */
export default function ManagerView({ shifts, notifications, coachById, allCoaches }) {
    const [filter, setFilter] = useState('active');
    const [mode, setMode] = useState('list');

    const active = shifts.filter((s) => !isPast(s.date, s.time));
    const past = shifts.filter((s) => isPast(s.date, s.time));
    const openAll = active.filter((s) => s.status === 'open');
    const claimed = active.filter((s) => s.status === 'claimed');
    const urgent = openAll.filter((s) => hoursUntil(s.date, s.time) < 48);

    const sortByTime = (arr) =>
        [...arr].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const sortByTimeDesc = (arr) =>
        [...arr].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

    const filtered =
        filter === 'active' ? sortByTime(active) :
            filter === 'open' ? sortByTime(openAll) :
                filter === 'claimed' ? sortByTime(claimed) :
                    filter === 'past' ? sortByTimeDesc(past) :
                        active;

    const activeCoachCount = allCoaches.filter((c) => c.roles.includes('coach')).length;

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 20px 40px' }}>
            <div style={styles.heroRow}>
                <div>
                    <div style={styles.kicker}>Manager overview</div>
                    <h1 style={styles.hero}>THE BOARD.</h1>
                    <p style={styles.heroSub}>
                        Live visibility on every coverage request across your coaching team.
                    </p>
                </div>
            </div>

            <div style={styles.statRow}>
                <Stat label="Open (need cover)" value={openAll.length} accent="red" />
                <Stat label="Covered / confirmed" value={claimed.length} accent="green" />
                <Stat label="Urgent (< 48h)" value={urgent.length} accent={urgent.length ? 'red' : 'ink'} />
                <Stat label="Coaches active" value={activeCoachCount} accent="ink" />
            </div>

            {urgent.length > 0 && (
                <div style={styles.alertBar}>
                    <AlertCircle size={16} />
                    <span>
                        <strong>{urgent.length}</strong> open {urgent.length === 1 ? 'shift' : 'shifts'} within 48 hours and still uncovered.
                    </span>
                </div>
            )}

            <ViewModeToggle mode={mode} onChange={setMode} />

            {mode === 'calendar' ? (
                <CalendarView
                    shifts={shifts}
                    currentUserId={null}
                    coachById={coachById}
                    onClaim={() => { }}
                    onCancel={() => { }}
                    onRelease={() => { }}
                />
            ) : (
                <>
                    <div style={styles.filterRow}>
                        {[
                            { id: 'active', label: 'All active', n: active.length },
                            { id: 'open', label: 'Open', n: openAll.length },
                            { id: 'claimed', label: 'Covered', n: claimed.length },
                            { id: 'past', label: 'Past', n: past.length },
                        ].map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                style={{
                                    ...styles.filterBtn,
                                    ...(filter === f.id ? styles.filterBtnActive : {}),
                                }}
                            >
                                {f.label} <span style={styles.filterCount}>{f.n}</span>
                            </button>
                        ))}
                    </div>

                    <Section title="Shifts" count={filtered.length} icon={<Calendar size={14} />}>
                        {filtered.length === 0 ? (
                            <EmptyState message="Nothing here for this filter." />
                        ) : (
                            groupShifts(filtered).map((g) => (
                                <ShiftCard
                                    key={g[0].groupId || g[0].id}
                                    group={g}
                                    variant="manager"
                                    currentUserId={null}
                                    coachById={coachById}
                                />
                            ))
                        )}
                    </Section>
                </>
            )}

            <Section
                title="Activity log"
                count={notifications.length}
                icon={<Activity size={14} />}
            >
                <div style={styles.logBox}>
                    {notifications.length === 0 ? (
                        <EmptyState message="Nothing has happened yet." />
                    ) : (
                        notifications.slice(0, 20).map((n) => {
                            const actor = coachById(n.actorId) || { name: 'Someone' };
                            const relevantShifts = n.shiftIds
                                .map((id) => shifts.find((s) => s.id === id))
                                .filter(Boolean);
                            // Even if shifts are missing (maybe cancelled, deleted, past), the log is still valuable
                            const count = n.shiftIds.length;
                            const firstShift = relevantShifts[0];

                            return (
                                <div key={n.id} style={styles.logRow}>
                                    <div style={styles.logTime}>{formatRelative(n.at)}</div>
                                    <div style={styles.logDot(n.type)} />
                                    <div style={styles.logText}>
                                        <strong>{actor.name}</strong>{' '}
                                        {n.type === 'posted' && (count > 1
                                            ? <>posted <em>{count} classes</em>{firstShift ? <> from {formatDay(firstShift.date)} · {firstShift.time}</> : null}</>
                                            : <>posted{firstShift ? <> <em>{firstShift.className}</em> on {formatDay(firstShift.date)} · {firstShift.time}</> : ' a class'}</>)}
                                        {n.type === 'claimed' && (count > 1
                                            ? <>claimed <em>{count} classes</em>{firstShift ? <> starting {formatDay(firstShift.date)} · {firstShift.time}</> : null}</>
                                            : <>claimed{firstShift ? <> <em>{firstShift.className}</em> on {formatDay(firstShift.date)} · {firstShift.time}</> : ' a shift'}</>)}
                                        {n.type === 'cancelled' && (count > 1
                                            ? <>cancelled a request for <em>{count} classes</em></>
                                            : <>cancelled their request{firstShift ? <> for <em>{firstShift.className}</em></> : ''}</>)}
                                        {n.type === 'released' && (count > 1
                                            ? <>released <em>{count} shifts</em> back to the pool</>
                                            : <>released{firstShift ? <> <em>{firstShift.className}</em></> : ' a shift'} back to the pool</>)}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </Section>
        </div>
    );
}