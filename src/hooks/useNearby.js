import { useState, useEffect } from 'react';
import { useFetch } from './useFetch';

export const  useNearby = (hid) => {




            const { data, error, loading } =  useFetch(`https://api.helium.io/v1/hotspots/${hid}`);

    useEffect(() => {

        async function fetchData() {

            if (data) {
                return {data, error, loading};

            }
            else {
                return {data: null, error: null, loading: false};
            }
        }

        fetchData();


    }
    , [data]);

    return true;
}



