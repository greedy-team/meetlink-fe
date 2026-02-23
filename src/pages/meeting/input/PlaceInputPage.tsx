import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { useUpdateMyStartPlace } from '@/hooks/usePlace';

import { PlaceSearchBar } from '@/features/place/ui/PlaceSearchBar';
import { RecentPlaceList } from '@/features/place/ui/RecentPlaceList';
import { SelectedPlaceSummary } from '@/features/place/ui/SelectedPlaceSummary';
import { UseCurrentLocationCard } from '@/features/place/ui/UseCurrentLocationCard';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';
import type { UpdateMyStartPlaceRequest } from '@/types/apiTypes';

type FromPage = 'join' | 'main';

type LocationState = {
  selectedPlace?: UpdateMyStartPlaceRequest;
  from?: FromPage;
};

const RECENT_PLACES_KEY = 'recent_places';
const MAX_RECENTS = 5;

// 내 출발지 저장 키 (meeting member id 기준)
const myStartPlaceKey = (memberId: string) => `my_start_place_${memberId}`;

const loadMyStartPlaceCache = (memberId: string): UpdateMyStartPlaceRequest | null => {
  const raw = localStorage.getItem(myStartPlaceKey(memberId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UpdateMyStartPlaceRequest;
  } catch {
    return null;
  }
};

const saveMyStartPlaceCache = (memberId: string, place: UpdateMyStartPlaceRequest) => {
  localStorage.setItem(myStartPlaceKey(memberId), JSON.stringify(place));
};

const loadRecentPlaces = (): UpdateMyStartPlaceRequest[] => {
  const raw = localStorage.getItem(RECENT_PLACES_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as UpdateMyStartPlaceRequest[];
  return Array.isArray(parsed) ? parsed : [];
};

const saveRecentPlaces = (places: UpdateMyStartPlaceRequest[]) => {
  localStorage.setItem(RECENT_PLACES_KEY, JSON.stringify(places));
};

const upsertRecentPlace = (place: UpdateMyStartPlaceRequest): UpdateMyStartPlaceRequest[] => {
  const current = loadRecentPlaces();
  const next = [place, ...current.filter((p) => p.address !== place.address)].slice(0, MAX_RECENTS);
  saveRecentPlaces(next);
  return next;
};

export default function PlaceInputPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const location = useLocation();

  const { id } = useMeetingContext();
  const { mutate: savePlace, isPending } = useUpdateMyStartPlace(id);

  const state = (location.state as LocationState | null) ?? null;

  // 이전 페이지(주소 검색/지도 확인)에서 선택된 장소
  const incomingSelected = state?.selectedPlace ?? null;

  // 어디서 왔는지
  const from: FromPage | undefined = state?.from;

  // 저장된 내 출발지 캐시를 첫 렌더에서만 읽기
  const [cachedMyPlace] = useState<UpdateMyStartPlaceRequest | null>(() =>
    loadMyStartPlaceCache(id),
  );

  // 유저가 최근목록을 눌러 새로 고르면 그 값이 우선됨
  const [picked, setPicked] = useState<UpdateMyStartPlaceRequest | null>(null);

  const [recentPlaces, setRecentPlaces] = useState<UpdateMyStartPlaceRequest[]>(() =>
    loadRecentPlaces(),
  );

  // 우선순위:
  // 1) 사용자가 이번 세션에서 찍은 값(picked)
  // 2) 검색/지도에서 넘어온 값(incomingSelected)
  // 3) 마지막 저장된 내 출발지(cachedMyPlace)
  const selected: UpdateMyStartPlaceRequest | null = picked ?? incomingSelected ?? cachedMyPlace;

  const handleSelectRecent = (place: UpdateMyStartPlaceRequest) => {
    setPicked(place);
  };

  const goBackByFrom = () => {
    if (!code) return navigate(-1);

    if (from === 'join') return navigate(`/meeting/${code}/join`);
    if (from === 'main') return navigate(`/meeting/${code}`);
    return navigate(-1);
  };

  const handleSave = () => {
    if (!selected) return;

    savePlace(selected, {
      onSuccess: () => {
        // 최근 목록 갱신
        const next = upsertRecentPlace(selected);
        setRecentPlaces(next);

        // 내 출발지 캐시 갱신 (다음에 PlaceInputPage 들어오면 이게 바로 뜸)
        saveMyStartPlaceCache(id, selected);

        goBackByFrom();
      },
    });
  };

  const goToAddressSearch = () => {
    navigate(`/meeting/${code}/input/place/search`, { state: { from } satisfies LocationState });
  };

  const goToConfirmOnMap = () => {
    navigate(`/meeting/${code}/input/place/confirm`, { state: { from } satisfies LocationState });
  };

  const currentPlaceList = useMemo(() => recentPlaces, [recentPlaces]);

  return (
    <AppLayout
      header={<Header title="출발지 입력" onBack={goBackByFrom} />}
      bottom={
        <div className="-mx-4 -mb-4">
          <div className="space-y-3 bg-gray-100 px-4 pt-3 pb-4">
            <SelectedPlaceSummary selected={selected} />

            <FixedBottomButton
              onClick={handleSave}
              disabled={!selected || isPending}
              loading={isPending}
              className="bg-greedy hover:bg-greedy/50 text-white"
            >
              저장하기
            </FixedBottomButton>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <PlaceSearchBar onClick={goToAddressSearch} />
        <UseCurrentLocationCard onClick={goToConfirmOnMap} />
        <RecentPlaceList places={currentPlaceList} onSelect={handleSelectRecent} />
      </div>
    </AppLayout>
  );
}
