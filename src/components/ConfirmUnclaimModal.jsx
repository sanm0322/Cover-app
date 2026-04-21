import { useState } from 'react';
import { X } from 'lucide-react';
import { styles } from '../lib/styles';
import { formatDay } from '../lib/helpers';
import ModalShell from './primitives/ModalShell';

/**
 * Confirmation modal for releasing one or more shifts you previously claimed.
 * Shift will return to status='open' and be claimable by anyone.
 *
 * Props:
 *   shifts: array of shifts the user currently covers (from a single group)
 *   onClose: () => void
 *   onConfirm: (shifts) => Promise<void>
 *   coachById: lookup function (for showing the poster's name)
 *   isSubmitting: boolean
 */
export default function ConfirmUnclaimModal({ shifts, onClose, onConfirm, coachById, isSubmitting }) {
    const isGroup = shifts.length > 1;
    const first = shifts[0];
    const poster = coachById(first.postedBy) || { name: 'the original poster' };
    const [error, setError] = useState(null);

    const confirm = async () => {
        setError(null);
        try {
            await onConfirm(shifts);
        } catch (err) {
            setError(err.message || 'Could not release. Try again.');
        }
    };

    return (
        <ModalShell onClose={onClose} maxWidth={460}>
            <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>RELEASE COVERAGE</h3>
                <button onClick={onClose} style={styles.closeBtn} disabled={isSubmitting}><X size={18} /></button>
            </div>
            <p style={styles.modalIntro}>
                {isGroup ? (
                    <>
                        Release your coverage for these <strong>{shifts.length}</strong> classes?
                        They'll go back to <strong>{poster.name}</strong>'s open request
                        and anyone in the team can pick them up.
                    </>
                ) : (
                    <>
                        Release your coverage for <strong>{first.className}</strong> on{' '}
                        <strong>{formatDay(first.date)} · {first.time}</strong>?
                        It'll go back to <strong>{poster.name}</strong>'s open request.
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
                <button onClick={onClose} style={styles.secondaryBtn} disabled={isSubmitting}>
                    Keep it
                </button>
                <button onClick={confirm} style={styles.dangerBtn} disabled={isSubmitting}>
                    <X size={14} />{' '}
                    {isSubmitting
                        ? 'Releasing…'
                        : isGroup ? `Yes, release ${shifts.length}` : 'Yes, release'}
                </button>
            </div>
        </ModalShell>
    );
}