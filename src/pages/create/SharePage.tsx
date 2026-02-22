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
  const handleGoToMeeting = () => {
    if (code) {
      navigate(`/meeting/${code}`);
    } else {
      // 코드가 없을 경우에 대한 예외 처리
      console.error('모임 코드를 찾을 수 없습니다.');
    }
  };
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
          <FixedBottomButton className="bg-greedy hover:bg-greedy/50" onClick={handleGoToMeeting}>
            모임 생성하기
          </FixedBottomButton>
        </div>
      }
    >
      <div className="mx-3 flex flex-col gap-2"></div>
    </AppLayout>
  );
}
