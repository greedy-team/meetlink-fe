import { useNavigate } from 'react-router-dom';

import { Clock } from 'lucide-react';
import { MapPin } from 'lucide-react';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { GoToButton } from '@/features/meeting/general/GotoButton';
import { ParticipantStatusList } from '@/features/meeting/general/ParticipantSatusList';
import { RecommendSummaryCard } from '@/features/meeting/general/RecommendSummaryCard';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';
import { type ParticipantList } from '@/types/meetingTypes';

export default function MainPage() {
  const {
    meetingName,
    isTimeRecommendEnabled,
    isPlaceRecommendEnabled,
    participantStatusList,
    recommendTimeList,
    recommendPlaceList,
  } = useMeetingContext();

  const bestRecommendedTime = recommendTimeList?.[0];
  const bestRecommendedPlace = recommendPlaceList?.[0];

  const navigate = useNavigate();
  const handleGoToButton = (url: string) => {
    navigate(url);
  };

  const dummyList: ParticipantList = [
    { nickName: '강건', hasTimeInput: true, hasPlaceInput: true },
    { nickName: '민지', hasTimeInput: true, hasPlaceInput: false },
    { nickName: '민주', hasTimeInput: false, hasPlaceInput: false },
    { nickName: '철수', hasTimeInput: true, hasPlaceInput: true },
    { nickName: '영희', hasTimeInput: false, hasPlaceInput: true },
  ];
  const completedCount = dummyList.filter((p) => p.hasTimeInput && p.hasPlaceInput).length;
  const totalCount = dummyList.length;

  return (
    <AppLayout
      header={<Header title={'그리디'} showBackButton={false} showSettingButton={true} />}
      pageBackgroundClassName="bg-white"
      bottom={
        <div className="flex items-center pt-2">
          <FixedBottomButton className="bg-greedy hover:bg-greedy/50 mx-auto h-17 w-95/100 rounded-4xl text-xl">
            초대 링크 공유하기
          </FixedBottomButton>
        </div>
      }
    >
      <div className="mx-3 flex flex-col gap-4">
        <div className="px-1">
          <RecommendSummaryCard
            isTimeRecommendEnabled={true}
            isPlaceRecommendEnabled={true}
            bestTime={bestRecommendedTime}
            bestPlace={bestRecommendedPlace}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="meeting-todo" className="ml-1 text-base font-semibold text-gray-700">
            내가 할 일
          </Label>
          <GoToButton
            icon={Clock}
            title="가능한 시간 선택하기"
            description="모임 만남 시간을 추천하는데 활용돼요."
            onClick={() => handleGoToButton('input/time')}
          />
          <GoToButton
            icon={MapPin}
            title="출발지 입력하기"
            description="모임 만남 장소를 추천하는데 활용돼요."
            onClick={() => handleGoToButton('input/place')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <Label
              htmlFor="meeting-participant"
              className="ml-1 text-base font-semibold text-gray-700"
            >
              참여자 현황
            </Label>
            <div className="flex items-center justify-center rounded-full bg-[#3e8e41] px-3 py-1 text-sm font-semibold text-white shadow-sm">
              {completedCount}/{totalCount} 입력 완료
            </div>
          </div>
          <ParticipantStatusList list={dummyList || []} />
        </div>
      </div>
    </AppLayout>
  );
}
