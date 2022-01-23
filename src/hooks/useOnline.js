import {   useState } from 'react';
import useEventListener from './useEventListener';
export const useOnline = () => {
    const [online, setOnline] = useState(navigator.onLine);

useEventListener("online", () => setOnline(navigator.onLine))
  useEventListener("offline", () => setOnline(navigator.onLine))

    return online;

}

