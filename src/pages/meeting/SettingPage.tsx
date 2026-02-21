import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Clock, LogOut, MapPin } from 'lucide-react';

import { NotifyBox } from '@/components/common/general/NotifyBox';
import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  const { mutate: updateMeeting } = useUpdateMeetingDetail();

  const [meetingName, setMeetingName] = useState(initialMeetingName);
  const [isTimeRecommendEnabled, setIsTimeRecommendEnabled] = useState(
    initialIsTimeRecommendEnabled,
  );
  const [isPlaceRecommendEnabled, setIsPlaceRecommendEnabled] = useState(
    initialIsPlaceRecommendEnabled,
  );
  const [dateType, setDateType] = useState(initialDateType);
  const [timeRange, setTimeRange] = useState(initialTimeRange);

  const navigate = useNavigate();

  const handleSave = () => {
    const formatTime = (hour: number) => `${String(hour).padStart(2, '0')}:00:00`;
    const requestData = {
      name: meetingName,
      enableTimeRecommendation: isTimeRecommendEnabled,
      enablePlaceRecommendation: isPlaceRecommendEnabled,
      timeAvailabilityType: dateType,
      timeRangeStart: formatTime(timeRange[0]),
      timeRangeEnd: formatTime(timeRange[1]),
    };

    // mutate 호출 시 콜백 추가
    updateMeeting(requestData, {
      onSuccess: (data) => {
        console.log('수정 성공! 반환 데이터:', data);
        navigate(-1);
      },
      onError: (error) => {
        console.error('수정 실패:', error);
      },
    });
  };

  const isFormValid =
    meetingName.trim().length > 0 && // 이름 입력 필수
    (isTimeRecommendEnabled || isPlaceRecommendEnabled) && // 하나는 선택
    (!isTimeRecommendEnabled || (isTimeRecommendEnabled && dateType));

  const hasChanges =
    meetingName !== initialMeetingName ||
    isTimeRecommendEnabled !== initialIsTimeRecommendEnabled ||
    isPlaceRecommendEnabled !== initialIsPlaceRecommendEnabled ||
    dateType !== initialDateType ||
    timeRange[0] !== initialTimeRange[0] ||
    timeRange[1] !== initialTimeRange[1];

  return (
    <AppLayout
      header={<Header title="모임 설정" showBackButton={true} showSettingButton={false} />}
      pageBackgroundClassName="bg-white"
      bottom={
        <div className="mx-3 flex flex-row gap-3 pt-2">
          <div className="flex-1">
            <FixedBottomButton
              className="border-2 bg-white text-xl text-black hover:bg-gray-300"
              onClick={() => navigate(-1)}
            >
              취소
            </FixedBottomButton>
          </div>
          <div className="flex-1">
            {!isFormValid ? (
              <FixedBottomButton className="pointer-events-none bg-gray-300 opacity-50" disabled>
                완료
              </FixedBottomButton>
            ) : !hasChanges ? (
              <FixedBottomButton
                className="bg-greedy hover:bg-greedy/50"
                onClick={() => navigate(-1)}
              >
                완료
              </FixedBottomButton>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <FixedBottomButton className="bg-greedy hover:bg-greedy/50">
                    완료
                  </FixedBottomButton>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[90%] rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>설정을 저장하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                      입력하신 정보는 모든 사용자에게 적용됩니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl border-none bg-gray-100 hover:bg-gray-200">
                      취소
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSave}
                      className="bg-greedy hover:bg-greedy/80 rounded-xl text-white"
                    >
                      저장하기
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
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
            'my-3 h-14 w-full rounded-2xl py-3 font-semibold transition-all',
            'flex flex-row items-center justify-start gap-3',
          )}
        >
          <div className="w-1" />
          <LogOut
            size={22}
            strokeWidth={2.5}
            className="h-auto! w-auto! shrink-0 transition-colors"
          />
          <span className="text-base">모임 나가기</span>
        </Button>
      </div>
    </AppLayout>
  );
}
