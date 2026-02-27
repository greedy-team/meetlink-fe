import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Clock, MapPin } from 'lucide-react';

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
import { Label } from '@/components/ui/label';
import { useUpdateMeetingDetail } from '@/hooks/useMeeting';
import { useLeaveMeeting } from '@/hooks/useParticipant';

import { DateTypeSelector } from '@/features/meeting/setting/DateTypeSelector';
import { LeaveButton } from '@/features/meeting/setting/LeaveButton';
import { MeetingNameInput } from '@/features/meeting/setting/MeetingNameInput';
import { PlaceTypeSelector } from '@/features/meeting/setting/PlaceTypeSelector';
import { RecommendCheckBox } from '@/features/meeting/setting/RecommendCheckBox';
import { TimeRangeSlider } from '@/features/meeting/setting/TimeRangeSlider';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function SettingPage() {
  const { code } = useParams<{ code: string }>();
  const {
    meetingName: initialMeetingName,
    isTimeRecommendEnabled: initialIsTimeRecommendEnabled,
    isPlaceRecommendEnabled: initialIsPlaceRecommendEnabled,
    dateType: initialDateType,
    timeRange: initialTimeRange,
    //placeType: initialPlaceType,
  } = useMeetingContext();
  const { mutate: updateMeeting } = useUpdateMeetingDetail();
  const { mutate: leaveMeeting } = useLeaveMeeting();

  const [meetingName, setMeetingName] = useState(initialMeetingName);
  const [isTimeRecommendEnabled, setIsTimeRecommendEnabled] = useState(
    initialIsTimeRecommendEnabled,
  );
  const [isPlaceRecommendEnabled, setIsPlaceRecommendEnabled] = useState(
    initialIsPlaceRecommendEnabled,
  );
  const [dateType, setDateType] = useState(initialDateType);
  const [timeRange, setTimeRange] = useState(initialTimeRange);
  const [placeType, setPlaceType] = useState('FAIR');

  const navigate = useNavigate();

  const handleLeave = () => {
    leaveMeeting(undefined, {
      onSuccess: (data) => {
        console.log('모임 나가기 성공!', data);
        navigate(`/meeting/${code}/join`);
      },
      onError: (error) => {
        console.error('모임 나가기 실패:', error);
        // 사용자에게 에러 알리기
      },
    });
  };

  const handleSave = () => {
    const formatTime = (hour: number) => `${String(hour).padStart(2, '0')}:00:00`;
    const requestData = {
      name: meetingName,
      enableTimeRecommendation: isTimeRecommendEnabled,
      enablePlaceRecommendation: isPlaceRecommendEnabled,
      timeAvailabilityType: dateType,
      timeRangeStart: formatTime(timeRange[0]),
      timeRangeEnd: timeRange[1] === 24 ? '23:59:59' : formatTime(timeRange[1]),
    };

    // mutate 호출 시 콜백 추가
    updateMeeting(requestData, {
      onSuccess: (data) => {
        console.log('수정 성공! 반환 데이터:', data);
        navigate(`/meeting/${code}`);
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
  //placeType != initialPlaceType;

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
                  <AlertDialogFooter className="flex-row gap-2">
                    <AlertDialogCancel className="rounded-xl border-2 bg-white hover:bg-gray-300">
                      취소
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSave}
                      className="bg-greedy! hover:bg-greedy/50! rounded-xl text-white"
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
        >
          <DateTypeSelector value={dateType} onChange={setDateType} />
          <TimeRangeSlider value={timeRange} onValueChange={setTimeRange} />
        </RecommendCheckBox>

        <RecommendCheckBox
          icon={MapPin}
          title="장소 추천 받기"
          description="참여자들의 출발지를 바탕으로 만남 장소를 추천해요"
          checked={isPlaceRecommendEnabled}
          onCheckedChange={setIsPlaceRecommendEnabled}
        >
          <PlaceTypeSelector value={placeType} onChange={setPlaceType} />
        </RecommendCheckBox>

        <NotifyBox variant="emphasis" className="mt-3">
          변경 사항은 모두에게 적용됩니다.
        </NotifyBox>

        <LeaveButton onLeave={handleLeave} />
      </div>
    </AppLayout>
  );
}
