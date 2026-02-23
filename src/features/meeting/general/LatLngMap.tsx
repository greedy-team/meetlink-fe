import { useEffect, useRef, useState } from 'react';

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

  const mapRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);

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

      let marker: KakaoMarker | null = null;
      if (showMarker) {
        marker = new kakao.maps.Marker({ position: center });
        marker.setMap(map);
      }

      mapRef.current = map;
      markerRef.current = marker;

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
    const marker = markerRef.current;

    if (!kakao?.maps || !map) return;

    const next = new kakao.maps.LatLng(lat, lng);

    programmaticMoveRef.current = true;
    map.setCenter(next);

    if (marker) {
      marker.setPosition(next);
    }
  }, [lat, lng, isMapLoaded]);

  return (
    <div ref={containerRef} className={className ?? 'h-full w-full overflow-hidden rounded-2xl'} />
  );
}
