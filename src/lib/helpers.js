// Utility functions shared across the app

export const uid = () => Math.random().toString(36).slice(2, 10);

// Build an ISO date string (YYYY-MM-DD) for N days from today
// Uses LOCAL components to avoid a UTC roundtrip that shifts dates back
// by a day in timezones ahead of UTC (e.g. Amsterdam CEST).
export const isoDay = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

export const dateToISO = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

export const shiftDateISO = (iso, days) => {
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    return dateToISO(date);
};

export const addHoursToTime = (timeStr, hours) => {
    const [h, m] = timeStr.split(':').map(Number);
    const newH = (h + hours) % 24;
    return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const formatDay = (iso) => {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-GB', {
        weekday: 'short', day: 'numeric', month: 'short',
    });
};

export const formatRelative = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
};

export const hoursUntil = (dateISO, timeStr) => {
    const [h, m] = timeStr.split(':');
    const target = new Date(dateISO + 'T00:00:00');
    target.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
    return (target.getTime() - Date.now()) / 3600000;
};

export const isPast = (dateISO, timeStr) => hoursUntil(dateISO, timeStr) < 0;

// Cluster shifts by groupId (falling back to id for legacy/standalone shifts)
// Returns an array of groups; each group is sorted by date+time.
export const groupShifts = (shiftsArr) => {
    const map = new Map();
    for (const s of shiftsArr) {
        const key = `${s.groupId || s.id}__${s.date}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(s);
    }
    const groups = Array.from(map.values());
    groups.forEach((g) => g.sort(
        (a, b) => (a.date + a.time).localeCompare(b.date + b.time)
    ));
    return groups;
};

// Class types list — used by the Post Shift modal dropdown
/**
 * Classes offered at each location. Edit this when the box adds or
 * retires a class, or opens a new location. Everything downstream
 * (post modal, cards, filters, display) reads from here — no other
 * file needs updating.
 */
export const CLASSES_BY_LOCATION = {
  KA: ['Functional CrossFit', 'Strength', 'Olympic Weightlifting'],
  OV: ['Classic CrossFit', 'Hyrox', 'Advanced CrossFit'],
  HW: ['Classic CrossFit', 'Functional CrossFit', 'Strength', 'Hyrox', 'Olympic Weightlifting', 'Advanced CrossFit', 'Open Gym'],
};

export const LOCATIONS = Object.keys(CLASSES_BY_LOCATION);

/**
 * Returns all unique class types across all locations.
 * Useful for building filter dropdowns or displaying lists.
 */
export const ALL_CLASSES = [
  ...new Set(Object.values(CLASSES_BY_LOCATION).flat())
].sort();

/**
 * Small helper for constructing notification rows from a Supabase write.
 * Returns the row object; caller does the .insert().
 */
export const buildNotification = (type, groupId, shiftIds, actorId) => ({
  type,
  group_id: groupId,
  shift_ids: shiftIds,
  actor_id: actorId,
});