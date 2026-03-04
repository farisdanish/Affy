import { useCallback, useState } from 'react';

const useAsyncState = (initialData = null) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const run = useCallback(async (asyncFn) => {
        setLoading(true);
        setError(null);
        try {
            const result = await asyncFn();
            setData(result);
            return result;
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Request failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, setData, setLoading, setError, run };
};

export default useAsyncState;
