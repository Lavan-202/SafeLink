import { useEffect, useRef } from 'react';
import { getCurrentCoordinates } from '../services/locationService';
import type { Coordinates } from '../types';

export function useLiveLocation(enabled: boolean, intervalSec: number, onPoint: (point: Coordinates) => void) {
  const onPointRef = useRef(onPoint);
  onPointRef.current = onPoint;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const tick = async () => {
      try {
        const point = await getCurrentCoordinates();
        if (!cancelled) onPointRef.current(point);
      } catch {
        // The screen that started sharing shows location errors.
      }
    };

    void tick();
    const timer = setInterval(tick, Math.max(intervalSec, 5) * 1000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [enabled, intervalSec]);
}
