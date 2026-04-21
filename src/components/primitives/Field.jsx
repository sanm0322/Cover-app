import { styles } from '../../lib/styles';

/**
 * A labeled form field. Children is the actual input/textarea/select.
 */
export default function Field({ label, children }) {
    return (
        <label style={styles.field}>
            <span style={styles.fieldLabel}>{label}</span>
            {children}
        </label>
    );
}