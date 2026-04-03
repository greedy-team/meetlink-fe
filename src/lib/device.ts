export const isIosSafari = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(userAgent);

  // iOS에서 '홈 화면에 추가'로 실행된 상태(standalone)인지 체크
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && window.navigator.standalone);

  // 아이폰이지만 아직 홈 화면에 추가되지 않은 일반 사파리/크롬 브라우저일 때만 true
  return isIos && !isStandalone;
};

export const isInAppBrowser = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();

  return /kakaotalk|naver|line|instagram|fbav|fban|wv/.test(userAgent);
};
