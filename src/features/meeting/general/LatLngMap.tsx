import { useEffect, useRef, useState } from 'react';

import { useKakaoLoader } from '@/hooks/useKakaoLoader';

type LatLngMapProps = {
  lat: number;
  lng: number;
  level?: number;
  className?: string;
  onCenterChange?: (nextLat: number, nextLng: number) => void;
  isInteractive?: boolean;
};

export function LatLngMap({
  lat,
  lng,
  level = 4,
  className,
  onCenterChange,
  isInteractive = true,
}: LatLngMapProps) {
  const isKakaoLoaded = useKakaoLoader();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const programmaticMoveRef = useRef(false);

  const onCenterChangeRef = useRef(onCenterChange);
  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  }, [onCenterChange]);

  // 지도 최초 생성 로직
  useEffect(() => {
    // 스크립트가 로드되지 않았거나 컨테이너가 없으면 실행 중단
    if (!isKakaoLoaded || !containerRef.current) return;

    const kakao = window.kakao;
    if (!kakao) return;

    const center = new kakao.maps.LatLng(lat, lng);
    const map = new kakao.maps.Map(containerRef.current, { center, level });

    if (!isInteractive) {
      map.setDraggable(false);
      map.setZoomable(false);
    }

    mapRef.current = map;

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKakaoLoaded]); // 의존성 배열에 로드 상태 추가

  // 좌표 변경 시 지도 중심 이동
  useEffect(() => {
    if (!isMapLoaded || !isKakaoLoaded) return; // 로드 상태 체크 추가

    const kakao = window.kakao;
    const map = mapRef.current;

    if (!kakao?.maps || !map) return;

    const next = new kakao.maps.LatLng(lat, lng);

    programmaticMoveRef.current = true;
    map.setCenter(next);
  }, [lat, lng, isMapLoaded, isKakaoLoaded]);

  return (
    <div
      ref={containerRef}
      className={className ?? 'h-full w-full overflow-hidden rounded-2xl bg-gray-100'} // ✨ 6. 로딩 중 배경색 추가
    />
  );
}
