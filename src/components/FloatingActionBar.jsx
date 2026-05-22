import { MessageCircle, X } from 'lucide-react';
import { styles } from '../lib/styles';
import { buildShareMessage } from '../lib/helpers';

const APP_URL = 'https://sanm0322.github.io/cover-app/';

/**
 * Floating action bar that appears when one or more shifts are selected.
 * Provides "Clear" and "Share to WhatsApp" actions.
 *
 * Props:
 *   selectedShifts: array of shift objects (already filtered to currently selected)
 *   coachById: lookup function for poster names
 *   onClear: callback to clear the selection
 */
export default function FloatingActionBar({ selectedShifts, coachById, onClear }) {
    if (selectedShifts.length === 0) return null;

    const handleShare = () => {
        const message = buildShareMessage(selectedShifts, coachById, APP_URL);
        const encoded = encodeURIComponent(message);
        const url = `https://wa.me/?text=${encoded}`;
        window.open(url, '_blank');
    };

    // Pluralize for readability
    const countLabel = selectedShifts.length === 1
        ? '1 shift selected'
        : `${selectedShifts.length} shifts selected`;

    return (
        <div style={styles.floatingActionBar}>
            <span style={styles.floatingActionCount}>{countLabel}</span>
            <button onClick={onClear} style={styles.floatingActionClear}>
                <X size={12} /> Clear
            </button>
            <button onClick={handleShare} style={styles.floatingActionShare}>
                <MessageCircle size={14} /> Share to WhatsApp
            </button>
        </div>
    );
}