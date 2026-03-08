// src/hooks/use-input-type.ts
import { useEffect, useState } from 'react';

export function useInputType() {
  const [isMouse, setIsMouse] = useState(
    () => matchMedia('(hover: hover) and (pointer: fine)').matches, // 최초 1회만 실행
  );

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setIsMouse(event.matches);
    }

    const result = matchMedia('(hover: hover) and (pointer: fine)');
    result.addEventListener('change', onChange);
    return () => result.removeEventListener('change', onChange);
  }, []);

  return isMouse ? 'mouse' : 'touch';
}
