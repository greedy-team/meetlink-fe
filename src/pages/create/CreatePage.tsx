import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Clock } from 'lucide-react';
import { MapPin } from 'lucide-react';

import { NotifyBox } from '@/components/common/general/NotifyBox';
import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCreateMeeting } from '@/hooks/useMeeting';

import { DateTypeSelector } from '@/features/meeting/setting/DateTypeSelector';
import { MeetingNameInput } from '@/features/meeting/setting/MeetingNameInput';
import { RecommendCheckBox } from '@/features/meeting/setting/RecommendCheckBox';
import { TimeRangeSlider } from '@/features/meeting/setting/TimeRangeSlider';

export default function CreatePage() {
  //모임 설정값
  const [meetingName, setMeetingName] = useState('');
  const [isTimeRecommendEnabled, setIsTimeRecommendEnabled] = useState(false);
  const [dateType, setDateType] = useState('WEEKLY');
  const [timeRange, setTimeRange] = useState<[number, number]>([12, 18]);
  const [isPlaceRecommendEnabled, setIsPlaceRecommendEnabled] = useState(false);

  //모임 생성 뮤테이션
  const { mutate: createMeeting } = useCreateMeeting();

  //미팅 이름 입력 여부
  const [meetingNameInputFinished, setMeetingNameInputFinished] = useState(false);

  if (meetingName.trim().length <= 0 && meetingNameInputFinished === true) {
    setMeetingNameInputFinished(false);
  }

  const handleMeetingNameInput = () => {
    if (meetingName.trim().length <= 0) {
      setMeetingNameInputFinished(false);
      document.getElementById('meeting-name')?.focus();
    } else {
      setMeetingNameInputFinished(true);
    }
  };

  const navigate = useNavigate();

  //모임 생성 버튼 클릭 핸들
  const handleCreateClick = () => {
    const formatTime = (hour: number) => {
      const adjustedHour = hour >= 24 ? 23 : hour; // 24:00:00 시간이 존재하지 않는 오류 방지
      return `${String(adjustedHour).padStart(2, '0')}:00:00`;
    };

    //서버 요청 데이터 - 모임 설정값
    const requestData = {
      name: meetingName,
      enableTimeRecommendation: isTimeRecommendEnabled,
      enablePlaceRecommendation: isPlaceRecommendEnabled,
      timeAvailabilityType: dateType,
      timeRangeStart: formatTime(timeRange[0]),
      timeRangeEnd: formatTime(timeRange[1]),
    };

    //뮤테이션
    createMeeting(requestData, {
      onSuccess: (data) => {
        //성공시
        if (data.status && data.result) {
          navigate(`/share/${data.result.code}`);
        }
      },
      onError: (error) => {
        console.error('4. 에러 발생:', error);
      },
    });
  };

  //모임 생성 버튼 활성화 조건
  const isFormValid =
    meetingName.trim().length > 0 && // 이름 입력 필수
    (isTimeRecommendEnabled || isPlaceRecommendEnabled) && // 추천 기능 중 하나는 필수
    (!isTimeRecommendEnabled || (isTimeRecommendEnabled && dateType)); // 시간 추천이 없거나 | 있으면 dateType도 있어야 됨.

  return (
    <AppLayout
      header={
        <div className="mx-8 mt-8 mb-5 flex flex-col gap-2 text-left">
          <div className="text-3xl font-bold">모임 만들기</div>
          <div className="text-gray-500">모임을 만드는데 필요한 기본 정보를 설정해요</div>
        </div>
      }
      pageBackgroundClassName="bg-white"
      bottom={
        <div className="flex flex-col items-center">
          {isFormValid && (
            <FixedBottomButton
              className="bg-greedy hover:bg-greedy/50"
              onClick={handleCreateClick}
              disabled={!isFormValid}
            >
              모임 생성하기
            </FixedBottomButton>
          )}
        </div>
      }
    >
      <div className="mx-3 flex flex-col gap-2">
        <div>
          {/** 미팅 이름 입력 */}
          <MeetingNameInput value={meetingName} onChange={(e) => setMeetingName(e.target.value)} />
          {!meetingNameInputFinished && meetingName.trim().length > 0 && (
            <Button
              className="bg-greedy hover:bg-greedy/50 h-12 w-full rounded-xl text-lg font-semibold text-white"
              onClick={handleMeetingNameInput}
            >
              다음
            </Button>
          )}
        </div>

        {meetingNameInputFinished && (
          <div className="flex flex-col gap-2">
            {/** 추천 기능 선택 */}
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
              <div className="mx-3 flex flex-col gap-5 rounded-b-4xl border-r-2 border-b-2 border-l-2 px-3">
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
            <NotifyBox className="mt-3">모임 초대 링크를 통해 바로 참여할 수 있어요</NotifyBox>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
