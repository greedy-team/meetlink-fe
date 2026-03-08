import { useEffect, useRef, useState } from 'react';

type LatLngMapProps = {
  lat: number;
  lng: number;
  level?: number;
  className?: string;
  onCenterChange?: (nextLat: number, nextLng: number) => void;
};

export function LatLngMap({ lat, lng, level = 4, className, onCenterChange }: LatLngMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<KakaoMap | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const programmaticMoveRef = useRef(false);

  const onCenterChangeRef = useRef(onCenterChange);
  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  }, [onCenterChange]);

  useEffect(() => {
    const kakao = window.kakao;
    if (!kakao?.maps?.load) return;

    kakao.maps.load(() => {
      if (!containerRef.current) return;

      const center = new kakao.maps.LatLng(lat, lng);
      const map = new kakao.maps.Map(containerRef.current, { center, level });

      mapRef.current = map;

      // 이벤트 리스너 등록
      if (kakao.maps.event) {
        kakao.maps.event.addListener(map, 'center_changed', () => {
          if (programmaticMoveRef.current) {
            programmaticMoveRef.current = false;
            return;
          }

          const c = map.getCenter();
          if (onCenterChangeRef.current) {
            onCenterChangeRef.current(c.getLat(), c.getLng());
          }
        });
      }

      requestAnimationFrame(() => {
        map.relayout?.();
        map.setCenter(center);
        setIsMapLoaded(true);
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isMapLoaded) return;

    const kakao = window.kakao;
    const map = mapRef.current;

    if (!kakao?.maps || !map) return;

    const next = new kakao.maps.LatLng(lat, lng);

    programmaticMoveRef.current = true;
    map.setCenter(next);
  }, [lat, lng, isMapLoaded]);

  return (
    <div ref={containerRef} className={className ?? 'h-full w-full overflow-hidden rounded-2xl'} />
  );
}
