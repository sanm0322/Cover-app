import { styles } from '../../lib/styles';

// A titled section with an item count and children (typically shift cards)
export default function Section({ title, count, icon, children }) {
    return (
        <section style={{ marginBottom: 32 }}>
            <div style={styles.sectionHeader}>
                <div style={styles.sectionTitleWrap}>
                    {icon}
                    <h2 style={styles.sectionTitle}>{title}</h2>
                </div>
                <div style={styles.sectionCount}>{count}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {children}
            </div>
        </section>
    );
}