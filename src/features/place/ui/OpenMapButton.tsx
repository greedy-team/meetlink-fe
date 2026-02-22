type OpenMapButtonProps = {
  placeName: string;
  latitude: string;
  longitude: string;
  memberStartLatitude?: string;
  memberStartLongitude?: string;
  disabled?: boolean;
};

function isMobile() {
  const ua = navigator.userAgent || '';
  return /Android|iPhone|iPad|iPod/i.test(ua);
}

function buildKakaoRouteUrl(params: { sp?: string; ep: string }) {
  const qs = new URLSearchParams();
  if (params.sp) qs.set('sp', params.sp);
  qs.set('ep', params.ep);
  return `kakaomap://route?${qs.toString()}`;
}

function buildKakaoRouteMobileWebFallbackUrl(params: { sp?: string; ep: string }) {
  const qs = new URLSearchParams();
  if (params.sp) qs.set('sp', params.sp);
  qs.set('ep', params.ep);
  return `http://m.map.kakao.com/scheme/route?${qs.toString()}`;
}

function openWithMobileFallback(appUrl: string, fallbackUrl: string) {
  window.location.href = appUrl;
  window.setTimeout(() => {
    window.location.href = fallbackUrl;
  }, 800);
}

export function OpenMapButton({
  placeName,
  latitude,
  longitude,
  memberStartLatitude,
  memberStartLongitude,
  disabled,
}: OpenMapButtonProps) {
  const isDisabled = disabled || !latitude || !longitude;

  const handleClick = () => {
    if (isDisabled) return;

    const ep = `${latitude},${longitude}`;

    // 경로 표시 중이면 멤버 출발좌표 사용
    if (memberStartLatitude && memberStartLongitude) {
      const sp = `${memberStartLatitude},${memberStartLongitude}`;
      const appUrl = buildKakaoRouteUrl({ sp, ep });
      const fallbackUrl = buildKakaoRouteMobileWebFallbackUrl({ sp, ep });

      if (isMobile()) openWithMobileFallback(appUrl, fallbackUrl);
      else window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // 경로 없으면 현재 위치를 sp로 시도
    const openWithoutSp = () => {
      const appUrl = buildKakaoRouteUrl({ ep });
      const fallbackUrl = buildKakaoRouteMobileWebFallbackUrl({ ep });

      if (isMobile()) openWithMobileFallback(appUrl, fallbackUrl);
      else window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    };

    if (!navigator.geolocation) {
      openWithoutSp();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const sp = `${pos.coords.latitude},${pos.coords.longitude}`;
        const appUrl = buildKakaoRouteUrl({ sp, ep });
        const fallbackUrl = buildKakaoRouteMobileWebFallbackUrl({ sp, ep });

        if (isMobile()) openWithMobileFallback(appUrl, fallbackUrl);
        else window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      },
      () => openWithoutSp(),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 30_000 },
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={[
        'w-full rounded-none px-4 py-4 text-base font-semibold',
        isDisabled ? 'bg-gray-200 text-gray-500' : 'bg-greedy text-white active:opacity-90',
      ].join(' ')}
      aria-label={`${placeName}까지 카카오맵 길찾기 열기`}
    >
      지도 앱에서 열기
    </button>
  );
}
