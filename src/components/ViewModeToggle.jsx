import { Inbox, Calendar } from 'lucide-react';
import { styles } from '../lib/styles';

/**
 * Tab-like toggle between the list view and the calendar view.
 *
 * Props:
 *   mode: 'list' | 'calendar'
 *   onChange: (newMode) => void
 */
export default function ViewModeToggle({ mode, onChange }) {
    return (
        <div style={styles.viewModeToggle}>
            <button
                onClick={() => onChange('list')}
                style={{
                    ...styles.viewModeBtn,
                    ...(mode === 'list' ? styles.viewModeBtnActive : {}),
                }}
            >
                <Inbox size={13} /> List
            </button>
            <button
                onClick={() => onChange('calendar')}
                style={{
                    ...styles.viewModeBtn,
                    ...(mode === 'calendar' ? styles.viewModeBtnActive : {}),
                }}
            >
                <Calendar size={13} /> Calendar
            </button>
        </div>
    );
}