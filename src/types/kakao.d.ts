export {};

declare global {
  type KakaoLatLng = {
    getLat(): number;
    getLng(): number;
  };

  type KakaoLatLngBounds = {
    extend(pos: KakaoLatLng): void;
  };

  type KakaoMap = {
    setCenter(pos: KakaoLatLng): void;
    getCenter(): KakaoLatLng;
    setLevel(level: number): void;
    setBounds(bounds: KakaoLatLngBounds): void;
    relayout?(): void;
  };

  type KakaoMarker = {
    setMap(map: KakaoMap | null): void;
    setPosition(pos: KakaoLatLng): void;
  };

  type KakaoPolyline = {
    setMap(map: KakaoMap | null): void;
    setPath(path: KakaoLatLng[]): void;
  };

  interface Window {
    kakao:
      | {
          maps: {
            load(cb: () => void): void;
            LatLng: new (lat: number, lng: number) => KakaoLatLng;
            LatLngBounds: new () => KakaoLatLngBounds;
            Map: new (
              container: HTMLElement,
              options: { center: KakaoLatLng; level: number },
            ) => KakaoMap;
            Marker: new (options: { position: KakaoLatLng }) => KakaoMarker;
            Polyline: new (options: {
              path: KakaoLatLng[];
              strokeWeight?: number;
              strokeColor?: string;
              strokeOpacity?: number;
              strokeStyle?: string;
            }) => KakaoPolyline;
            event: {
              addListener(target: unknown, type: string, handler: () => void): void;
            };
          };
        }
      | undefined; // 맵 로드 전 undefined일 수 있으므로 추가
  }
}
