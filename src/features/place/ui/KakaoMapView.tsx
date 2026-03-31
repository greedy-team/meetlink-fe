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
  allStartPoints?: LatLng[] | null;
};

export function KakaoMapView({
  center,
  level = 4,
  routeSegments = null,
  allStartPoints = null,
}: KakaoMapViewProps) {
  const isKakaoLoaded = useKakaoLoader();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const startOverlaysRef = useRef<KakaoCustomOverlay[]>([]);
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

  // 3) 경로 및 다중 출발지 핀 렌더링 로직
  useEffect(() => {
    if (!isMapLoaded || !isKakaoLoaded) return;

    const kakao = window.kakao;
    const map = mapRef.current;
    if (!kakao || !map) return;

    const endPos = new kakao.maps.LatLng(center.lat, center.lng);
    const bounds = new kakao.maps.LatLngBounds();
    bounds.extend(endPos); // 기본적으로 도착지는 바운더리에 포함

    const createPinElement = (type: 'start' | 'end') => {
      const wrapper = document.createElement('div');
      const root = createRoot(wrapper);
      root.render(<CenterPin type={type} isFixed={false} />);
      return wrapper;
    };

    // 기존 렌더링된 요소들 초기화 (경로 및 모든 시작 핀 지우기)
    polylinesRef.current.forEach((line) => line.setMap(null));
    polylinesRef.current = [];
    startOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    startOverlaysRef.current = [];

    // 도착지 핀 업데이트 (1개 고정)
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

    // 1) 특정 멤버가 선택되어 단일 경로가 있을 때
    if (routeSegments && routeSegments.length > 0) {
      let firstPos: KakaoLatLng | null = null;

      routeSegments.forEach((seg) => {
        if (seg.path.length === 0) return;

        const pathLatLng = seg.path.map((p) => {
          const pos = new kakao.maps.LatLng(p.lat, p.lng);
          bounds.extend(pos); // 경로도 바운더리에 포함
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

      // 단일 시작 핀 추가
      if (firstPos) {
        const startOverlay = new kakao.maps.CustomOverlay({
          position: firstPos,
          content: createPinElement('start'),
          yAnchor: 1,
        });
        startOverlay.setMap(map);
        startOverlaysRef.current.push(startOverlay);
      }
      map.setBounds(bounds, 120, 50, 250, 50);
    }
    // 2) 아무도 선택되지 않아서 모든 출발지를 보여줘야 할 때
    else if (allStartPoints && allStartPoints.length > 0) {
      allStartPoints.forEach((p) => {
        const pos = new kakao.maps.LatLng(p.lat, p.lng);
        bounds.extend(pos); // 모든 출발지를 바운더리에 포함하여 줌 레벨 자동 조정

        const startOverlay = new kakao.maps.CustomOverlay({
          position: pos,
          content: createPinElement('start'),
          yAnchor: 1,
        });
        startOverlay.setMap(map);
        startOverlaysRef.current.push(startOverlay);
      });
      map.setBounds(bounds, 120, 50, 250, 50);
    }
    // 3) 아무 데이터도 없을 때 (도착지만 중앙에 표시)
    else {
      map.setCenter(endPos);
    }
  }, [routeSegments, allStartPoints, center.lat, center.lng, isMapLoaded, isKakaoLoaded]);

  return <div ref={containerRef} className="h-full w-full bg-gray-100" />;
}
