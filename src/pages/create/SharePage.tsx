import { useNavigate } from 'react-router-dom';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Label } from '@/components/ui/label';
import { useGetMeetingDetail } from '@/hooks/useMeeting';

export default function SharePage() {
  const { data: meetingData, isLoading: isMeetingLoading } = useGetMeetingDetail();

  const meetingName = meetingData?.result?.name || '';
  const isTimeRecommendEnabled = meetingData?.result?.enableTimeRecommendation || false;
  const isPlaceRecommendEnabled = meetingData?.result?.enablePlaceRecommendation || false;
  const dateType = meetingData?.result?.timeAvailabilityType || '';
  const timeRange: [number, number] = [
    parseInt(meetingData?.result?.timeRangeStart?.split(':')[0] || '0', 10),
    parseInt(meetingData?.result?.timeRangeEnd?.split(':')[0] || '24', 10),
  ];
  const code = meetingData?.result?.code;
  const navigate = useNavigate();

  const handleShare = async () => {
    // 공유할 데이터 설정
    const shareData = {
      title: `MeetLink 모임 초대 : ${meetingName}`,
      text: '우리 언제 만날까요? 가능한 시간과 출발 위치를 입력해주세요!',
      url: window.location.href + '/join',
    };

    try {
      // 1. 브라우저가 Web Share API를 지원하고, 데이터 공유가 가능한지 확인
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        console.log('공유 성공!');
      } else {
        // 2. 지원하지 않는 브라우저(예: 일부 PC 브라우저)일 경우 클립보드 복사
        await navigator.clipboard.writeText(shareData.url);
        console.log('클립보드 복사 완료');
      }
    } catch (err) {
      // 사용자가 공유를 취소했을 때는 에러가 발생하므로 체크
      if ((err as Error).name !== 'AbortError') {
        console.error('공유 중 에러 발생:', err);
      }
    }
  };

  return (
    <AppLayout
      header={
        <div className="mx-8 mt-8 mb-5 flex flex-col gap-2 text-left">
          <div className="text-3xl font-bold">링크 공유하기</div>
          <div className="text-gray-500">생성한 모임 링크를 참여자에게 공유해보세요!</div>
        </div>
      }
      pageBackgroundClassName="bg-white"
      bottom={
        <div className="flex flex-col items-center">
          <FixedBottomButton className="bg-greedy hover:bg-greedy/50" onClick={handleShare}>
            모임 생성하기
          </FixedBottomButton>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="meeting-todo" className="ml-1 text-base font-semibold text-gray-700">
          내가 할 일
        </Label>
      </div>
    </AppLayout>
  );
}
