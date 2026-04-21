import { Dumbbell, LogOut, Info } from 'lucide-react';
import { styles } from '../lib/styles';
import Avatar from './primitives/Avatar';

/**
 * Top bar showing branding, signed-in coach, and logout button.
 *
 * Expects `coach` to be an object shaped like {id, name, initials, roles}.
 * Falls back gracefully if coach is null while loading.
 */
export default function TopBar({ coach, onLogout }) {
    const isManager = coach?.roles?.includes('manager');

    return (
        <>
            <header style={styles.topBar}>
                <div style={styles.topBarLeft}>
                    <div style={styles.logo}>
                        <Dumbbell size={22} strokeWidth={2.25} />
                    </div>
                    <div>
                        <div style={styles.brand}>COVER</div>
                        <div style={styles.brandSub}>SHIFT COVERAGE · CROSSFIT DOM CITY</div>
                    </div>
                </div>

                <div style={styles.topBarRight}>
                    {coach && (
                        <div style={styles.userChip}>
                            <Avatar coach={coach} size={32} />
                            <div style={{ ...styles.userChipText, fontFamily: 'Archivo, sans-serif' }}>
                                <div style={{ ...styles.userName, fontFamily: 'JetBrains Mono, monospace' }}>
                                    {coach.name}
                                </div>
                                <div style={{ ...styles.userRole, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em' }}>
                                    {isManager ? 'MANAGER' : 'COACH'}
                                </div>
                            </div>
                        </div>
                    )}
                    <button onClick={onLogout} style={styles.iconButton} title="Log out" aria-label="Log out">
                        <LogOut size={18} />
                    </button>
                </div>
            </header>
            <div style={styles.topBarAccent} />
        </>
    );
}