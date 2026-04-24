import { Check, X, ArrowRight } from 'lucide-react';
import { styles } from '../lib/styles';
import { isPast } from '../lib/helpers';
import Avatar from './primitives/Avatar';

/**
 * Detail panel shown below the calendar grid for the selected day.
 *
 * Props:
 *   date: 'YYYY-MM-DD' string of the selected day
 *   shifts: shifts happening on that day, already sorted by time
 *   allShifts: ALL shifts (needed to find group siblings when claiming)
 *   currentUserId: the logged-in coach's id
 *   coachById: lookup function
 *   onClaim:   (shifts) => void — opens the claim modal
 *   onCancel:  (shifts) => void — opens the cancel modal
 *   onRelease: (shifts) => void — opens the release modal
 */
export default function DayDetails({
    date, shifts, allShifts, currentUserId, coachById,
    onClaim, onCancel, onRelease,
}) {
    const formatted = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long',
    });
    const isEmpty = shifts.length === 0;

    return (
        <div style={styles.dayDetails}>
            <div style={styles.dayDetailsHeader}>
                <span style={styles.dayDetailsDate}>{formatted}</span>
                {!isEmpty && (
                    <span style={styles.dayDetailsCount}>
                        {shifts.length} {shifts.length === 1 ? 'class' : 'classes'}
                    </span>
                )}
            </div>
            {isEmpty ? (
                <div style={styles.dayDetailsEmpty}>
                    <div style={styles.emptyDash} />
                    <span>No classes scheduled for this day.</span>
                </div>
            ) : (
                <ul style={styles.dayShiftList}>
                    {shifts.map((s) => {
                        const poster = coachById(s.postedBy) || { id: s.postedBy, name: 'Unknown', initials: '??' };
                        const claimer = s.claimedBy ? coachById(s.claimedBy) : null;
                        const isMine = s.postedBy === currentUserId;
                        const isMyCover = s.claimedBy === currentUserId;
                        const past = isPast(s.date, s.time);
                        const isOpen = s.status === 'open' && !past;
                        const isClaimed = s.status === 'claimed' && !past;
                        const statusColor = past ? '#87837b' : s.status === 'open' ? '#c03434' : '#1d6b48';

                        // When firing an action, pass the full group's relevant shifts so
                        // the downstream modal can open in multi-select mode if applicable.
                        const groupKey = s.groupId || s.id;
                        const groupOpen = allShifts.filter(
                            (x) =>
                                (x.groupId || x.id) === groupKey &&
                                x.status === 'open' &&
                                !isPast(x.date, x.time)
                        );
                        const groupMyCovering = allShifts.filter(
                            (x) =>
                                (x.groupId || x.id) === groupKey &&
                                x.claimedBy === currentUserId &&
                                !isPast(x.date, x.time)
                        );

                        const canClaim = isOpen && !isMine;
                        const canCancel = isOpen && isMine;
                        const canRelease = isClaimed && isMyCover;

                        return (
                            <li key={s.id} style={styles.dayShiftRow}>
                                <span style={{ ...styles.dayShiftDot, background: statusColor }} />
                                <span style={styles.dayShiftTime}>{s.time}</span>
                                <span style={styles.dayShiftClass}>
                                    <span style={{ ...styles.locationChip, marginRight: 8, fontSize: 9 }}>{s.location}</span>
                                    {s.className}
                                </span>
                                <span style={styles.dayShiftPeople}>
                                    <Avatar coach={poster} size={18} />
                                    <span style={styles.dayShiftName}>{poster.name}</span>
                                    {claimer && (
                                        <>
                                            <ArrowRight size={11} style={{ color: '#87837b', flexShrink: 0 }} />
                                            <Avatar coach={claimer} size={18} />
                                            <span style={styles.dayShiftName}>{claimer.name}</span>
                                        </>
                                    )}
                                </span>
                                {canClaim && (
                                    <button onClick={() => onClaim(groupOpen)} style={styles.dayShiftBtnClaim}>
                                        <Check size={12} strokeWidth={3} /> Cover
                                    </button>
                                )}
                                {canCancel && (
                                    <button onClick={() => onCancel(groupOpen)} style={styles.dayShiftBtnCancel}>
                                        <X size={12} /> Cancel
                                    </button>
                                )}
                                {canRelease && (
                                    <button onClick={() => onRelease(groupMyCovering)} style={styles.dayShiftBtnCancel}>
                                        <X size={12} /> Release
                                    </button>
                                )}
                                {past && !canClaim && !canCancel && !canRelease && (
                                    <span style={styles.dayShiftStatusText}>past</span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}