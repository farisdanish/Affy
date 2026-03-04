import { useCallback, useEffect } from 'react';
import useAsyncState from './useAsyncState';

const useReferrals = (fetcher, { auto = true, initialData = null } = {}) => {
    const { data, loading, error, run } = useAsyncState(initialData);

    const refetch = useCallback(async () => {
        try {
            return await run(fetcher);
        } catch (_) {
            return null;
        }
    }, [run, fetcher]);

    useEffect(() => {
        if (auto) {
            refetch();
        }
    }, [auto, refetch]);

    return { data, loading, error, refetch };
};

export default useReferrals;
