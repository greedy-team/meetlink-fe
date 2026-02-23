import { useMemo, useState } from 'react';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { Header } from '@/components/common/layout/Header';

import { KakaoMapView } from '@/features/place/ui/KakaoMapView';
import { OpenMapButton } from '@/features/place/ui/OpenMapButton';
import { PlaceRecommendOverlay } from '@/features/place/ui/PlaceRecommendOverlay';
import { type RecommendPlace } from '@/types/meetingTypes';

const MOCK_RECOMMEND_PLACES: RecommendPlace[] = [
  {
    rank: 1,
    placeName: '강남역 11번 출구',
    placeAddress: '서울 서초구 강남대로 405',
    latitude: '37.497942',
    longitude: '127.027621',
    averageTime: 34,
    maxTime: 47,
    participantMovementList: [
      {
        nickName: '민수 (나)',
        takenTime: 25,
        movementData: '',
        movementPath: [
          { lat: 37.501, lng: 127.035 },
          { lat: 37.499, lng: 127.031 },
          { lat: 37.4982, lng: 127.0288 },
        ],
      },
      { nickName: '민지', takenTime: 25, movementData: '', movementPath: [] },
      { nickName: '민준', takenTime: 25, movementData: '', movementPath: [] },
      { nickName: '민성', takenTime: 25, movementData: '', movementPath: [] },
    ],
  },
  {
    rank: 2,
    placeName: '선릉역 5번 출구',
    placeAddress: '서울 강남구 테헤란로 340',
    latitude: '37.504503',
    longitude: '127.048954',
    averageTime: 36,
    maxTime: 50,
    participantMovementList: [
      { nickName: '민수 (나)', takenTime: 27, movementData: '', movementPath: [] },
      { nickName: '민지', takenTime: 26, movementData: '', movementPath: [] },
      { nickName: '민준', takenTime: 33, movementData: '', movementPath: [] },
      { nickName: '민성', takenTime: 29, movementData: '', movementPath: [] },
    ],
  },
];

export default function PlaceRecommendPage() {
  const places = MOCK_RECOMMEND_PLACES;

  const initialRank = places[0]?.rank ?? 1;
  const [selectedRank, setSelectedRank] = useState<number>(initialRank);
  const [selectedNickName, setSelectedNickName] = useState<string | null>(null);

  const selectedPlace = useMemo(
    () => places.find((p) => p.rank === selectedRank) ?? places[0],
    [places, selectedRank],
  );

  const center = useMemo(
    () => ({
      lat: Number(selectedPlace.latitude),
      lng: Number(selectedPlace.longitude),
    }),
    [selectedPlace.latitude, selectedPlace.longitude],
  );

  const level = selectedRank === 1 ? 3 : 4;

  // 선택된 멤버의 movementPath → routePath
  const routePath = useMemo(() => {
    if (!selectedNickName) return null;

    const movement = selectedPlace.participantMovementList.find(
      (m) => m.nickName === selectedNickName,
    );

    return movement?.movementPath && movement.movementPath.length >= 2
      ? movement.movementPath
      : null;
  }, [selectedPlace, selectedNickName]);

  return (
    <AppLayout
      header={<Header title="추천 장소 후보" showBackButton />}
      pageBackgroundClassName="bg-white"
      disableMainPadding
      disableMainMaxWidth
      disableBottomPadding
      disableBottomSpacer
      bottom={
        <div className="w-full">
          <OpenMapButton
            placeName={selectedPlace?.placeName ?? ''}
            latitude={selectedPlace?.latitude ?? ''}
            longitude={selectedPlace?.longitude ?? ''}
            memberStartLatitude={routePath?.[0]?.lat?.toString()}
            memberStartLongitude={routePath?.[0]?.lng?.toString()}
            disabled={!selectedPlace}
          />
        </div>
      }
    >
      <div className="relative min-h-0 w-full flex-1 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gray-100">
          <KakaoMapView center={center} level={level} routePath={routePath} />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
          <PlaceRecommendOverlay
            places={places}
            selectedRank={selectedRank}
            onSelectRank={(rank) => {
              setSelectedRank(rank);
              setSelectedNickName(null); // 장소 바꾸면 멤버 선택 초기화
            }}
            selectedNickName={selectedNickName}
            onChangeSelectedNickName={setSelectedNickName}
            bottomCtaHeightPx={64}
          />
        </div>
      </div>
    </AppLayout>
  );
}
