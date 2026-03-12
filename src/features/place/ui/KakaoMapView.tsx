import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { useKakaoLoader } from '@/hooks/useKakaoLoader';

import { CenterPin } from '@/features/place/confirm/CenterPin';
import { type PathSegment } from '@/types/meetingTypes';

type LatLng = { lat: number; lng: number };

type KakaoMapViewProps = {
  center: LatLng;
  level?: number;
  routeSegments?: PathSegment[] | null;
};

export function KakaoMapView({ center, level = 4, routeSegments = null }: KakaoMapViewProps) {
  const isKakaoLoaded = useKakaoLoader();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const startOverlayRef = useRef<KakaoCustomOverlay | null>(null);
  const endOverlayRef = useRef<KakaoCustomOverlay | null>(null);

  const polylinesRef = useRef<KakaoPolyline[]>([]);

  // 1) 지도 최초 1회 생성
  useEffect(() => {
    // 로드 상태 및 컨테이너 체크
    if (!isKakaoLoaded || !containerRef.current) return;

    const kakao = window.kakao;
    if (!kakao) return;

    const initialPos = new kakao.maps.LatLng(center.lat, center.lng);
    const map = new kakao.maps.Map(containerRef.current, { center: initialPos, level });
    mapRef.current = map;

    requestAnimationFrame(() => {
      map.relayout?.();
      map.setCenter(initialPos);
      setIsMapLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKakaoLoaded]);

  // 2) 장소 변경 시 반영
  useEffect(() => {
    if (!isMapLoaded || !isKakaoLoaded) return; // 로드 상태 체크 추가

    const kakao = window.kakao;
    const map = mapRef.current;
    if (!kakao || !map) return;

    const next = new kakao.maps.LatLng(center.lat, center.lng);
    map.setCenter(next);
    map.setLevel?.(level);
  }, [center.lat, center.lng, level, isMapLoaded, isKakaoLoaded]);

  // 3) 경로 렌더링 로직
  useEffect(() => {
    if (!isMapLoaded || !isKakaoLoaded) return;

    const kakao = window.kakao;
    const map = mapRef.current;
    if (!kakao || !map) return;

    const endPos = new kakao.maps.LatLng(center.lat, center.lng);

    const createPinElement = (type: 'start' | 'end') => {
      const wrapper = document.createElement('div');
      const root = createRoot(wrapper);
      root.render(<CenterPin type={type} isFixed={false} />);
      return wrapper;
    };

    polylinesRef.current.forEach((line) => line.setMap(null));
    polylinesRef.current = [];

    if (!routeSegments || routeSegments.length === 0) {
      startOverlayRef.current?.setMap(null);

      if (!endOverlayRef.current) {
        endOverlayRef.current = new kakao.maps.CustomOverlay({
          position: endPos,
          content: createPinElement('end'),
          yAnchor: 1,
        });
        endOverlayRef.current.setMap(map);
      } else {
        endOverlayRef.current.setContent(createPinElement('end'));
        endOverlayRef.current.setPosition(endPos);
      }
      map.setCenter(endPos);
      return;
    }

    const bounds = new kakao.maps.LatLngBounds();
    let firstPos: KakaoLatLng | null = null;

    routeSegments.forEach((seg) => {
      if (seg.path.length === 0) return;

      const pathLatLng = seg.path.map((p) => {
        const pos = new kakao.maps.LatLng(p.lat, p.lng);
        bounds.extend(pos);
        if (!firstPos) firstPos = pos;
        return pos;
      });

      const polyline = new kakao.maps.Polyline({
        path: pathLatLng,
        strokeWeight: seg.mode === 'WALK' ? 8 : 6,
        strokeColor: '#008e4c',
        strokeOpacity: 0.9,
        strokeStyle: seg.mode === 'WALK' ? 'shortdot' : 'solid',
      });
      polyline.setMap(map);
      polylinesRef.current.push(polyline);
    });

    bounds.extend(endPos);

    if (firstPos) {
      if (!startOverlayRef.current) {
        startOverlayRef.current = new kakao.maps.CustomOverlay({
          position: firstPos,
          content: createPinElement('start'),
          yAnchor: 1,
        });
      } else {
        startOverlayRef.current.setContent(createPinElement('start'));
        startOverlayRef.current.setPosition(firstPos);
      }
      startOverlayRef.current.setMap(map);
    }

    if (!endOverlayRef.current) {
      endOverlayRef.current = new kakao.maps.CustomOverlay({
        position: endPos,
        content: createPinElement('end'),
        yAnchor: 1,
      });
    } else {
      endOverlayRef.current.setContent(createPinElement('end'));
      endOverlayRef.current.setPosition(endPos);
    }
    endOverlayRef.current.setMap(map);
    map.setBounds(bounds);
  }, [routeSegments, center.lat, center.lng, isMapLoaded, isKakaoLoaded]);

  return <div ref={containerRef} className="h-full w-full bg-gray-100" />;
}
