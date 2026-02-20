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

// UI 확인용 목데이터
const MOCK_RECENTS: UpdateMyStartPlaceRequest[] = [
  { address: '서울 강남구 테헤란로 123', latitude: '37.5012', longitude: '127.0396' },
  { address: '서울 서초구 서초대로 234', latitude: '37.4929', longitude: '127.0144' },
  { address: '인천 연수구 송도과학로 56', latitude: '37.3850', longitude: '126.6440' },
];

type LocationState = {
  selectedPlace?: UpdateMyStartPlaceRequest;
};

export default function PlaceInputPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const location = useLocation();

  const { id } = useMeetingContext();
  const { mutate: savePlace, isPending } = useUpdateMyStartPlace(id);

  // 이전 페이지(주소 검색)에서 선택된 장소 정보 (있을 때만)
  const incomingSelected = (location.state as LocationState | null)?.selectedPlace;

  // 유저가 최근목록을 눌러 새로 고르면 그 값이 우선됨
  const [picked, setPicked] = useState<UpdateMyStartPlaceRequest | null>(null);

  const currentPlaceList = useMemo(() => MOCK_RECENTS, []);

  const selected: UpdateMyStartPlaceRequest | null = picked ?? incomingSelected ?? null;

  const handleSelectRecent = (place: UpdateMyStartPlaceRequest) => {
    setPicked(place);
  };

  const handleSave = () => {
    if (!selected) return;
    savePlace(selected);
  };

  const goToAddressSearch = () => {
    navigate(`/meeting/${code}/input/place/search`);
  };

  const goToConfirmOnMap = () => {
    navigate(`/meeting/${code}/input/place/confirm`);
  };

  return (
    <AppLayout
      header={<Header title="출발지 입력" />}
      bottom={
        <div className="-mx-4 -mb-4">
          {/* 회색 배경 영역 */}
          <div className="space-y-3 bg-gray-100 px-4 pt-3 pb-4">
            <SelectedPlaceSummary selected={selected} />

            <FixedBottomButton
              onClick={handleSave}
              disabled={!selected}
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
