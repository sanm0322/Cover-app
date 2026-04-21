import { Calendar, Clock, Check, X, ArrowRight } from 'lucide-react';
import { styles } from '../lib/styles';
import { formatDay, hoursUntil, isPast } from '../lib/helpers';
import Avatar from './primitives/Avatar';

/**
 * Display card for a "group" of shifts (1 or more shifts that share a groupId).
 *
 * Props:
 *   group: array of shift objects (always at least 1)
 *   variant: 'open-other' | 'mine' | 'covering'
 *   currentUserId: the logged-in coach's id
 *   coachById: (id) => coach object | undefined
 *   onClaim: (shifts) => void  (only relevant for 'open-other')
 *   onCancel: (shifts) => void (only relevant for 'mine')
 */
export default function ShiftCard({ group, variant, currentUserId, coachById, onClaim, onCancel }) {
    const shifts = group;
    const first = shifts[0];
    const isGroup = shifts.length > 1;
    const poster = coachById(first.postedBy) || { id: first.postedBy, name: 'Unknown', initials: '??' };

    const openShifts = shifts.filter((s) => s.status === 'open' && !isPast(s.date, s.time));
    const claimedShifts = shifts.filter((s) => s.status === 'claimed');
    const pastShifts = shifts.filter((s) => isPast(s.date, s.time));
    const anyUrgent = openShifts.some((s) => hoursUntil(s.date, s.time) < 48);
    const allPast = pastShifts.length === shifts.length;
    const allClaimed = claimedShifts.length === shifts.length;
    const allOpen = openShifts.length === shifts.length;

    const statusColor =
        allPast ? '#87837b' :
            allOpen ? '#c03434' :
                allClaimed ? '#1d6b48' :
                    '#c29536';
    const statusLabel =
        allPast ? 'PAST' :
            allOpen ? (anyUrgent ? 'URGENT · OPEN' : 'OPEN') :
                allClaimed ? 'COVERED' :
                    `${claimedShifts.length}/${shifts.length} COVERED`;

    const canClaim = variant === 'open-other' && openShifts.length > 0;
    const canCancel = variant === 'mine' && openShifts.length > 0;

    return (
        <article
            style={{
                ...styles.card,
                borderLeft: `4px solid ${statusColor}`,
                opacity: allPast ? 0.6 : 1,
            }}
        >
            <div style={styles.cardMain}>
                <div style={styles.cardTop}>
                    <div style={styles.cardClass}>
                        {isGroup
                            ? `${shifts.length} classes · ${groupClassSummary(shifts)}`
                            : first.className}
                    </div>
                    <div style={{ ...styles.statusTag, color: statusColor, borderColor: statusColor }}>
                        {statusLabel}
                    </div>
                </div>

                {!isGroup ? (
                    <div style={styles.cardMeta}>
                        <span style={styles.metaItem}><Calendar size={13} /> {formatDay(first.date)}</span>
                        <span style={styles.metaItem}><Clock size={13} /> {first.time}</span>
                    </div>
                ) : (
                    <div style={styles.cardMeta}>
                        <span style={styles.metaItem}>
                            <Calendar size={13} /> {groupDateRange(shifts)}
                        </span>
                    </div>
                )}

                <div style={styles.cardPeople}>
                    <div style={styles.personLine}>
                        <Avatar coach={poster} size={22} />
                        <div style={styles.personText}>
                            <span style={styles.personLabel}>Posted by</span>
                            <span style={styles.personName}>{poster.name}</span>
                        </div>
                    </div>
                    {!isGroup && first.claimedBy && (
                        <>
                            <ArrowRight size={14} style={{ color: '#87837b', flexShrink: 0 }} />
                            <div style={styles.personLine}>
                                {(() => {
                                    const claimer = coachById(first.claimedBy) || { id: first.claimedBy, name: 'Unknown', initials: '??' };
                                    return (
                                        <>
                                            <Avatar coach={claimer} size={22} />
                                            <div style={styles.personText}>
                                                <span style={styles.personLabel}>Covered by</span>
                                                <span style={styles.personName}>{claimer.name}</span>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </>
                    )}
                </div>

                {first.reason && (
                    <div style={styles.cardReason}>
                        <span style={styles.reasonLabel}>REASON</span> {first.reason}
                    </div>
                )}

                {isGroup && (
                    <ul style={styles.subShiftList}>
                        {shifts.map((s) => {
                            const claimer = s.claimedBy ? coachById(s.claimedBy) : null;
                            const dotColor = isPast(s.date, s.time) ? '#87837b' : s.status === 'open' ? '#c03434' : '#1d6b48';
                            return (
                                <li key={s.id} style={styles.subShiftRow}>
                                    <span style={{ ...styles.subShiftDot, background: dotColor }} />
                                    <span style={styles.subShiftWhen}>{formatDay(s.date)} · {s.time}</span>
                                    <span style={styles.subShiftClass}>{s.className}</span>
                                    <span style={styles.subShiftStatus}>
                                        {isPast(s.date, s.time)
                                            ? 'past'
                                            : s.status === 'open'
                                                ? 'open'
                                                : <>covered by <strong>{claimer?.name || '…'}</strong></>}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {(canClaim || canCancel) && (
                <div style={styles.cardAction}>
                    {canClaim && (
                        <button onClick={() => onClaim(shifts)} style={styles.claimBtn}>
                            <Check size={14} strokeWidth={3} />{' '}
                            {isGroup
                                ? `COVER 1 OR MORE (${openShifts.length} OPEN)`
                                : "I'LL COVER IT"}
                        </button>
                    )}
                    {canCancel && (
                        <button onClick={() => onCancel(openShifts)} style={styles.cancelBtn}>
                            <X size={14} />{' '}
                            {openShifts.length > 1 ? `Cancel ${openShifts.length} open` : 'Cancel request'}
                        </button>
                    )}
                </div>
            )}
        </article>
    );
}

// Inline helpers used only by ShiftCard
function groupClassSummary(shifts) {
    const unique = [...new Set(shifts.map((s) => s.className))];
    if (unique.length === 1) return unique[0];
    if (unique.length === 2) return unique.join(' + ');
    return `${unique.length} class types`;
}

function groupDateRange(shifts) {
    const dates = [...new Set(shifts.map((s) => s.date))].sort();
    if (dates.length === 1) return formatDay(dates[0]);
    return `${formatDay(dates[0])} → ${formatDay(dates[dates.length - 1])}`;
}