import { useEffect, useRef } from 'react';

type LatLngMapProps = {
  lat: number;
  lng: number;
  level?: number;
  className?: string;
};

type KakaoLatLng = unknown;
type KakaoMap = {
  setCenter(pos: KakaoLatLng): void;
  relayout?(): void;
};
type KakaoMarker = {
  setMap(map: unknown | null): void;
  setPosition(pos: KakaoLatLng): void;
};

export function LatLngMap({ lat, lng, level = 4, className }: LatLngMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);

  useEffect(() => {
    const kakao = window.kakao;
    if (!kakao?.maps?.load) return;

    kakao.maps.load(() => {
      if (!containerRef.current) return;

      const center = new kakao.maps.LatLng(lat, lng);
      const map = new kakao.maps.Map(containerRef.current, { center, level });

      const marker = new kakao.maps.Marker({ position: center });
      marker.setMap(map);

      mapRef.current = map;
      markerRef.current = marker;

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
    if (!kakao?.maps || !map || !marker) return;

    const next = new kakao.maps.LatLng(lat, lng);
    marker.setPosition(next);
    map.setCenter(next);
  }, [lat, lng]);

  return (
    <div ref={containerRef} className={className ?? 'h-60 w-full overflow-hidden rounded-2xl'} />
  );
}
