import { useMemo, useState } from 'react';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { Header } from '@/components/common/layout/Header';
import { useRecommendPlace } from '@/hooks/useRecommend';

import { KakaoMapView } from '@/features/place/ui/KakaoMapView';
import { OpenMapButton } from '@/features/place/ui/OpenMapButton';
import { PlaceRecommendOverlay } from '@/features/place/ui/PlaceRecommendOverlay';
import { type PathSegment, type RecommendPlace } from '@/types/meetingTypes';

interface RawSegment {
  coordinates?: [number, number][]; // [위도, 경도] 형태의 숫자 배열
  mode?: string;
}

interface RawRoute {
  nickname: string;
  travelTime: number;
  segments?: RawSegment[];
}

interface RawRecommendPlaceItem {
  rank: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  avgTravelTime: number;
  maxTravelTime: number;
  routes?: RawRoute[];
}

export default function PlaceRecommendPage() {
  const { data, isLoading } = useRecommendPlace();

  const places: RecommendPlace[] = useMemo(() => {
    if (!data?.result) return [];

    return data.result.map((item: RawRecommendPlaceItem) => ({
      rank: item.rank,
      placeName: item.name,
      placeAddress: item.address,
      latitude: item.latitude.toString(),
      longitude: item.longitude.toString(),
      averageTime: Math.round(item.avgTravelTime / 60),
      maxTime: Math.round(item.maxTravelTime / 60),
      participantMovementList: (item.routes || []).map((route: RawRoute) => {
        const flatPath: { lat: number; lng: number }[] = [];
        const mappedSegments: PathSegment[] = [];

        if (route.segments) {
          route.segments.forEach((seg: RawSegment) => {
            if (seg.coordinates && seg.coordinates.length > 0) {
              const currentSegPath = seg.coordinates.map((coord) => ({
                lat: coord[0],
                lng: coord[1],
              }));

              flatPath.push(...currentSegPath);

              mappedSegments.push({
                mode: seg.mode || 'WALK',
                path: currentSegPath,
              });
            }
          });
        }

        return {
          nickName: route.nickname,
          takenTime: Math.round(route.travelTime / 60),
          movementData: route.segments?.[0]?.mode || 'WALK',
          movementPath: flatPath,
          segments: mappedSegments,
        };
      }),
    }));
  }, [data]);

  const [selectedRank, setSelectedRank] = useState<number>(1);
  const [selectedNickName, setSelectedNickName] = useState<string | null>(null);

  const activeRank = places.some((p) => p.rank === selectedRank)
    ? selectedRank
    : (places[0]?.rank ?? 1);

  const selectedPlace = useMemo(
    () => places.find((p) => p.rank === activeRank) ?? places[0],
    [places, activeRank],
  );

  const center = useMemo(() => {
    if (!selectedPlace) return { lat: 37.5665, lng: 126.978 };
    return {
      lat: Number(selectedPlace.latitude),
      lng: Number(selectedPlace.longitude),
    };
  }, [selectedPlace]);

  const level = activeRank === 1 ? 3 : 4;

  // 멤버의 이동 정보 전체를 먼저 찾고 (activeMovement)
  const activeMovement = useMemo(() => {
    if (!selectedNickName || !selectedPlace) return null;
    return (
      selectedPlace.participantMovementList?.find((m) => m.nickName === selectedNickName) || null
    );
  }, [selectedPlace, selectedNickName]);

  // 그 다음 activeMovement에서 segments와 movementPath를 추출 (routeSegments, routePath)
  const routeSegments = activeMovement?.segments ?? null;
  const routePath = activeMovement?.movementPath ?? null;

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
            memberName={selectedNickName}
            disabled={!selectedPlace}
          />
        </div>
      }
    >
      <div className="relative min-h-0 w-full flex-1 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gray-100">
          {isLoading ? (
            <div className="h-full w-full animate-pulse bg-gray-200" />
          ) : (
            <KakaoMapView center={center} level={level} routeSegments={routeSegments} />
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
          {isLoading ? (
            <div className="flex h-full flex-col justify-between pb-16.5">
              {/* 상단 칩 스켈레톤 */}
              <div className="flex gap-2 overflow-hidden pt-2 pb-1">
                <div className="ml-4 h-13 w-23 shrink-0 animate-pulse rounded-2xl border-2 border-transparent bg-gray-300/60 shadow-sm" />
                <div className="h-13 w-23 shrink-0 animate-pulse rounded-2xl border-2 border-transparent bg-gray-300/60 shadow-sm" />
                <div className="h-13 w-23 shrink-0 animate-pulse rounded-2xl border-2 border-transparent bg-gray-300/60 shadow-sm" />
              </div>

              {/* 하단 장소 카드 스켈레톤 (2개) */}
              <div className="flex gap-3 overflow-hidden pb-2">
                <div className="ml-4 h-32.5 min-w-70 shrink-0 animate-pulse rounded-2xl border-2 border-transparent bg-gray-300/60 shadow-md" />
                <div className="h-32.5 min-w-70 shrink-0 animate-pulse rounded-2xl border-2 border-transparent bg-gray-300/60 shadow-md" />
              </div>
            </div>
          ) : (
            places.length > 0 && (
              <PlaceRecommendOverlay
                places={places}
                selectedRank={activeRank}
                onSelectRank={(rank) => {
                  setSelectedRank(rank);
                }}
                selectedNickName={selectedNickName}
                onChangeSelectedNickName={setSelectedNickName}
                bottomCtaHeightPx={64}
              />
            )
          )}
        </div>
      </div>
    </AppLayout>
  );
}
