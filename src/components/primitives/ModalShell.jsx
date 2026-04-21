import { styles } from '../../lib/styles';

// Dark overlay + white card for any modal. Click outside to close.
export default function ModalShell({ children, onClose, maxWidth = 520 }) {
    return (
        <div style={styles.overlay} onClick={onClose}>
            <div
                style={{ ...styles.modal, maxWidth }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}