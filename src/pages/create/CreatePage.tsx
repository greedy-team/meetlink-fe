import { useState } from 'react';

import { useCreateMeeting, useUpdateMeetingDetail } from '@/hooks/useMeeting';

export default function CreatePage() {
  const [meetingName, setMeetingName] = useState('');
  const [isTimeRecommendEnabled, setIsTimeRecommendEnabled] = useState(true);
  const [dateType, setDateType] = useState('DATE');
  const [timeRange, setTimeRange] = useState('');
  const [isPlaceRecommendEnabled, setIsPlaceRecommendEnabled] = useState(true);

  const { mutate: createMeeting } = useCreateMeeting;
  const [code, setCode] = useState('');
  const { mutate: updateMeetingDetail } = useUpdateMeetingDetail(code);

  return (
    <div>
      <div></div>create
    </div>
  );
}
