import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { styles } from '../lib/styles';
import { formatDay, hoursUntil, isPast } from '../lib/helpers';

/**
 * Compact single-line row for use in the manager view.
 *
 * Displays date(s), class summary, location, poster, and status.
 * Click to expand inline showing all sub-shifts with times and the reason.
 *
 * Props:
 *   group: array of shift objects sharing a group_id + date
 *   coachById: function (coachId) => coach object
 */
export default function ShiftRow({ group, coachById, selectable, selected, onToggleSelect }) {
    const [expanded, setExpanded] = useState(false);
    const [hovered, setHovered] = useState(false);

    const first = group[0];
    const isGroup = group.length > 1;
    const poster = coachById(first.postedBy) || { name: 'Unknown' };

    // Status decision logic
    const isShiftPast = isPast(first.date, first.time);
    const anyOpen = group.some((s) => s.status === 'open');
    const allClaimed = group.every((s) => s.status === 'claimed');
    const urgent = anyOpen && !isShiftPast && hoursUntil(first.date, first.time) < 48;

    let statusLabel, statusStyle;
    if (isShiftPast) {
        statusLabel = 'Past';
        statusStyle = styles.statusPillPast;
    } else if (allClaimed) {
        statusLabel = 'Covered';
        statusStyle = styles.statusPillCovered;
    } else if (urgent) {
        statusLabel = 'Urgent';
        statusStyle = styles.statusPillUrgent;
    } else {
        const openCount = group.filter((s) => s.status === 'open').length;
        statusLabel = isGroup && openCount < group.length
            ? `${openCount}/${group.length} Open`
            : 'Open';
        statusStyle = styles.statusPillOpen;
    }

    // Date display: single date or range
    const dates = [...new Set(group.map((s) => s.date))].sort();
    const dateDisplay = dates.length === 1
        ? formatDay(dates[0])
        : `${formatDay(dates[0])} → ${formatDay(dates[dates.length - 1])}`;

    // Class summary
    const classes = [...new Set(group.map((s) => s.className))];
    const classDisplay = isGroup
        ? `${classes.join(', ')} · ${group.length} classes`
        : first.className;

    return (
        <>
            <div
                style={{
                    ...styles.shiftRow,
                    ...(hovered ? styles.shiftRowHover : {}),
                    ...(selected ? styles.shiftRowSelected : {}),
                }}
                onClick={() => setExpanded((e) => !e)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {selectable ? (
                    <input
                        type="checkbox"
                        checked={selected || false}
                        onChange={(e) => {
                            e.stopPropagation();
                            onToggleSelect?.();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={styles.shiftRowCheckbox}
                    />
                ) : (
                    <div style={styles.shiftRowCheckboxPlaceholder} />
                )}

                <div style={styles.shiftRowDate}>{dateDisplay}</div>
                <div style={styles.shiftRowMain}>
                    <span style={styles.shiftRowClass}>{classDisplay}</span>
                    <span style={styles.shiftRowMeta}>· {first.location} ·</span>
                    <span style={styles.shiftRowPoster}>{poster.name}</span>
                </div>
                <div style={{ ...styles.shiftRowStatus, ...statusStyle }}>
                    {statusLabel}
                </div>
                <div style={{
                    ...styles.shiftRowChevron,
                    ...(expanded ? styles.shiftRowChevronOpen : {}),
                }}>
                    <ChevronRight size={16} />
                </div>
            </div>

            {expanded && (
                <div style={styles.shiftRowExpanded}>
                    {group
                        .slice()
                        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
                        .map((s) => {
                            const claimer = s.claimedBy ? coachById(s.claimedBy) : null;
                            return (
                                <div key={s.id} style={styles.shiftRowSubItem}>
                                    <span style={{ fontWeight: 600, minWidth: 110 }}>
                                        {formatDay(s.date)} · {s.time}
                                    </span>
                                    <span>{s.className}</span>
                                    <span style={{ color: '#87837b' }}>·</span>
                                    <span style={{ color: claimer ? '#065f46' : '#c03434', fontWeight: 600 }}>
                                        {claimer ? `Covered by ${claimer.name}` : 'Open'}
                                    </span>
                                </div>
                            );
                        })}

                    {first.reason && (
                        <div style={styles.shiftRowReason}>
                            <strong>Reason:</strong> {first.reason}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}