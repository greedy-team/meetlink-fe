import { useEffect, useRef, useState } from 'react';

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

    const createPinHtml = (type: 'start' | 'end') => {
      const isStart = type === 'start';
      const greedyColor = '#008e4c';

      // 출발핀/도착핀 색상 반전
      const circleBg = isStart ? 'white' : greedyColor;
      const borderStyle = isStart ? `2px solid ${greedyColor}` : '2px solid transparent';
      const iconColor = isStart ? greedyColor : 'white';

      const zIndex = isStart ? 1 : 2; // 겹칠 경우 도착핀이 출발핀보다 위에 보이도록 z-index 조정

      // Lucide React의 <MapPin /> 아이콘을 SVG로 변환한 문자열
      const mapPinSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      `;

      // CenterPin 스타일 적용한 HTML 반환
      return `
        <div style="z-index: ${zIndex}; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
          <div style="
            box-sizing: border-box;
            width: 40px; 
            height: 40px; 
            border-radius: 50%; 
            background-color: ${circleBg}; 
            border: ${borderStyle};
            display: flex; 
            justify-content: center; 
            align-items: center; 
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
          ">
            ${mapPinSvg}
          </div>
          <div style="
            width: 8px; 
            height: 8px; 
            border-radius: 50%; 
            background-color: ${greedyColor}; 
            margin-top: 4px; 
            box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
          "></div>
        </div>
      `;
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
          content: createPinHtml('end'), // 진한 색(end) 적용
          yAnchor: 1, // 핀의 뾰족한 맨 아래를 좌표에 맞춤
        });
        endOverlayRef.current.setMap(map);
      } else {
        endOverlayRef.current.setContent(createPinHtml('end'));
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

      // 모드별 색상 결정
      const greedyColor = '#008e4c';
      const isWalk = seg.mode === 'WALK';

      // 선(Polyline)을 생성해서 배열에 저장
      const polyline = new kakao.maps.Polyline({
        path: pathLatLng,
        strokeWeight: isWalk ? 8 : 6,
        strokeColor: greedyColor,
        strokeOpacity: 0.9,
        strokeStyle: isWalk ? 'shortdot' : 'solid', // 도보는 점선, 나머지는 실선
      });
      polyline.setMap(map);
      polylinesRef.current.push(polyline); // 나중에 지우기 위해 참조 저장
    });

    bounds.extend(endPos);

    // 출발 핀
    if (firstPos) {
      if (!startOverlayRef.current) {
        startOverlayRef.current = new kakao.maps.CustomOverlay({
          position: firstPos,
          content: createPinHtml('start'), // 연한 색(start) 적용
          yAnchor: 1,
        });
        startOverlayRef.current.setMap(map);
      } else {
        startOverlayRef.current.setContent(createPinHtml('start'));
        startOverlayRef.current.setPosition(firstPos);
      }
      startOverlayRef.current.setMap(map);
    }

    // 도착 핀
    if (!endOverlayRef.current) {
      endOverlayRef.current = new kakao.maps.CustomOverlay({
        position: endPos,
        content: createPinHtml('end'), // 진한 색(end) 적용
        yAnchor: 1,
      });
    } else {
      endOverlayRef.current.setContent(createPinHtml('end'));
      endOverlayRef.current.setPosition(endPos);
    }
    endOverlayRef.current.setMap(map);

    // 지도 영역 딱 맞게 조절
    map.setBounds(bounds);
  }, [routeSegments, center.lat, center.lng, isMapLoaded]);

  return <div ref={containerRef} className="h-full w-full" />;
}
