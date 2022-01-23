import { useState, useEffect } from 'react';

export const  useFetch = (url, options) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch(url, options)
            .then(res => res.json())
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }
    , [url, options]);

    return { data, loading, error };
}



