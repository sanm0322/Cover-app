import { useState } from 'react';
import { X } from 'lucide-react';
import { styles } from '../lib/styles';
import { formatDay } from '../lib/helpers';
import ModalShell from './primitives/ModalShell';

/**
 * Confirmation modal for cancelling your own open shift(s).
 *
 * Props:
 *   shifts: array of open shifts posted by the current user
 *   onClose: () => void
 *   onConfirm: (shifts) => Promise<void>
 *   isSubmitting: boolean
 */
export default function ConfirmCancelModal({ shifts, onClose, onConfirm, isSubmitting }) {
    const isGroup = shifts.length > 1;
    const first = shifts[0];
    const [error, setError] = useState(null);

    const confirm = async () => {
        setError(null);
        try {
            await onConfirm(shifts);
        } catch (err) {
            setError(err.message || 'Could not cancel. Try again.');
        }
    };

    return (
        <ModalShell onClose={onClose} maxWidth={460}>
            <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>CANCEL REQUEST</h3>
                <button onClick={onClose} style={styles.closeBtn} disabled={isSubmitting}><X size={18} /></button>
            </div>
            <p style={styles.modalIntro}>
                {isGroup ? (
                    <>
                        Remove your coverage request for these <strong>{shifts.length}</strong> open classes?
                        Classes that have already been claimed by someone else won't be affected.
                    </>
                ) : (
                    <>
                        Remove your coverage request for <strong>{first.className}</strong> on{' '}
                        <strong>{formatDay(first.date)} · {first.time}</strong>? This can't be undone.
                    </>
                )}
            </p>
            {isGroup && (
                <div style={styles.confirmListBox}>
                    {shifts.map((s) => (
                        <div key={s.id} style={styles.confirmListRow}>
                            <span style={styles.confirmListWhen}>{formatDay(s.date)} · {s.time}</span>
                            <span style={styles.confirmListClass}>{s.className}</span>
                        </div>
                    ))}
                </div>
            )}
            {error && (
                <div style={{ background: '#fee', border: '1px solid #c03434', color: '#c03434', padding: 10, borderRadius: 4, fontSize: 13, marginTop: 12 }}>
                    {error}
                </div>
            )}
            <div style={styles.modalActions}>
                <button onClick={onClose} style={styles.secondaryBtn} disabled={isSubmitting}>Keep it</button>
                <button onClick={confirm} style={styles.dangerBtn} disabled={isSubmitting}>
                    <X size={14} />{' '}
                    {isSubmitting
                        ? 'Cancelling…'
                        : isGroup ? `Yes, cancel ${shifts.length}` : 'Yes, cancel'}
                </button>
            </div>
        </ModalShell>
    );
}