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
  const incomingSelected = state?.selectedPlace ?? null;
  const from: FromPage | undefined = state?.from;

  const [recentPlaces, setRecentPlaces] = useState<RecentPlaceItem[]>(() => loadRecentPlaces());

  // 편집용 임시 상태
  const [draftSelectedPlace, setDraftSelectedPlace] =
    useState<UpdateMyStartPlaceRequest>(selectedPlace);

  // context에 저장된 값이 바뀌면 draft도 맞춰줌
  useEffect(() => {
    setDraftSelectedPlace(selectedPlace);
  }, [selectedPlace]);

  useEffect(() => {
    if (incomingSelected) {
      // 주소 검색/지도에서 방금 선택해서 넘어온 장소는 draft에만 반영
      setDraftSelectedPlace(incomingSelected);

      // 무한 덮어쓰기 방지 위해 history state에서 selectedPlace 제거
      navigate(location.pathname, {
        replace: true,
        state: { ...(state || {}), selectedPlace: undefined },
      });
    } else if (
      !incomingSelected &&
      !selectedPlace?.address &&
      isGetPlaceSuccess &&
      myStartPlaceData?.result?.address
    ) {
      // 저장된 context 값이 아직 없을 때만 서버값으로 draft 초기화
      setDraftSelectedPlace({
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
    navigate,
    location.pathname,
    state,
  ]);

  const handleSelectRecent = (place: UpdateMyStartPlaceRequest) => {
    setDraftSelectedPlace(place);
  };

  const goBackByFrom = () => {
    if (!code) return navigate(-1);
    if (from === 'join') return navigate(`/meeting/${code}/join`);
    if (from === 'main') return navigate(`/meeting/${code}`);
    return navigate(`/meeting/${code}`);
  };

  const handleSave = () => {
    if (!draftSelectedPlace || !draftSelectedPlace.address) return;

    const token = localStorage.getItem('meeting_token');

    const next = upsertRecentPlace(draftSelectedPlace as RecentPlaceItem);
    setRecentPlaces(next);

    if (token) {
      const requestPayload = {
        name: draftSelectedPlace.name || draftSelectedPlace.address,
        address: draftSelectedPlace.address,
        latitude: draftSelectedPlace.latitude,
        longitude: draftSelectedPlace.longitude,
      };

      savePlace(requestPayload, {
        onSuccess: () => {
          // 저장 성공한 경우에만 context 반영
          setSelectedPlace(draftSelectedPlace);

          toast.success('출발지 등록 완료!', {
            description: '출발지가 정상적으로 등록되었어요',
            icon: <CheckCircle2 className="text-greedy h-5 w-5" />,
          });

          goBackByFrom();
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error('오류 발생!', {
              description: error.message,
              icon: <AlertCircle className="h-5 w-5 text-red-500" />,
            });
          } else {
            toast.error('오류 발생!', {
              description: '인터넷 연결 상태를 확인해보세요!',
              icon: <AlertCircle className="h-5 w-5 text-red-500" />,
            });
          }
        },
      });
    } else {
      // join 전에는 서버 저장 없이 context에만 반영
      setSelectedPlace(draftSelectedPlace);
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
          disabled={!draftSelectedPlace?.address || isPending}
          loading={isPending}
          className="bg-greedy hover:bg-greedy/50 border-greedy-strong border-2 text-white"
        >
          저장하기
        </FixedBottomButton>
      }
    >
      <div className="space-y-4">
        <PlaceSearchBar onClick={goToAddressSearch} />
        <UseCurrentLocationCard onClick={goToConfirmOnMap} />
        <SelectedPlaceSummary selected={draftSelectedPlace} />
        <RecentPlaceList places={currentPlaceList} onSelect={handleSelectRecent} />
      </div>
    </AppLayout>
  );
}
