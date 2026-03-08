import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { loadRecentPlaces, type RecentPlaceItem, upsertRecentPlace } from '@/lib/recentPlaces';
import { useGetMyStartPlace, useUpdateMyStartPlace } from '@/hooks/usePlace';

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

export default function PlaceInputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { code } = useParams<{ code: string }>();

  const { selectedPlace, setSelectedPlace } = useMeetingContext();

  const { mutate: savePlace, isPending } = useUpdateMyStartPlace();

  const { data: myStartPlaceData, isSuccess: isGetPlaceSuccess } = useGetMyStartPlace();

  const state = (location.state as LocationState | null) ?? null;
  // 이전 페이지(주소 검색/지도)에서 선택된 장소
  const incomingSelected = state?.selectedPlace ?? null;
  const from: FromPage | undefined = state?.from;

  const [recentPlaces, setRecentPlaces] = useState<RecentPlaceItem[]>(() => loadRecentPlaces());

  useEffect(() => {
    if (incomingSelected) {
      // 1순위: 주소 검색/지도에서 방금 선택해서 넘어온 장소가 있으면 그걸 세팅
      setSelectedPlace(incomingSelected);

      // 무한 덮어쓰기 방지 위해 URL에서 selectedPlace 정보 제거
      navigate(location.pathname, {
        replace: true,
        state: { ...(state || {}), selectedPlace: undefined },
      });
    }
    // 2순위: 고른 장소도 없고, 서버에서 내 출발지를 성공적으로 가져왔다면?
    else if (!selectedPlace?.address && isGetPlaceSuccess && myStartPlaceData?.result?.address) {
      setSelectedPlace({
        name: myStartPlaceData.result.name,
        address: myStartPlaceData.result.address,
        latitude: myStartPlaceData.result.latitude,
        longitude: myStartPlaceData.result.longitude,
      });
    }
  }, [
    incomingSelected,
    isGetPlaceSuccess,
    myStartPlaceData,
    selectedPlace?.address,
    setSelectedPlace,
    navigate,
    location.pathname,
    state,
  ]);

  const handleSelectRecent = (place: UpdateMyStartPlaceRequest) => {
    setSelectedPlace(place);
  };

  const goBackByFrom = () => {
    if (!code) return navigate(-1);
    if (from === 'join') return navigate(`/meeting/${code}/join`);
    if (from === 'main') return navigate(`/meeting/${code}`);
    return navigate(`/meeting/${code}`);
  };

  const handleSave = () => {
    if (!selectedPlace || !selectedPlace.address) return;
    const token = localStorage.getItem('meeting_token');

    const next = upsertRecentPlace(selectedPlace as RecentPlaceItem);
    setRecentPlaces(next);

    if (token) {
      const requestPayload = {
        name: selectedPlace.name || selectedPlace.address,
        address: selectedPlace.address,
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
      };

      savePlace(requestPayload, {
        onSuccess: () => {
          toast.success('출발지 등록 완료!', {
            description: '출발지가 정상적으로 등록되었습니다',
            icon: <CheckCircle2 className="text-greedy h-5 w-5" />,
          });
          goBackByFrom();
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            //실패 토스트
            toast.error('오류 발생!', {
              description: error.message,
              icon: <AlertCircle className="h-5 w-5 text-red-500" />,
            });
          } else {
            //실패 토스트
            toast.error('오류 발생!', {
              description: '인터넷 연결 상태를 확인해보세요!',
              icon: <AlertCircle className="h-5 w-5 text-red-500" />,
            });
          }
        },
      });
    } else {
      goBackByFrom();
    }
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
        <FixedBottomButton
          onClick={handleSave}
          disabled={!selectedPlace?.address || isPending}
          loading={isPending}
          className="bg-greedy hover:bg-greedy/50 text-white"
        >
          저장하기
        </FixedBottomButton>
      }
    >
      <div className="space-y-4">
        <PlaceSearchBar onClick={goToAddressSearch} />
        <UseCurrentLocationCard onClick={goToConfirmOnMap} />
        <SelectedPlaceSummary selected={selectedPlace} />
        <RecentPlaceList places={currentPlaceList} onSelect={handleSelectRecent} />
      </div>
    </AppLayout>
  );
}
