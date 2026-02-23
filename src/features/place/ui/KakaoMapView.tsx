import { useEffect, useRef, useState } from 'react';

type LatLng = { lat: number; lng: number };

type KakaoMapViewProps = {
  center: LatLng;
  level?: number;
  routePath?: LatLng[] | null;
};

const GREEDY = '#008e4c';
const GREEDY_STRONG = '#0b5a2a';

export function KakaoMapView({ center, level = 4, routePath = null }: KakaoMapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const startMarkerRef = useRef<KakaoMarker | null>(null);
  const endMarkerRef = useRef<KakaoMarker | null>(null);

  const outerLineRef = useRef<KakaoPolyline | null>(null);
  const innerLineRef = useRef<KakaoPolyline | null>(null);

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

    // routePath 없음: 도착핀만 + 도착 좌표로 center
    if (!routePath || routePath.length < 2) {
      outerLineRef.current?.setMap(null);
      innerLineRef.current?.setMap(null);
      outerLineRef.current = null;
      innerLineRef.current = null;

      startMarkerRef.current?.setMap(null);
      startMarkerRef.current = null;

      if (!endMarkerRef.current) {
        const mk = new kakao.maps.Marker({ position: endPos });
        mk.setMap(map);
        endMarkerRef.current = mk;
      } else {
        endMarkerRef.current.setMap(map);
        endMarkerRef.current.setPosition(endPos);
      }

      map.setCenter(endPos);
      return;
    }

    // routePath 있음
    const pathLatLng = routePath.map((p) => new kakao.maps.LatLng(p.lat, p.lng));
    const startPos = pathLatLng[0];

    if (!outerLineRef.current) {
      const outer = new kakao.maps.Polyline({
        path: pathLatLng,
        strokeWeight: 10,
        strokeColor: GREEDY_STRONG,
        strokeOpacity: 1,
        strokeStyle: 'solid',
      });
      outer.setMap(map);
      outerLineRef.current = outer;
    } else {
      outerLineRef.current.setMap(map);
      outerLineRef.current.setPath(pathLatLng);
    }

    if (!innerLineRef.current) {
      const inner = new kakao.maps.Polyline({
        path: pathLatLng,
        strokeWeight: 6,
        strokeColor: GREEDY,
        strokeOpacity: 1,
        strokeStyle: 'solid',
      });
      inner.setMap(map);
      innerLineRef.current = inner;
    } else {
      innerLineRef.current.setMap(map);
      innerLineRef.current.setPath(pathLatLng);
    }

    if (!startMarkerRef.current) {
      const mk = new kakao.maps.Marker({ position: startPos });
      mk.setMap(map);
      startMarkerRef.current = mk;
    } else {
      startMarkerRef.current.setMap(map);
      startMarkerRef.current.setPosition(startPos);
    }

    if (!endMarkerRef.current) {
      const mk = new kakao.maps.Marker({ position: endPos });
      mk.setMap(map);
      endMarkerRef.current = mk;
    } else {
      endMarkerRef.current.setMap(map);
      endMarkerRef.current.setPosition(endPos);
    }

    if (map.setBounds) {
      const bounds = new kakao.maps.LatLngBounds();
      pathLatLng.forEach((pos) => bounds.extend(pos));
      bounds.extend(endPos);
      map.setBounds(bounds);
    }
  }, [routePath, center.lat, center.lng, isMapLoaded]);

  return <div ref={containerRef} className="h-full w-full" />;
}
