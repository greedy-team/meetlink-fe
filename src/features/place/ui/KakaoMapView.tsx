import { useEffect, useRef } from 'react';

type LatLng = { lat: number; lng: number };

type KakaoMapViewProps = {
  center: LatLng;
  level?: number;
  routePath?: LatLng[] | null;
};

type MarkerLike = {
  setMap: (map: unknown | null) => void;
  setPosition: (pos: unknown) => void;
};

type PolylineLike = {
  setMap: (map: unknown | null) => void;
  setPath: (path: unknown[]) => void;
};

type MapLike = {
  setCenter: (pos: unknown) => void;
  setLevel?: (lv: number) => void;
  setBounds?: (b: unknown) => void;
  relayout?: () => void;
};

type KakaoMapsApi = {
  maps: {
    load: (cb: () => void) => void;

    Map: new (
      container: HTMLElement,
      options: {
        center: unknown;
        level: number;
      },
    ) => MapLike;
    LatLng: new (lat: number, lng: number) => unknown;

    Marker: new (options: { position: unknown }) => MarkerLike;

    Polyline: new (options: {
      path: unknown[];
      strokeWeight?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeStyle?: string;
    }) => PolylineLike;

    LatLngBounds: new () => {
      extend: (pos: unknown) => void;
    };
  };
};

function getKakao(): KakaoMapsApi | null {
  const k = window.kakao as KakaoMapsApi | undefined;
  if (!k?.maps?.load) return null;
  return k;
}

const GREEDY = '#008e4c';
const GREEDY_STRONG = '#0b5a2a';

export function KakaoMapView({ center, level = 4, routePath = null }: KakaoMapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLike | null>(null);

  const startMarkerRef = useRef<MarkerLike | null>(null);
  const endMarkerRef = useRef<MarkerLike | null>(null);

  const outerLineRef = useRef<PolylineLike | null>(null);
  const innerLineRef = useRef<PolylineLike | null>(null);

  // 1) 지도 최초 1회 생성 + relayout
  useEffect(() => {
    const kakao = getKakao();
    if (!kakao) return;

    kakao.maps.load(() => {
      if (!containerRef.current) return;

      const initialPos = new kakao.maps.LatLng(center.lat, center.lng);
      const map = new kakao.maps.Map(containerRef.current, { center: initialPos, level });
      mapRef.current = map;

      // ✅ 생성 직후 레이아웃 확정(핵심)
      requestAnimationFrame(() => {
        map.relayout?.();
        map.setCenter(initialPos);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) 장소 변경 시 center/level만 반영 (사용자 pan/zoom은 “props가 바뀔 때만” 리셋됨)
  useEffect(() => {
    const kakao = getKakao();
    const map = mapRef.current;
    if (!kakao || !map) return;

    const next = new kakao.maps.LatLng(center.lat, center.lng);
    map.setCenter(next);
    map.setLevel?.(level);
  }, [center.lat, center.lng, level]);

  // 3) 경로 유무에 따른 오버레이 렌더링/정리
  useEffect(() => {
    const kakao = getKakao();
    const map = mapRef.current;
    if (!kakao || !map) return;

    const endPos = new kakao.maps.LatLng(center.lat, center.lng);

    // routePath 없음: 도착핀만 + 도착 좌표로 center
    if (!routePath || routePath.length < 2) {
      // 🔻 routePath 있을 때 그려졌던 것들 정리(안하면 남아있음)
      outerLineRef.current?.setMap(null);
      innerLineRef.current?.setMap(null);
      outerLineRef.current = null;
      innerLineRef.current = null;

      startMarkerRef.current?.setMap(null);
      startMarkerRef.current = null;

      // 도착 기본 핀
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

    // routePath 있음: 폴리라인(2겹) + 출발핀 + 도착핀 + fitBounds
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
  }, [routePath, center.lat, center.lng]);

  return <div ref={containerRef} className="h-full w-full" />;
}
