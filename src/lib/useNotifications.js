import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Returns the most recent notifications (default: 50). Used by the
 * manager's activity log.
 *
 * Returns { notifications, loading, error, refetch }.
 */
export function useNotifications(limit = 50) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifs = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('notifications')
            .select('id, type, group_id, shift_ids, actor_id, created_at')
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) {
            setError(error.message);
            setNotifications([]);
        } else {
            setNotifications((data || []).map((n) => ({
                id: n.id,
                type: n.type,
                groupId: n.group_id,
                shiftIds: n.shift_ids || [],
                actorId: n.actor_id,
                at: n.created_at,
            })));
            setError(null);
        }
        setLoading(false);
    }, [limit]);

    useEffect(() => {
        fetchNotifs();
    }, [fetchNotifs]);

    return { notifications, loading, error, refetch: fetchNotifs };
}