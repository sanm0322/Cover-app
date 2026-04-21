// Circular colored initials badge. Deterministic color based on coach id.
export default function Avatar({ coach, size = 32 }) {
    const colors = ['#b23a3a', '#1f5e3f', '#2a4a7f', '#7a4b1f', '#5a3470', '#3a3a3a'];
    // Hash any string id (uuid or legacy 'c1') to a stable index
    const idx = (coach.id || '').split('').reduce(
        (a, ch) => a + ch.charCodeAt(0), 0
    ) % colors.length;
    return (
        <div
            style={{
                width: size, height: size, borderRadius: '50%',
                background: colors[idx], color: '#f3efe6',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Archivo, sans-serif', fontWeight: 700,
                fontSize: size * 0.38, letterSpacing: '0.04em',
                flexShrink: 0,
            }}
        >
            {coach.initials}
        </div>
    );
}