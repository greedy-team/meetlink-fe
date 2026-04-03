import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { AlertCircle, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

import { NotifyBox } from '@/components/common/general/NotifyBox';
import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCreateMeeting } from '@/hooks/useMeeting';

import { DateTypeSelector } from '@/features/meeting/setting/DateTypeSelector';
import { MeetingNameInput } from '@/features/meeting/setting/MeetingNameInput';
import { PlaceTypeSelector } from '@/features/meeting/setting/PlaceTypeSelector';
import { RecommendCheckBox } from '@/features/meeting/setting/RecommendCheckBox';
import { TimeRangeSlider } from '@/features/meeting/setting/TimeRangeSlider';

export default function CreatePage() {
  //모임 설정값
  const [meetingName, setMeetingName] = useState('');
  const [isTimeRecommendEnabled, setIsTimeRecommendEnabled] = useState(false);
  const [dateType, setDateType] = useState('WEEKLY');
  const [timeRange, setTimeRange] = useState<[number, number]>([12, 18]);
  const [isPlaceRecommendEnabled, setIsPlaceRecommendEnabled] = useState(false);
  const [placeType, setPlaceType] = useState('FAIR');

  //모임 생성 뮤테이션
  const { mutate: createMeeting, isPending } = useCreateMeeting();

  //미팅 이름 입력 여부
  const [meetingNameInputFinished, setMeetingNameInputFinished] = useState(false);

  const handleMeetingNameInput = () => {
    // 이름이 공백이거나 15자 초과면 막음
    if (meetingName.trim().length <= 0 || meetingName.length > 15) {
      setMeetingNameInputFinished(false);
      document.getElementById('meeting-name')?.focus();
    } else {
      setMeetingNameInputFinished(true);
    }
  };

  const navigate = useNavigate();

  //모임 생성 버튼 클릭 핸들
  const handleCreateClick = () => {
    const formatTime = (hour: number) => `${String(hour).padStart(2, '0')}:00:00`;
    //서버 요청 데이터 - 모임 설정값
    const requestData = {
      name: meetingName,
      enableTimeRecommendation: isTimeRecommendEnabled,
      enablePlaceRecommendation: isPlaceRecommendEnabled,
      timeAvailabilityType: dateType,
      timeRangeStart: formatTime(timeRange[0]),
      timeRangeEnd: formatTime(timeRange[1]),
    };

    createMeeting(requestData, {
      onSuccess: (data) => {
        if (!data?.result?.code) {
          //요청 데이터가 부족하면 요청을 보낼수 없기 때문에 발생할 일 없지만 방어로직
          toast.error('서버 응답이 이상해요', {
            description: data.message,
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          });
          return;
        }
        //성공 토스트
        toast.success('모임 생성 완료', {
          description: '링크를 공유해보세요',
          icon: <CheckCircle2 className="text-greedy h-5 w-5" />,
        });
        navigate(`/share/${data.result.code}`);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          //실패 토스트
          toast.error('오류가 발생했어요', {
            description: error.message,
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          });
        } else {
          //실패 토스트
          toast.error('오류가 발생했어요', {
            description: '잠시 후에 다시 시도해보세요',
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          });
        }
      },
    });
  };

  //모임 생성 버튼 활성화 조건
  const isCreateButtonEnabled =
    meetingName.trim().length > 0 && // 이름 입력 필수
    meetingName.length <= 15 && // 15자 이하
    (isTimeRecommendEnabled || isPlaceRecommendEnabled) && // 추천 기능 중 하나는 필수
    (!isTimeRecommendEnabled || (isTimeRecommendEnabled && dateType)) && // 시간 추천이 없거나 | 있으면 dateType도 있어야 됨.
    (!isPlaceRecommendEnabled || (isPlaceRecommendEnabled && placeType)); // 장소 추천이 없거나 있으면 placeType도 있어야 됨.

  return (
    <AppLayout
      header={
        <div className="mx-5 mt-8 mb-5 flex flex-col gap-2 text-left">
          <div className="text-3xl font-bold">모임 만들기</div>
          <div className="text-gray-500">모임을 만드는데 필요한 기본 정보를 설정해요</div>
        </div>
      }
      pageBackgroundClassName="bg-white"
      bottom={
        isCreateButtonEnabled ? (
          <div className="flex flex-col items-center">
            <FixedBottomButton
              className="bg-greedy hover:bg-greedy/50 border-greedy-strong border-2"
              onClick={handleCreateClick}
              disabled={!isCreateButtonEnabled}
              loading={isPending}
            >
              모임 생성하기
            </FixedBottomButton>
          </div>
        ) : null
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          {/** 미팅 이름 입력 */}
          <MeetingNameInput value={meetingName} onChange={(e) => setMeetingName(e.target.value)} />
          {!meetingNameInputFinished && meetingName.trim().length > 0 && (
            <Button
              className="bg-greedy hover:bg-greedy/50 border-greedy-strong h-12 w-full cursor-pointer rounded-xl border-2 text-base font-semibold"
              onClick={handleMeetingNameInput}
            >
              다음
            </Button>
          )}
        </div>

        {meetingNameInputFinished && (
          <div className="flex flex-col gap-2">
            {/** 추천 기능 선택 */}
            <Label htmlFor="meeting-setting" className="text-base font-semibold">
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
            {isCreateButtonEnabled && (
              <NotifyBox className="mt-3">모임 초대 링크를 통해 바로 참여할 수 있어요</NotifyBox>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
