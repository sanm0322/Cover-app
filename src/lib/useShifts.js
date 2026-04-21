import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

/**
 * React hook that returns all shifts from the Supabase `shifts` table.
 *
 * Returns { shifts, loading, error, refetch }.
 * - `shifts` is an array, empty while loading
 * - `loading` is true during the initial fetch
 * - `error` is an error message string or null
 * - `refetch()` manually re-runs the query
 *
 * Shape of each shift is normalised from Supabase's snake_case to
 * camelCase so the rest of the app reads cleanly. Keep an eye on this
 * mapping if you ever add columns to the schema.
 */
export function useShifts() {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchShifts = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('shifts')
            .select('id, group_id, posted_by, date, time, class_name, reason, status, claimed_by, claimed_at, created_at')
            .order('date', { ascending: true })
            .order('time', { ascending: true });
        if (error) {
            setError(error.message);
            setShifts([]);
        } else {
            setShifts((data || [])
                .filter((s) => s.status !== 'cancelled')   // ← new
                .map((s) => ({
                    id: s.id,
                    groupId: s.group_id,
                    postedBy: s.posted_by,
                    date: s.date,
                    time: s.time.slice(0, 5),  // Postgres 'time' returns 'HH:MM:SS' — strip seconds
                    className: s.class_name,
                    reason: s.reason,
                    status: s.status,
                    claimedBy: s.claimed_by,
                    claimedAt: s.claimed_at,
                    createdAt: s.created_at,
                })));
            setError(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchShifts();
    }, [fetchShifts]);

    return { shifts, loading, error, refetch: fetchShifts };
}