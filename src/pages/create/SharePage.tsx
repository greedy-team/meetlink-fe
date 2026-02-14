import { useGetMeetingDetail } from '@/hooks/useMeeting';

export default function SharePage() {
  const { data: meetingData, isLoading: isMeetingLoading } = useGetMeetingDetail();

  const meetingName = meetingData?.meetingName || '';
  const isTimeRecommendEnabled = meetingData?.isTimeRecommendEnabled || false;
  const isPlaceRecommendEnabled = meetingData?.isPlaceRecommendEnabled || false;
  const dateType = meetingData?.dateType || '';
  const timeRange = meetingData?.timeRange || '';

  return (
    <div>
      <div></div>
      share
    </div>
  );
}
