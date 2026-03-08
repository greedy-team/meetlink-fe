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

  type KakaoSize = {
    width: number;
    height: number;
  };

  type KakaoPoint = {
    x: number;
    y: number;
  };

  type KakaoMarkerImageOptions = {
    offset?: KakaoPoint;
    alt?: string;
    shape?: string;
    coords?: string;
  };

  type KakaoMarkerImage = {
    src: string;
    size: KakaoSize;
    options?: KakaoMarkerImageOptions;
  };

  type KakaoMarker = {
    setMap(map: KakaoMap | null): void;
    setPosition(pos: KakaoLatLng): void;
    setImage(image: KakaoMarkerImage): void;
  };

  type KakaoCustomOverlay = {
    setMap(map: KakaoMap | null): void;
    setPosition(pos: KakaoLatLng): void;
    setContent(content: string | HTMLElement): void;
  };

  type KakaoPolyline = {
    setMap(map: KakaoMap | null): void;
    setPath(path: KakaoLatLng[]): void;
  };

  type KakaoCoord2AddressResult = {
    address: { address_name: string } | null;
    road_address: { address_name: string } | null;
  };

  interface Window {
    kakao:
      | {
          maps: {
            load(cb: () => void): void;
            LatLng: new (lat: number, lng: number) => KakaoLatLng;
            LatLngBounds: new () => KakaoLatLngBounds;
            Size: new (width: number, height: number) => KakaoSize;
            Point: new (x: number, y: number) => KakaoPoint;
            MarkerImage: new (
              src: string,
              size: KakaoSize,
              options?: KakaoMarkerImageOptions,
            ) => KakaoMarkerImage;
            Map: new (
              container: HTMLElement,
              options: { center: KakaoLatLng; level: number },
            ) => KakaoMap;
            Marker: new (options: {
              position: KakaoLatLng;
              image?: KakaoMarkerImage;
            }) => KakaoMarker;
            CustomOverlay: new (options: {
              position: KakaoLatLng;
              content: string | HTMLElement;
              xAnchor?: number;
              yAnchor?: number;
              zIndex?: number;
            }) => KakaoCustomOverlay;
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
            services: {
              Geocoder: new () => {
                coord2Address(
                  x: number,
                  y: number,
                  callback: (result: KakaoCoord2AddressResult[], status: string) => void,
                ): void;
              };
              Status: { OK: string };
            };
          };
        }
      | undefined; // 맵 로드 전 undefined일 수 있으므로 추가
  }
}
