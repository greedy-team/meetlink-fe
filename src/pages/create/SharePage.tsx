import { useGetMeetingDetail } from '@/hooks/useMeeting';

export default function SharePage() {
  const { data: meetingData, isLoading: isMeetingLoading } = useGetMeetingDetail();
  return (
    <div>
      <div></div>
      share
    </div>
  );
}
