import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { styles } from '../lib/styles';
import { CLASSES_BY_LOCATION, LOCATIONS, isoDay, shiftDateISO, addHoursToTime, uid } from '../lib/helpers';
import ModalShell from './primitives/ModalShell';
import Field from './primitives/Field';

/**
 * Modal for creating one or more shift coverage requests.
 *
 * Each "entry" row expresses a single date + start time + class, with
 * an optional 1–6 shift multiplier for back-to-back hourly classes.
 * Calling onSubmit hands an array of flattened entries back to App.jsx
 * which performs the actual Supabase insert.
 *
 * Props:
 *   onClose: () => void
 *   onSubmit: (entries) => Promise<void> — entries is an array of
 *     { date, time, className, shifts, reason }
 *   isSubmitting: boolean (true while the Supabase insert is in-flight)
 */
export default function PostShiftModal({ onClose, onSubmit, isSubmitting, existingGroup }) {
    const [entries, setEntries] = useState([
        {
            id: uid(),
            date: isoDay(1),
            time: '18:00',
            location: LOCATIONS[0],
            className: CLASSES_BY_LOCATION[LOCATIONS[0]][0],
            shifts: 1,
        },
    ]);
    const [reason, setReason] = useState(existingGroup?.[0]?.reason || '');
    const [error, setError] = useState(null);

    const updateEntryLocation = (id, newLocation) => {
        setEntries((prev) => prev.map((e) => {
            if (e.id !== id) return e;
            const validClasses = CLASSES_BY_LOCATION[newLocation];
            const stillValid = validClasses.includes(e.className);
            return {
                ...e,
                location: newLocation,
                className: stillValid ? e.className : validClasses[0],
            };
        }));
    };

    const updateEntry = (id, patch) =>
        setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

    const addEntry = () => {
        const last = entries[entries.length - 1];
        const nextDate = last ? shiftDateISO(last.date, 1) : isoDay(1);
        const defaultLoc = last?.location ?? LOCATIONS[0];
        setEntries((prev) => [
            ...prev,
            {
                id: uid(),
                date: nextDate,
                time: last?.time ?? '18:00',
                location: defaultLoc,
                className: last?.className ?? CLASSES_BY_LOCATION[defaultLoc][0],
                shifts: 1,
            },
        ]);
    };

    const removeEntry = (id) => {
        if (entries.length === 1) return;
        setEntries((prev) => prev.filter((e) => e.id !== id));
    };

    const submit = async () => {
        setError(null);
        const clean = entries.filter((e) => e.date && e.time && e.className);
        if (clean.length === 0) {
            setError('Add at least one class with a date, time, and type.');
            return;
        }
        try {
            await onSubmit(clean.map(({ id, ...rest }) => ({ ...rest, reason })));
            // Parent closes the modal on success
        } catch (err) {
            setError(err.message || 'Something went wrong. Try again.');
        }
    };

    const totalShifts = entries.reduce(
        (acc, e) => acc + Math.max(1, Math.min(6, Number(e.shifts) || 1)),
        0
    );

    return (
        <ModalShell onClose={onClose} maxWidth={640}>
            <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>
                    {existingGroup ? 'ADD TO REQUEST' : 'REQUEST COVERAGE'}
                </h3>
                <button onClick={onClose} style={styles.closeBtn} disabled={isSubmitting}>
                    <X size={18} />
                </button>
            </div>
            <p style={styles.modalIntro}>
                {existingGroup ? (
                    <>
                        Adding more classes to your existing request.{' '}
                        The reason will be reused from the original; you can adjust it below if needed.
                    </>
                ) : (
                    <>
                        Add the classes you need covered. Teaching back-to-back hours? Set <strong>Shifts</strong> to <strong>2–6</strong> on a row to mean "N classes in a row starting at this time." Everything you post here goes out as <strong>one request</strong>.
                    </>
                )}
            </p>

            <div style={styles.entriesList}>
                {entries.map((entry, idx) => {
                    const count = Math.max(1, Math.min(6, Number(entry.shifts) || 1));
                    const preview = count > 1
                        ? Array.from({ length: count }, (_, i) => addHoursToTime(entry.time, i)).join(' · ')
                        : null;
                    return (
                        <div key={entry.id} style={styles.entryRow}>
                            <div style={styles.entryIndex}>{String(idx + 1).padStart(2, '0')}</div>
                            <div style={{ flex: 1 }}>
                                <div style={styles.entryFields}>
                                    <Field label="Date">
                                        <input
                                            type="date"
                                            value={entry.date}
                                            onChange={(e) => updateEntry(entry.id, { date: e.target.value })}
                                            style={styles.input}
                                            min={isoDay(0)}
                                            disabled={isSubmitting}
                                        />
                                    </Field>
                                    <Field label="Time">
                                        <input
                                            type="time"
                                            value={entry.time}
                                            onChange={(e) => updateEntry(entry.id, { time: e.target.value })}
                                            style={styles.input}
                                            disabled={isSubmitting}
                                        />
                                    </Field>
                                    <Field label="Shifts">
                                        <select
                                            value={entry.shifts}
                                            onChange={(e) => updateEntry(entry.id, { shifts: Number(e.target.value) })}
                                            style={styles.input}
                                            disabled={isSubmitting}
                                        >
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                            <option value={6}>6</option>
                                        </select>
                                    </Field>
                                    <Field label="Location">
                                        <select
                                            value={entry.location}
                                            onChange={(e) => updateEntryLocation(entry.id, e.target.value)}
                                            style={styles.input}
                                            disabled={isSubmitting}
                                        >
                                            {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Class">
                                        <select
                                            value={entry.className}
                                            onChange={(e) => updateEntry(entry.id, { className: e.target.value })}
                                            style={styles.input}
                                            disabled={isSubmitting}
                                        >
                                            {CLASSES_BY_LOCATION[entry.location].map((c) => <option key={c}>{c}</option>)}
                                        </select>
                                    </Field>
                                </div>
                                {preview && (
                                    <div style={styles.entryPreview}>
                                        → {count} back-to-back classes: {preview}
                                    </div>
                                )}
                            </div>
                            {entries.length > 1 && (
                                <button
                                    onClick={() => removeEntry(entry.id)}
                                    style={styles.removeEntryBtn}
                                    title="Remove this row"
                                    disabled={isSubmitting}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <button onClick={addEntry} style={styles.addEntryBtn} disabled={isSubmitting}>
                <Plus size={14} strokeWidth={3} /> Add another class
            </button>

            <Field label={totalShifts > 1 ? 'Reason (applies to all classes in this request)' : 'Reason (optional)'}>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={totalShifts > 1 ? 'e.g. Away on holiday from 27 Apr – 3 May' : 'Medical appointment, family commitment, etc.'}
                    style={{ ...styles.input, minHeight: 70, resize: 'vertical', fontFamily: 'Archivo, sans-serif' }}
                    disabled={isSubmitting}
                />
            </Field>

            {error && (
                <div style={{ background: '#fee', border: '1px solid #c03434', color: '#c03434', padding: 10, borderRadius: 4, fontSize: 13, marginTop: 12 }}>
                    {error}
                </div>
            )}

            <div style={styles.modalActions}>
                <button onClick={submit} style={styles.primaryBtn} disabled={isSubmitting}>
                    <Plus size={14} strokeWidth={3} />{' '}
                    {isSubmitting
                        ? (existingGroup ? 'Adding…' : 'Posting…')
                        : existingGroup
                            ? (totalShifts > 1 ? `Add ${totalShifts} classes` : 'Add to request')
                            : (totalShifts > 1 ? `Post request (${totalShifts} classes)` : 'Post request')}
                </button>
            </div>
        </ModalShell>
    );
}