import { useSession } from '../useSession';
import Login from './Login';

/**
 * Wraps the app in an auth check. Shows Login if not authenticated,
 * otherwise renders children.
 */
export default function AuthGate({ children }) {
  const session = useSession();

  // Still loading the initial session check — show nothing for a moment
  if (session === null) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#ece7da',
        fontFamily: 'Archivo, sans-serif',
        color: '#87837b', fontSize: 12, letterSpacing: '0.2em',
      }}>
        LOADING…
      </div>
    );
  }

  // Not logged in — show the login screen
  if (session === false) {
    return <Login />;
  }

  // Logged in — render the app
  return children;
}
