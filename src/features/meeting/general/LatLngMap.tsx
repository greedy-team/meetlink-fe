import { useEffect, useRef } from 'react';

type LatLngMapProps = {
  lat: number;
  lng: number;
  level?: number;
  className?: string;
  onCenterChange?: (nextLat: number, nextLng: number) => void;
  showMarker?: boolean;
};

export function LatLngMap({
  lat,
  lng,
  level = 4,
  className,
  onCenterChange,
  showMarker = true,
}: LatLngMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // d.ts에 선언한 커스텀 타입 사용
  const mapRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);

  // programmatic setCenter로 발생하는 idle은 무시
  const programmaticMoveRef = useRef(false);

  useEffect(() => {
    const kakao = window.kakao;
    if (!kakao?.maps?.load) return;

    kakao.maps.load(() => {
      if (!containerRef.current) return;

      const center = new kakao.maps.LatLng(lat, lng);
      const map = new kakao.maps.Map(containerRef.current, { center, level });

      let marker: KakaoMarker | null = null;
      if (showMarker) {
        marker = new kakao.maps.Marker({ position: center });
        marker.setMap(map);
      }

      mapRef.current = map;
      markerRef.current = marker;

      if (onCenterChange) {
        kakao.maps.event.addListener(map, 'center_changed', () => {
          if (programmaticMoveRef.current) {
            programmaticMoveRef.current = false;
            return;
          }
          const c = map.getCenter();
          onCenterChange(c.getLat(), c.getLng());
        });
      }

      requestAnimationFrame(() => {
        map.relayout?.();
        map.setCenter(center);
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const kakao = window.kakao;
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!kakao?.maps || !map) return;

    const next = new kakao.maps.LatLng(lat, lng);

    programmaticMoveRef.current = true;
    map.setCenter(next);

    if (marker) marker.setPosition(next);
  }, [lat, lng]);

  return (
    <div ref={containerRef} className={className ?? 'h-full w-full overflow-hidden rounded-2xl'} />
  );
}
