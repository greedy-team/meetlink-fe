import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Clock } from 'lucide-react';
import { MapPin } from 'lucide-react';

import { NotifyBox } from '@/components/common/general/NotifyBox';
import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Label } from '@/components/ui/label';
import { useCreateMeeting, useUpdateMeetingDetail } from '@/hooks/useMeeting';

import { DateTypeSelector } from '@/features/meeting/setting/DateTypeSelector';
import { MeetingNameInput } from '@/features/meeting/setting/MeetingNameInput';
import { RecommendCheckBox } from '@/features/meeting/setting/RecommendCheckBox';
import { TimeRangeSlider } from '@/features/meeting/setting/TimeRangeSlider';

export default function CreatePage() {
  const [meetingName, setMeetingName] = useState('');
  const [isTimeRecommendEnabled, setIsTimeRecommendEnabled] = useState(false);
  const [dateType, setDateType] = useState('');
  const [timeRange, setTimeRange] = useState<[number, number]>([6, 18]);
  const [isPlaceRecommendEnabled, setIsPlaceRecommendEnabled] = useState(false);

  const { mutate: createMeeting } = useCreateMeeting();
  const [code, setCode] = useState('');
  const { mutate: updateMeetingDetail } = useUpdateMeetingDetail(code);

  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate('share');
  };

  return (
    <AppLayout
      header={
        <div className="mx-8 my-6 flex flex-col gap-2 text-left">
          <div className="text-3xl font-bold">모임 만들기</div>
          <div className="text-gray-500">모임을 만드는데 필요한 기본 정보를 설정해요</div>
        </div>
      }
      pageBackgroundClassName="bg-white"
      bottom={
        <div className="flex items-center pt-2">
          <FixedBottomButton
            className="bg-greedy hover:bg-greedy/50 mx-auto h-17 w-95/100 rounded-4xl text-xl"
            onClick={handleCreateClick}
          >
            모임 생성하기
          </FixedBottomButton>
        </div>
      }
    >
      <div className="mx-3 flex flex-col gap-2">
        <MeetingNameInput value={meetingName} onChange={(e) => setMeetingName(e.target.value)} />
        <div className="h-2" />
        <Label htmlFor="meeting-name" className="ml-1 text-base font-semibold text-gray-700">
          모임 설정
        </Label>
        <RecommendCheckBox
          icon={Clock}
          title="시간 추천 받기"
          description="참여자들의 가능 시간을 바탕으로 만남 시각을 추천해요"
          checked={isTimeRecommendEnabled}
          onCheckedChange={setIsTimeRecommendEnabled}
        />
        {isTimeRecommendEnabled && (
          <div className="flex flex-col gap-5">
            <DateTypeSelector value={dateType} onChange={setDateType} />
            <TimeRangeSlider value={timeRange} onValueChange={setTimeRange} />
            <div className="h-3" />
          </div>
        )}

        <RecommendCheckBox
          icon={MapPin}
          title="장소 추천 받기"
          description="참여자들의 출발지를 바탕으로 만남 장소를 추천해요"
          checked={isPlaceRecommendEnabled}
          onCheckedChange={setIsPlaceRecommendEnabled}
        />

        <NotifyBox>모임 초대 링크를 통해 바로 참여할 수 있어요</NotifyBox>
      </div>
    </AppLayout>
  );
}
