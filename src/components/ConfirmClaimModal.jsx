import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { styles } from '../lib/styles';
import { formatDay } from '../lib/helpers';
import ModalShell from './primitives/ModalShell';

/**
 * Confirmation modal for claiming one or more shifts from a group.
 *
 * If only one shift is in `shifts`, it's a simple yes/no.
 * If multiple, the user can tick which subset they're taking.
 *
 * Props:
 *   shifts: array of open shifts from the same group
 *   onClose: () => void
 *   onConfirm: (selectedShifts) => Promise<void>
 *   coachById: lookup function (for displaying the original poster's name)
 *   isSubmitting: boolean
 */
export default function ConfirmClaimModal({ shifts, onClose, onConfirm, coachById, isSubmitting }) {
    const sortedShifts = [...shifts].sort(
        (a, b) => (a.date + a.time).localeCompare(b.date + b.time)
    );
    const isGroup = sortedShifts.length > 1;
    const poster = coachById(sortedShifts[0].postedBy)
        || { name: 'another coach' };

    const [selected, setSelected] = useState(() => new Set(sortedShifts.map((s) => s.id)));
    const [error, setError] = useState(null);

    const toggle = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };
    const selectAll = () => setSelected(new Set(sortedShifts.map((s) => s.id)));
    const selectNone = () => setSelected(new Set());

    const selectedShifts = sortedShifts.filter((s) => selected.has(s.id));
    const canConfirm = selectedShifts.length > 0;

    const confirm = async () => {
        setError(null);
        try {
            await onConfirm(selectedShifts);
        } catch (err) {
            setError(err.message || 'Could not claim shift(s). It may have been claimed by someone else.');
        }
    };

    // Single-shift version: simpler confirmation
    if (!isGroup) {
        const shift = sortedShifts[0];
        return (
            <ModalShell onClose={onClose} maxWidth={460}>
                <div style={styles.modalHeader}>
                    <h3 style={styles.modalTitle}>CONFIRM COVERAGE</h3>
                    <button onClick={onClose} style={styles.closeBtn} disabled={isSubmitting}><X size={18} /></button>
                </div>
                <p style={styles.modalIntro}>
                    You're about to take over this class.
                </p>
                <div style={styles.confirmBox}>
                    <div style={styles.confirmRow}><span>CLASS</span><strong>{shift.className}</strong></div>
                    <div style={styles.confirmRow}><span>WHEN</span><strong>{formatDay(shift.date)} · {shift.time}</strong></div>
                    <div style={styles.confirmRow}><span>ORIGINAL</span><strong>{poster.name}</strong></div>
                </div>
                {error && (
                    <div style={{ background: '#fee', border: '1px solid #c03434', color: '#c03434', padding: 10, borderRadius: 4, fontSize: 13, marginTop: 12 }}>
                        {error}
                    </div>
                )}
                <div style={styles.modalActions}>
                    <button onClick={onClose} style={styles.secondaryBtn} disabled={isSubmitting}>Back</button>
                    <button onClick={confirm} style={styles.primaryBtn} disabled={isSubmitting}>
                        <Check size={14} strokeWidth={3} />{' '}
                        {isSubmitting ? 'Claiming…' : "Yes, I'll cover it"}
                    </button>
                </div>
            </ModalShell>
        );
    }

    // Multi-select version
    return (
        <ModalShell onClose={onClose} maxWidth={540}>
            <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>PICK CLASSES TO COVER</h3>
                <button onClick={onClose} style={styles.closeBtn} disabled={isSubmitting}><X size={18} /></button>
            </div>
            <p style={styles.modalIntro}>
                <strong>{poster.name}</strong> posted {sortedShifts.length} open classes as one request.
                Tick the ones you can cover — all, some, or just one.
            </p>

            <div style={styles.claimSelectToolbar}>
                <span style={styles.claimSelectCount}>
                    {selectedShifts.length} of {sortedShifts.length} selected
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={selectAll} style={styles.smallBtn} disabled={isSubmitting}>All</button>
                    <button onClick={selectNone} style={styles.smallBtn} disabled={isSubmitting}>None</button>
                </div>
            </div>

            <div style={styles.claimSelectList}>
                {sortedShifts.map((s) => {
                    const isOn = selected.has(s.id);
                    return (
                        <button
                            key={s.id}
                            onClick={() => toggle(s.id)}
                            style={{
                                ...styles.claimSelectRow,
                                ...(isOn ? styles.claimSelectRowActive : {}),
                            }}
                            disabled={isSubmitting}
                        >
                            <span style={styles.claimSelectBox}>
                                {isOn && <Check size={12} strokeWidth={4} />}
                            </span>
                            <span style={styles.claimSelectWhen}>
                                {formatDay(s.date)} · {s.time}
                            </span>
                            <span style={styles.claimSelectClass}>{s.className}</span>
                        </button>
                    );
                })}
            </div>

            {error && (
                <div style={{ background: '#fee', border: '1px solid #c03434', color: '#c03434', padding: 10, borderRadius: 4, fontSize: 13, marginTop: 12 }}>
                    {error}
                </div>
            )}

            <div style={styles.modalActions}>
                <button onClick={onClose} style={styles.secondaryBtn} disabled={isSubmitting}>Back</button>
                <button
                    onClick={confirm}
                    style={{ ...styles.primaryBtn, opacity: canConfirm && !isSubmitting ? 1 : 0.5 }}
                    disabled={!canConfirm || isSubmitting}
                >
                    <Check size={14} strokeWidth={3} />{' '}
                    {isSubmitting
                        ? 'Claiming…'
                        : selectedShifts.length === sortedShifts.length
                            ? `Cover all ${sortedShifts.length}`
                            : `Cover ${selectedShifts.length} of ${sortedShifts.length}`}
                </button>
            </div>
        </ModalShell>
    );
}