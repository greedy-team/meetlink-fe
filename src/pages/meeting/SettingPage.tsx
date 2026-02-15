import { useState } from 'react';

import { Clock } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { LogOut } from 'lucide-react';

import { NotifyBox } from '@/components/common/general/NotifyBox';
import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useUpdateMeetingDetail } from '@/hooks/useMeeting';

import { DateTypeSelector } from '@/features/meeting/setting/DateTypeSelector';
import { MeetingNameInput } from '@/features/meeting/setting/MeetingNameInput';
import { RecommendCheckBox } from '@/features/meeting/setting/RecommendCheckBox';
import { TimeRangeSlider } from '@/features/meeting/setting/TimeRangeSlider';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function SettingPage() {
  const {
    meetingName: initialMeetingName,
    isTimeRecommendEnabled: initialIsTimeRecommendEnabled,
    isPlaceRecommendEnabled: initialIsPlaceRecommendEnabled,
    dateType: initialDateType,
    timeRange: initialTimeRange,
  } = useMeetingContext();

  const [meetingName, setMeetingName] = useState(initialMeetingName);
  const [isTimeRecommendEnabled, setIsTimeRecommendEnabled] = useState(
    initialIsTimeRecommendEnabled,
  );
  const [isPlaceRecommendEnabled, setIsPlaceRecommendEnabled] = useState(
    initialIsPlaceRecommendEnabled,
  );
  const [dateType, setDateType] = useState(initialDateType);
  const [timeRange, setTimeRange] = useState(initialTimeRange);

  const { mutate: updateMeeting } = useUpdateMeetingDetail();

  const handleSave = () => {
    updateMeeting({
      meetingName,
      isTimeRecommendEnabled,
      isPlaceRecommendEnabled,
      dateType,
      timeRange,
    });
  };

  return (
    <AppLayout
      header={<Header title="모임 설정" showBackButton={true} showSettingButton={false} />}
      pageBackgroundClassName="bg-white"
      bottom={
        <div className="mx-3 flex flex-row gap-3 pt-2">
          <div className="flex-1">
            <FixedBottomButton className="h-17 rounded-4xl border-2 bg-white text-xl text-black hover:bg-gray-300">
              취소
            </FixedBottomButton>
          </div>
          <div className="flex-1">
            <FixedBottomButton className="bg-greedy hover:bg-greedy/50 h-17 rounded-4xl text-xl">
              완료
            </FixedBottomButton>
          </div>
        </div>
      }
    >
      <div className="mx-3 flex flex-col gap-2">
        <MeetingNameInput value={meetingName} onChange={(e) => setMeetingName(e.target.value)} />
        <div className="h-2" />
        <Label htmlFor="meeting-setting" className="ml-1 text-base font-semibold text-gray-700">
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
            <div className="h-1" />
          </div>
        )}

        <RecommendCheckBox
          icon={MapPin}
          title="장소 추천 받기"
          description="참여자들의 출발지를 바탕으로 만남 장소를 추천해요"
          checked={isPlaceRecommendEnabled}
          onCheckedChange={setIsPlaceRecommendEnabled}
        />

        <NotifyBox variant="emphasis" className="mt-3">
          변경 사항은 모두에게 적용됩니다.
        </NotifyBox>

        <Button
          variant="ghost"
          className={cn(
            'bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600',
            'my-3 h-18 w-full rounded-2xl py-3 font-semibold transition-all',
            'flex flex-row items-center justify-start gap-3',
          )}
        >
          <div className="w-1" />
          <LogOut
            size={22}
            strokeWidth={2.5}
            className="h-auto! w-auto! shrink-0 transition-colors"
          />
          <span className="text-xl">모임 나가기</span>
        </Button>
      </div>
    </AppLayout>
  );
}
