export {};

declare global {
  type KakaoLatLng = {
    getLat(): number;
    getLng(): number;
  };

  type KakaoMap = {
    setCenter(pos: KakaoLatLng): void;
    getCenter(): KakaoLatLng;
    relayout?(): void;
  };

  type KakaoMarker = {
    setMap(map: KakaoMap | null): void;
    setPosition(pos: KakaoLatLng): void;
  };

  interface Window {
    kakao: {
      maps: {
        load(cb: () => void): void;

        LatLng: new (lat: number, lng: number) => KakaoLatLng;

        Map: new (
          container: HTMLElement,
          options: { center: KakaoLatLng; level: number },
        ) => KakaoMap;

        Marker: new (options: { position: KakaoLatLng }) => KakaoMarker;

        event: {
          addListener(target: unknown, type: string, handler: () => void): void;
        };
      };
    };
  }
}
