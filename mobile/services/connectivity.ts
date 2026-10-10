import { useEffect, useState } from 'react';
import { API_URL } from '../constants/config';

function healthUrl() {
  return API_URL.replace(/\/api\/?$/, '') + '/health';
}

export async function isApiReachable() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(healthUrl(), { method: 'GET', signal: controller.signal });
    clearTimeout(timer);
    return response.ok;
  } catch {
    return false;
  }
}

export function useOnlineStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let active = true;

    async function check() {
      const reachable = await isApiReachable();
      if (active) setOnline(reachable);
    }

    void check();
    const timer = setInterval(() => void check(), 20000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return online;
}
