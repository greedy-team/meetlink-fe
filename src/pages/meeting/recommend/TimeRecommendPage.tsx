import { useState } from 'react';

import { useMeetingContext } from '@/pages/meeting/MeetingLayout';
import { type RecommendTime, type SelectedTime } from '@/types/meetingTypes';

export default function TimeRecommendPage() {
  const { dateType, timeRange, recommendTimeList, commonTimeList } = useMeetingContext();

  const [selectedWeek, setSelectedWeek] = useState('');

  return (
    <div>
      <div></div>timeresult
    </div>
  );
}
