import { useMemo } from 'react';

/**
 * Given an array of coach objects (from Supabase), returns a function
 * that looks up a coach by id. Returns undefined if the coach isn't
 * in the list — call sites should handle this gracefully (e.g. show
 * "Unknown coach" instead of crashing).
 */
export function useCoachLookup(allCoaches) {
    return useMemo(() => {
        const map = new Map(allCoaches.map((c) => [c.id, c]));
        return (id) => map.get(id);
    }, [allCoaches]);
}