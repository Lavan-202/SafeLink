import { useEffect, useRef, useState } from 'react';

export function useCountdown(seconds: number, onComplete: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (remaining <= 0) {
      onCompleteRef.current();
      return;
    }

    const timer = setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  return remaining;
}
