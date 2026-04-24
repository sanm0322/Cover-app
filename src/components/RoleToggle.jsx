import { User, Shield } from 'lucide-react';
import { styles } from '../lib/styles';

/**
 * Tab toggle for dual-role users (coach + manager) to switch between
 * their two dashboards. Shown only when the current coach has the
 * 'manager' role.
 *
 * Props:
 *   role: 'coach' | 'manager'
 *   onChange: (newRole) => void
 */
export default function RoleToggle({ role, onChange }) {
    return (
        <div style={styles.viewModeToggle}>
            <button
                onClick={() => onChange('coach')}
                style={{
                    ...styles.viewModeBtn,
                    ...(role === 'coach' ? styles.viewModeBtnActive : {}),
                }}
            >
                <User size={13} /> My dashboard
            </button>
            <button
                onClick={() => onChange('manager')}
                style={{
                    ...styles.viewModeBtn,
                    ...(role === 'manager' ? styles.viewModeBtnActive : {}),
                }}
            >
                <Shield size={13} /> Manager view
            </button>
        </div>
    );
}