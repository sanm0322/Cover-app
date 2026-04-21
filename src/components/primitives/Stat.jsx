import { styles } from '../../lib/styles';

// Big number with a small label — used on the dashboard counts row
export default function Stat({ label, value, accent = 'ink' }) {
    const accentColors = {
        red: '#c03434',
        green: '#1d6b48',
        ink: '#141414',
    };
    return (
        <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: accentColors[accent] }}>{value}</div>
            <div style={styles.statLabel}>{label}</div>
        </div>
    );
}