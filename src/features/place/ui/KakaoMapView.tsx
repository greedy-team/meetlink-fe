import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { CenterPin } from '@/features/place/confirm/CenterPin';
import { type PathSegment } from '@/types/meetingTypes';

type LatLng = { lat: number; lng: number };

type KakaoMapViewProps = {
  center: LatLng;
  level?: number;
  routeSegments?: PathSegment[] | null;
};

export function KakaoMapView({ center, level = 4, routeSegments = null }: KakaoMapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const startOverlayRef = useRef<KakaoCustomOverlay | null>(null);
  const endOverlayRef = useRef<KakaoCustomOverlay | null>(null);

  const polylinesRef = useRef<KakaoPolyline[]>([]);

  // 1) 지도 최초 1회 생성 + relayout
  useEffect(() => {
    const kakao = window.kakao;
    if (!kakao?.maps?.load) return;

    kakao.maps.load(() => {
      if (!containerRef.current) return;

      const initialPos = new kakao.maps.LatLng(center.lat, center.lng);
      const map = new kakao.maps.Map(containerRef.current, { center: initialPos, level });
      mapRef.current = map;

      requestAnimationFrame(() => {
        map.relayout?.();
        map.setCenter(initialPos);
        setIsMapLoaded(true);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) 장소 변경 시 center/level만 반영
  useEffect(() => {
    if (!isMapLoaded) return;

    const kakao = window.kakao;
    const map = mapRef.current;
    if (!kakao || !map) return;

    const next = new kakao.maps.LatLng(center.lat, center.lng);
    map.setCenter(next);
    map.setLevel?.(level);
  }, [center.lat, center.lng, level, isMapLoaded]);

  // 3) 경로 유무에 따른 오버레이 렌더링/정리
  useEffect(() => {
    if (!isMapLoaded) return;

    const kakao = window.kakao;
    const map = mapRef.current;
    if (!kakao || !map) return;

    const endPos = new kakao.maps.LatLng(center.lat, center.lng);

    const createPinElement = (type: 'start' | 'end') => {
      const wrapper = document.createElement('div');
      const root = createRoot(wrapper);
      // isFixed=false로 넘겨주어 화면 고정이 아닌 마커용으로 사용
      root.render(<CenterPin type={type} isFixed={false} />);
      return wrapper;
    };

    // 기존 선 지우기
    polylinesRef.current.forEach((line) => line.setMap(null));
    polylinesRef.current = [];

    // 경로가 없을 때 (장소 카드만 눌렀을 때)
    if (!routeSegments || routeSegments.length === 0) {
      startOverlayRef.current?.setMap(null); // 출발핀은 숨김

      if (!endOverlayRef.current) {
        endOverlayRef.current = new kakao.maps.CustomOverlay({
          position: endPos,
          content: createPinElement('end'), // 진한 색(end) 적용
          yAnchor: 1, // 핀의 뾰족한 맨 아래를 좌표에 맞춤
        });
        endOverlayRef.current.setMap(map);
      } else {
        endOverlayRef.current.setContent(createPinElement('end'));
        endOverlayRef.current.setPosition(endPos);
      }
      map.setCenter(endPos);
      return;
    }

    // 경로가 있을 때 (멤버 칩을 눌렀을 때)
    const bounds = new kakao.maps.LatLngBounds();
    let firstPos: KakaoLatLng | null = null;

    routeSegments.forEach((seg) => {
      if (seg.path.length === 0) return;

      const pathLatLng = seg.path.map((p) => {
        const pos = new kakao.maps.LatLng(p.lat, p.lng);
        bounds.extend(pos); // 화면 영역 확장을 위해 좌표 추가
        if (!firstPos) firstPos = pos; // 첫 번째 좌표 기록
        return pos;
      });

      const greedyColor = '#008e4c';
      const isWalk = seg.mode === 'WALK';

      const polyline = new kakao.maps.Polyline({
        path: pathLatLng,
        strokeWeight: isWalk ? 8 : 6,
        strokeColor: greedyColor,
        strokeOpacity: 0.9,
        strokeStyle: isWalk ? 'shortdot' : 'solid',
      });
      polyline.setMap(map);
      polylinesRef.current.push(polyline);
    });

    bounds.extend(endPos);

    // 출발 핀
    if (firstPos) {
      if (!startOverlayRef.current) {
        startOverlayRef.current = new kakao.maps.CustomOverlay({
          position: firstPos,
          content: createPinElement('start'),
          yAnchor: 1,
        });
        startOverlayRef.current.setMap(map);
      } else {
        startOverlayRef.current.setContent(createPinElement('start'));
        startOverlayRef.current.setPosition(firstPos);
      }
      startOverlayRef.current.setMap(map);
    }

    // 도착 핀
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

    // 지도 영역 딱 맞게 조절
    map.setBounds(bounds);
  }, [routeSegments, center.lat, center.lng, isMapLoaded]);

  return <div ref={containerRef} className="h-full w-full" />;
}
