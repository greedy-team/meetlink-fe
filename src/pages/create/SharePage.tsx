import { useNavigate } from 'react-router-dom';

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
    <button
      onClick={handleGoToMeeting}
      disabled={!code} // 코드가 없으면 비활성화
      className="bg-greedy w-full rounded-xl py-4 font-bold text-white disabled:bg-gray-300"
    >
      모임 페이지로 이동하기
    </button>
  );
}
