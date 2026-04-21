import { useState, useMemo } from 'react';
import { styles } from '../lib/styles';
import { dateToISO } from '../lib/helpers';
import DayDetails from './DayDetails';

/**
 * Month calendar grid view.
 *
 * Props:
 *   shifts: ALL shifts (not filtered — the calendar shows its own breakdown)
 *   currentUserId: logged-in coach id
 *   coachById: lookup function
 *   onClaim / onCancel / onRelease: action handlers (same as list view)
 */
export default function CalendarView({ shifts, currentUserId, coachById, onClaim, onCancel, onRelease }) {
    const today = new Date();
    const todayISO = dateToISO(today);

    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState(todayISO);

    const prev = () => {
        if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1);
    };
    const next = () => {
        if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1);
    };
    const jumpToToday = () => {
        setYear(today.getFullYear());
        setMonth(today.getMonth());
        setSelectedDate(todayISO);
    };

    // Group shifts by date for O(1) cell lookup
    const shiftsByDate = useMemo(() => {
        const m = new Map();
        for (const s of shifts) {
            if (!m.has(s.date)) m.set(s.date, []);
            m.get(s.date).push(s);
        }
        return m;
    }, [shifts]);

    // Build a 6-week grid (42 cells), starting from Monday of the first visible week
    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay(); // 0=Sun..6=Sat
    const offset = firstWeekday === 0 ? 6 : firstWeekday - 1;

    const cells = [];
    for (let i = -offset; i < 42 - offset; i++) {
        cells.push(new Date(year, month, 1 + i));
    }

    const monthLabel = firstDay.toLocaleDateString('en-GB', {
        month: 'long', year: 'numeric',
    });
    const weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const selectedShifts = (shiftsByDate.get(selectedDate) || [])
        .slice()
        .sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div>
            <div style={styles.calHeader}>
                <button onClick={prev} style={styles.calNavBtn} title="Previous month">‹</button>
                <div style={styles.calTitle}>{monthLabel}</div>
                <button onClick={next} style={styles.calNavBtn} title="Next month">›</button>
                <button onClick={jumpToToday} style={styles.calTodayBtn}>Today</button>
            </div>

            <div style={styles.calWeekdayRow}>
                {weekdayLabels.map((d, i) => (
                    <div key={i} style={styles.calWeekdayLabel}>{d}</div>
                ))}
            </div>

            <div style={styles.calGrid}>
                {cells.map((d) => {
                    const iso = dateToISO(d);
                    const inMonth = d.getMonth() === month;
                    const isToday = iso === todayISO;
                    const isSelected = iso === selectedDate;
                    const dayShifts = shiftsByDate.get(iso) || [];
                    const open = dayShifts.filter((s) => s.status === 'open').length;
                    const covered = dayShifts.filter((s) => s.status === 'claimed').length;
                    const cellStyle = {
                        ...styles.calCell,
                        ...(!inMonth ? styles.calCellOutMonth : {}),
                        ...(isSelected ? styles.calCellSelected : {}),
                    };
                    return (
                        <button key={iso} onClick={() => setSelectedDate(iso)} style={cellStyle}>
                            <div style={{
                                ...styles.calDayNum,
                                ...(isSelected ? { color: '#ece7da' } : {}),
                                ...(isToday && !isSelected ? styles.calDayNumToday : {}),
                            }}>
                                {d.getDate()}
                            </div>
                            <div style={styles.calDayIndicators}>
                                {open > 0 && (
                                    <span style={{ ...styles.calBadge, background: '#c03434', color: '#fff' }}>
                                        {open}
                                    </span>
                                )}
                                {covered > 0 && (
                                    <span style={{ ...styles.calBadge, background: '#1d6b48', color: '#fff' }}>
                                        {covered}
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            <DayDetails
                date={selectedDate}
                shifts={selectedShifts}
                allShifts={shifts}
                currentUserId={currentUserId}
                coachById={coachById}
                onClaim={onClaim}
                onCancel={onCancel}
                onRelease={onRelease}
            />
        </div>
    );
}