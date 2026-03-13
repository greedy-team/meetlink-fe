import { useEffect, useState } from 'react';

export function useKakaoLoader() {
  // 객체 존재 여부뿐만 아니라 생성자(LatLng)가 주입되었는지까지 확인
  const [isLoaded, setIsLoaded] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!(window.kakao && window.kakao.maps && window.kakao.maps.LatLng);
  });

  useEffect(() => {
    if (isLoaded) return;

    const existingScript = document.getElementById('kakao-map-script');

    // 스크립트 로드 및 초기화 로직
    const initKakao = () => {
      window.kakao?.maps?.load(() => {
        setIsLoaded(true);
      });
    };

    if (existingScript) {
      // 이미 스크립트가 있다면 로드 완료를 기다리거나 이미 완료됐다면 바로 초기화
      if (window.kakao?.maps?.load) {
        initKakao();
      } else {
        existingScript.addEventListener('load', initKakao);
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'kakao-map-script';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=682bb2dfb6a8ebee89c494ad75d17ad0&libraries=services&autoload=false`;
    script.onload = initKakao;
    //script.onerror = () => console.error('카카오맵 SDK 로드 실패');

    document.head.appendChild(script);
  }, [isLoaded]);

  return isLoaded;
}
