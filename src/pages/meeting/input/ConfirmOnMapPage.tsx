import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { Header } from '@/components/common/layout/Header';
import { type RecentPlaceItem, upsertRecentPlace } from '@/lib/recentPlaces';

import { LatLngMap } from '@/features/meeting/general/LatLngMap';
import { CenterPin } from '@/features/place/confirm/CenterPin';
import { PlaceConfirmSheet } from '@/features/place/confirm/PlaceConfirmSheet';
import { RecenterFab } from '@/features/place/confirm/RecenterFab';

// window.kakao 최소 타입
type KakaoCoord2AddressResult = {
  address?: { address_name: string };
  road_address?: { address_name: string };
};

type KakaoStatus = 'OK' | 'ZERO_RESULT' | 'ERROR';

type KakaoGeocoder = {
  coord2Address: (
    lng: number,
    lat: number,
    callback: (result: KakaoCoord2AddressResult[], status: KakaoStatus) => void,
  ) => void;
};

type KakaoMapsServices = {
  Geocoder: new () => KakaoGeocoder;
};

type KakaoMaps = {
  services: KakaoMapsServices;
};

type KakaoGlobal = {
  maps: KakaoMaps;
};

const getKakao = (): KakaoGlobal | null => {
  const w = window as unknown as { kakao?: KakaoGlobal };
  return w.kakao ?? null;
};

export default function ConfirmOnMapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { code } = useParams<{ code: string }>();

  // 현재 위치 받기 전엔 null
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const [roadAddress, setRoadAddress] = useState('');
  const [jibunAddress, setJibunAddress] = useState('');

  const [isLocating, setIsLocating] = useState(false);

  const reverseTimerRef = useRef<number | null>(null);

  const goBack = () => {
    navigate(`/meeting/${code}/input/place`, { replace: true });
  };

  const reverseGeocode = (nextLat: number, nextLng: number) => {
    const kakao = getKakao();
    const Geocoder = kakao?.maps.services?.Geocoder;
    if (!Geocoder) return;

    const geocoder = new Geocoder();
    geocoder.coord2Address(nextLng, nextLat, (result, status) => {
      if (status !== 'OK' || result.length === 0) return;

      const first = result[0];
      const road = first.road_address?.address_name ?? '';
      const jibun = first.address?.address_name ?? '';

      setRoadAddress(road);
      setJibunAddress(jibun);
    });
  };

  const scheduleReverseGeocode = (nextLat: number, nextLng: number) => {
    if (reverseTimerRef.current) window.clearTimeout(reverseTimerRef.current);

    reverseTimerRef.current = window.setTimeout(() => {
      reverseGeocode(nextLat, nextLng);
    }, 100);
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) return;

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nextLat = pos.coords.latitude;
        const nextLng = pos.coords.longitude;

        setLat(nextLat);
        setLng(nextLng);
        setIsLocating(false);

        // 현위치로 되돌아올 때는 바로 갱신
        reverseGeocode(nextLat, nextLng);
      },
      () => {
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60_000,
      },
    );
  };

  useEffect(() => {
    fetchCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 검증(주소가 있나, 위도/경도는 유효한가, 현재 위치 불러오는 중이 아닌가)
  const canConfirm = useMemo(() => {
    return (
      !!(roadAddress.trim() || jibunAddress.trim()) && lat !== null && lng !== null && !isLocating
    );
  }, [roadAddress, jibunAddress, lat, lng, isLocating]);

  const handleConfirm = () => {
    if (!code || !canConfirm || lat === null || lng === null) return;

    const selectedPlace: RecentPlaceItem = {
      name: roadAddress || jibunAddress,
      address: roadAddress || jibunAddress,
      latitude: lat,
      longitude: lng,
      roadAddress: roadAddress,
      jibunAddress: jibunAddress,
    };

    upsertRecentPlace(selectedPlace);

    navigate(`/meeting/${code}/input/place`, {
      state: { selectedPlace, from: location.state?.from },
      replace: true,
    });
  };

  return (
    <AppLayout header={<Header title="지도에서 위치 확인" onBack={goBack} />}>
      <div className="-mx-4 -my-4 flex min-h-0 flex-1 flex-col">
        <div className="relative min-h-0 w-full flex-1 overflow-hidden">
          {lat !== null && lng !== null ? (
            <>
              <div className="absolute inset-0">
                <LatLngMap
                  lat={lat}
                  lng={lng}
                  level={4}
                  onCenterChange={(nextLat, nextLng) => {
                    setLat(nextLat);
                    setLng(nextLng);
                    scheduleReverseGeocode(nextLat, nextLng);
                  }}
                />
              </div>

              {/* 핀은 화면 중앙 고정 */}
              <div className="pointer-events-none absolute inset-0 z-20">
                <CenterPin />
              </div>

              {/* RecenterFab는 지도 위 레이어 */}
              <div className="absolute right-6 bottom-6 z-30">
                <RecenterFab onClick={fetchCurrentLocation} />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gray-50 px-6 text-center">
              <div className="space-y-2">
                <div className="text-base font-semibold text-gray-900">
                  현재 위치를 불러와야 지도를 확인할 수 있어요
                </div>
                <div className="text-sm text-gray-500">
                  위치 권한을 허용하고 잠시만 기다려주세요.
                </div>
              </div>
            </div>
          )}
        </div>

        <PlaceConfirmSheet
          roadAddress={
            roadAddress ||
            jibunAddress ||
            (isLocating ? '현재 위치 불러오는 중…' : '위치를 찾을 수 없습니다')
          }
          jibunAddress={roadAddress ? jibunAddress : ''} // 도로명이 메인에 들어갔을 때만 지번을 서브로 띄움
          onConfirm={handleConfirm}
          onConfirmDisabled={!canConfirm}
        />
      </div>
    </AppLayout>
  );
}
