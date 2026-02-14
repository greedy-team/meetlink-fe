import { useState } from 'react';

import { useUpdateMeetingDetail } from '@/hooks/useMeeting';

import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function SettingPage() {
  const {
    meetingName: initialMeetingName,
    isTimeRecommendEnabled: initialIsTimeRecommendEnabled,
    isPlaceRecommendEnabled: initialIsPlaceRecommendEnabled,
    dateType: initialDateType,
    timeRange: initialTimeRange,
  } = useMeetingContext();

  const [meetingName, setMeetingName] = useState(initialMeetingName);
  const [isTimeRecommendEnabled, setIsTimeRecommendEnabled] = useState(
    initialIsTimeRecommendEnabled,
  );
  const [isPlaceRecommendEnabled, setIsPlaceRecommendEnabled] = useState(
    initialIsPlaceRecommendEnabled,
  );
  const [dateType, setDateType] = useState(initialDateType);
  const [timeRange, setTimeRange] = useState(initialTimeRange);

  const { mutate: updateMeeting } = useUpdateMeetingDetail();

  const handleSave = () => {
    updateMeeting({
      meetingName,
      isTimeRecommendEnabled,
      isPlaceRecommendEnabled,
      dateType,
      timeRange,
    });
  };

  return (
    <div>
      <div></div>
      setting
    </div>
  );
}
