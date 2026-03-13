# MeetLink - Frontend

> **"결정 안되던 약속, 여기서 끝내세요"** <br/>
> 파편화된 조율 과정과 이동 시간의 불공평함을 해결하는 **최적의 모임 시간 & 장소 추천 서비스**입니다.

<br/>

## 주요 기능

### 1. 모임 생성 및 가입 없는 빠른 참여

> _초대 링크 하나로 번거로운 절차 없이 즉시 모임에 합류하세요._

- **직관적인 모임 생성:** 깔끔한 UI를 통해 모임 명칭과 추천 옵션(시간/장소)을 빠르게 설정할 수 있습니다.
- **원클릭 초대 및 참여:** 생성된 고유 링크를 통해 별도의 회원가입 없이 누구나 즉시 접속하여 닉네임을 설정하고 참여할 수 있습니다.

### 2. 직관적인 시간 및 출발지 입력

> _내 스케줄과 출발 위치를 지도와 히트맵으로 손쉽게 입력하세요._

- **드래그 앤 드롭 일정 입력:** 요일별 공강 시간이나 특정 날짜의 일정을 터치와 드래그로 부드럽게 입력할 수 있는 커스텀 캘린더 UI를 제공합니다.
- **카카오맵 API 연동 출발지 검색:** 키워드 및 주소 검색은 물론, GPS 기반의 '현재 위치 사용' 기능을 통해 정확한 출발지를 시각적으로 확인하고 지정할 수 있습니다.

### 3. 최적의 시간 & 공평한 장소 추천 결과

> _모두가 만족하는 최적의 교집합 시간과 합리적인 중간 지점을 확인하세요._

- **부드러운 대기 화면 (Skeleton UX):** 백엔드에서 대중교통 이동 시간 및 기하중심을 계산하는 동안, 유저의 이탈을 막고 레이아웃 덜컹거림(CLS)을 완벽하게 방지하는 친절한 애니메이션 안내를 제공합니다.
- **추천 결과 시각화:** 산출된 최적의 장소를 카카오 지도 위에 인터랙티브하게 렌더링하며, 가장 많은 인원이 모일 수 있는 추천 시간대를 한눈에 파악할 수 있는 요약 카드를 제공합니다.

### 4. 유연한 환경 설정 및 안전한 재참여

> _모임 설정을 자유롭게 변경하고, 창을 닫아도 내 프로필 그대로 복귀하세요._

- **실시간 옵션 변경:** 모임이 진행 중이더라도 주최자 또는 참여자가 모임의 이름이나 시간/장소 추천 필요 여부를 유연하게 켜고 끌 수 있습니다.
- **데이터가 보존되는 세션 복구:** 브라우저를 실수로 닫거나 다른 기기로 다시 접속하더라도, 기존에 참여했던 닉네임으로 중복 없이 안전하게 복귀할 수 있습니다.
- **기존 입력 정보 유지:** 재참여 시 이전에 정성스럽게 입력했던 시간과 출발지 데이터가 그대로 보존되어 언제든 편리하게 수정이 가능합니다.

<br/>

## 유저 흐름 (User Flow)

> _MeetLink의 전체적인 사용 흐름을 확인해 보세요._

|                                     1. 모임 생성 및 참여                                      |                                          2. 시간 및 출발지 입력                                           |
| :-------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/user-attachments/assets/6ce53ed3-411a-4d28-8d71-e8592882a5e2" width="250" alt="모임 생성 데모" />  | <img src="https://github.com/user-attachments/assets/90f3d8be-3d28-4817-ba62-6b63f93a6f32" width="250" alt="시간 및 출발지 입력 데모" /> |
|                                  **3. 시간/장소 추천 결과**                                   |                                        **4. 환경 설정 및 재참여**                                         |
| <img src="https://github.com/user-attachments/assets/39126bad-82a5-47a2-92a3-ad7715e601c5" width="250" alt="추천 결과 데모" /> |      <img src="https://github.com/user-attachments/assets/a83293e9-3ace-4e71-8977-aa0e19ddf997" width="250" alt="설정 및 재참여 데모" />      |

<br/>

## 기술 스택

### Core

- **Library:** React 18
- **Language:** TypeScript
- **Bundler:** Vite
- **Routing:** React Router DOM

### Styling & UI

- **Framework:** TailwindCSS
- **Icons:** Lucide React
- **Toast:** Sonner

### State Management & Data Fetching

- **Server State:** TanStack Query (React Query)
- **Client State:** Context API (MeetingContext) / Zustand
- **HTTP Client:** Axios

### External API

- **Map:** Kakao Maps API (지도 렌더링, 장소 검색, 좌표-주소 변환)

<br/>

## 폴더 구조

```text
meetlink-fe
├── public/          # 로고(svg), robots.txt 등 정적 리소스
├── src/
│   ├── assets/      # 전역 이미지 및 아이콘
│   ├── components/  # 앱 전역에서 사용하는 재사용 컴포넌트
│   │   ├── common/  # AppLayout, Header, FixedBottomButton 등 공통 레이아웃
│   │   └── ui/      # shadcn/ui 기반의 순수 UI 컴포넌트 (Button, Input, Toast 등)
│   ├── features/    # 도메인(기능) 단위의 로직 및 뷰 컴포넌트 분리
│   │   ├── api/     # axiosInstance 및 도메인별 API 호출 함수
│   │   ├── meeting/ # 모임 정보, 참여, 환경 설정 관련 기능
│   │   ├── place/   # 카카오맵 렌더링, 장소 검색, 좌표-주소 변환(confirm) 기능
│   │   └── Time/    # TimeHeatMap, 달력, 시간표 추천 뷰 등 시간 조율 기능
│   ├── hooks/       # 도메인/비즈니스 로직을 분리한 커스텀 훅
│   ├── lib/         # utils, 스토리지 관리 등 유틸리티 함수
│   ├── pages/       # 실제 React Router에 의해 렌더링되는 라우팅 페이지 컴포넌트
│   │   ├── landing/ # 서비스 랜딩 페이지 (시작 화면)
│   │   ├── create/  # 새로운 모임 생성 및 공유 페이지
│   │   └── meeting/ # 모임 메인(MainPage), 정보 입력(input), 추천 결과(recommend)
│   ├── types/       # 공통 API 응답 타입 및 외부 라이브러리 타입 선언
│   └── App.tsx / main.tsx # 최상위 엔트리 포인트 및 전역 라우팅
├── eslint.config.js # ESLint 설정
├── vite.config.ts   # Vite 번들러 설정
└── vercel.json      # Vercel 배포 설정 파일
```

<br/>

## 시작하기

### 1. 환경 변수 설정 (`.env`)

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 아래 변수들을 입력해주세요.

```env
VITE_KAKAO_MAP_APP_KEY=your_kakao_map_app_key_here
VITE_API_BASE_URL=your_backend_api_url_here
```

### 2. 패키지 설치 및 실행

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (기본 포트: 5173)
npm run dev

# 배포용 빌드 및 로컬 테스트
npm run build
npm run preview -- --port 5173
```
