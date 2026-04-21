import { styles } from '../../lib/styles';

export default function EmptyState({ message }) {
    return (
        <div style={styles.emptyState}>
            <div style={styles.emptyDash} />
            <span>{message}</span>
        </div>
    );
}