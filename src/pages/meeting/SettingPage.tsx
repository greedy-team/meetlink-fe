import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';
import { LogOut } from 'lucide-react';
import { AlertCircle, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

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
    isLoading,
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
      onSuccess: () => {
        toast.success('나가기 성공!', {
          description: '모임에서 성공적으로 나갔어요',
          icon: <CheckCircle2 className="text-greedy h-5 w-5" />,
        });
        navigate(`/meeting/${code}/join`);
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
  };

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
      onSuccess: () => {
        toast.success('수정 성공!', {
          description: '모임 설정이 정상적으로 수정되었어요',
          icon: <CheckCircle2 className="text-greedy h-5 w-5" />,
        });
        navigate(`/meeting/${code}`);
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
        !isLoading && (
          <div className="mx-3 flex flex-row gap-3 pt-2">
            <div className="flex-1">
              <FixedBottomButton
                className="border-2 bg-white text-black hover:bg-gray-100"
                onClick={() => navigate(`/meeting/${code}`)}
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
                  onClick={() => navigate(`/meeting/${code}`)}
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
                      <AlertDialogTitle>변경된 설정을 저장할까요?</AlertDialogTitle>
                      <AlertDialogDescription>
                        변경하신 정보는 모든 사용자에게 적용돼요
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row gap-2">
                      <AlertDialogCancel className="h-10 flex-1 cursor-pointer rounded-xl border-2 bg-white shadow-none! hover:bg-gray-100">
                        취소
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleSave}
                        className="bg-greedy! hover:bg-greedy/50! h-10 flex-1 cursor-pointer rounded-xl text-white shadow-none!"
                      >
                        저장하기
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        )
      }
    >
      <div className="flex flex-col gap-2">
        <MeetingNameInput
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
          isLoading={isLoading}
          placeholder=""
        />

        <div className="h-2" />

        <Label htmlFor="meeting-setting" className="text-base font-semibold">
          모임 설정
        </Label>

        <RecommendCheckBox
          icon={Clock}
          title="시간 추천 받기"
          description="참여자들의 가능 시간을 바탕으로 만남 시각을 추천해요"
          checked={isTimeRecommendEnabled}
          onCheckedChange={setIsTimeRecommendEnabled}
          isLoading={isLoading}
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
          isLoading={isLoading}
        >
          <PlaceTypeSelector value={placeType} onChange={setPlaceType} />
        </RecommendCheckBox>

        {!isLoading && (
          <>
            <NotifyBox variant="emphasis" className="mt-3">
              변경 사항은 모두에게 적용되니 주의해주세요
            </NotifyBox>
            <LeaveButton onLeave={handleLeave}>
              <Button
                variant="ghost"
                className={cn(
                  'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600',
                  'my-3 h-14 w-full cursor-pointer rounded-2xl py-3 font-semibold transition-all',
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
            </LeaveButton>
          </>
        )}
      </div>
    </AppLayout>
  );
}
