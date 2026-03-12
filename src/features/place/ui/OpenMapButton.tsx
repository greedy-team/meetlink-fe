import { useKakaoLoader } from '@/hooks/useKakaoLoader';

type OpenMapButtonProps = {
  placeName: string;
  latitude: string;
  longitude: string;
  memberStartLatitude?: string;
  memberStartLongitude?: string;
  memberName?: string | null;
  disabled?: boolean;
};

function isMobile() {
  const ua = navigator.userAgent || '';
  return /Android|iPhone|iPad|iPod/i.test(ua);
}

function buildKakaoRouteUrl(params: { sp?: string; ep: string; sn?: string; en?: string }) {
  const qs = new URLSearchParams();
  if (params.sp) qs.set('sp', params.sp);
  qs.set('ep', params.ep);
  if (params.sn) qs.set('sn', params.sn); // 출발지명(실제 주소)
  if (params.en) qs.set('en', params.en); // 도착지명
  return `kakaomap://route?${qs.toString()}`;
}

function buildKakaoRouteMobileWebFallbackUrl(params: {
  sp?: string;
  ep: string;
  sn?: string;
  en?: string;
}) {
  const qs = new URLSearchParams();
  if (params.sp) qs.set('sp', params.sp);
  qs.set('ep', params.ep);
  if (params.sn) qs.set('sn', params.sn);
  if (params.en) qs.set('en', params.en);
  return `http://m.map.kakao.com/scheme/route?${qs.toString()}`;
}

function openWithMobileFallback(appUrl: string, fallbackUrl: string) {
  window.location.href = appUrl;
  window.setTimeout(() => (window.location.href = fallbackUrl), 800);
}

export function OpenMapButton({
  placeName,
  latitude,
  longitude,
  memberStartLatitude,
  memberStartLongitude,
  memberName,
  disabled,
}: OpenMapButtonProps) {
  const isKakaoLoaded = useKakaoLoader();
  const isDisabled = disabled || !latitude || !longitude;

  // 컴포넌트 내부에서 isKakaoLoaded 상태를 사용하여 주소 변환 수행
  const getAddressFromCoords = (lat: number, lng: number): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!isKakaoLoaded || !window.kakao?.maps?.services?.Geocoder) {
        resolve(null);
        return;
      }

      const kakao = window.kakao;
      const geocoder = new kakao.maps.services.Geocoder();

      geocoder.coord2Address(lng, lat, (result, status) => {
        if (status === kakao.maps.services.Status.OK && result[0]) {
          const address = result[0].road_address?.address_name || result[0].address?.address_name;
          resolve(address || null);
        } else {
          resolve(null);
        }
      });
    });
  };

  const handleClick = async () => {
    if (isDisabled || !isKakaoLoaded) return;

    const ep = `${latitude},${longitude}`;
    const en = placeName; // 도착지 이름은 장소명으로 고정

    // 데스크탑 팝업 차단 우회: 클릭 즉시 빈 새 창을 먼저 띄워둠
    const newWindow = !isMobile() ? window.open('', '_blank') : null;

    const executeMap = (sp: string | undefined, sn: string | undefined) => {
      const appUrl = buildKakaoRouteUrl({ sp, ep, sn, en });
      const fallbackUrl = buildKakaoRouteMobileWebFallbackUrl({ sp, ep, sn, en });

      if (isMobile()) {
        if (newWindow) newWindow.close(); // 모바일이면 새 창 닫고 앱 열기
        openWithMobileFallback(appUrl, fallbackUrl);
      } else if (newWindow) {
        newWindow.location.href = fallbackUrl; // 데스크탑은 띄워둔 새 창을 카카오맵으로 바꿈
      }
    };

    // 멤버 경로가 있을 때
    if (memberStartLatitude && memberStartLongitude && memberName) {
      const lat = Number(memberStartLatitude);
      const lng = Number(memberStartLongitude);
      const sp = `${lat},${lng}`;

      // 멤버 좌표 -> 실제 주소 변환
      const address = await getAddressFromCoords(lat, lng);
      const sn = address || `${memberName} 출발지`;

      executeMap(sp, sn);
      return;
    }

    // 경로 없을 때 (장소 카드만 선택 하면 현재 내 위치에서 길찾기)
    if (!navigator.geolocation) {
      executeMap(undefined, undefined);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const sp = `${lat},${lng}`;

        // 내 GPS 좌표로 실제 주소 번역
        const address = await getAddressFromCoords(lat, lng);
        const sn = address || '내 위치';

        executeMap(sp, sn);
      },
      () => executeMap(undefined, undefined), // GPS 동의 거절 시 도착지만 넘김
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 30_000 },
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled || !isKakaoLoaded}
      className={[
        'w-full cursor-pointer rounded-none px-4 py-4 text-base font-semibold',
        isDisabled || !isKakaoLoaded
          ? 'bg-gray-200 text-gray-500'
          : 'bg-greedy text-white active:opacity-90',
      ].join(' ')}
      aria-label={`${placeName}까지 카카오맵 길찾기 열기`}
    >
      지도 앱에서 열기
    </button>
  );
}
