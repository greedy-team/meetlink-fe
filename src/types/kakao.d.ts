export {};

declare global {
  interface Window {
    kakao: {
      maps: {
        load(cb: () => void): void;

        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (
          container: HTMLElement,
          options: { center: unknown; level: number },
        ) => {
          setCenter(pos: unknown): void;
          relayout?(): void;
        };
        Marker: new (options: { position: unknown }) => {
          setMap(map: unknown | null): void;
          setPosition(pos: unknown): void;
        };
      };
    };
  }
}
