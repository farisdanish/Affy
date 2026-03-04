import { useCallback, useEffect } from 'react';
import useAsyncState from './useAsyncState';

const useSlots = (fetcher, { auto = true, initialData = [] } = {}) => {
    const { data, loading, error, setError, run } = useAsyncState(initialData);

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

    return { data, loading, error, refetch, setError };
};

export default useSlots;
