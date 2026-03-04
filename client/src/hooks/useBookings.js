import { useCallback } from 'react';
import useAsyncState from './useAsyncState';

const useBookings = () => {
    const { data, loading, error, run } = useAsyncState(null);

    const refetch = useCallback(async (fetcher) => {
        try {
            return await run(fetcher);
        } catch (_) {
            return null;
        }
    }, [run]);

    return { data, loading, error, refetch };
};

export default useBookings;
