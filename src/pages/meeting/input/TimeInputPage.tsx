import { useState } from 'react';

import { useUpdateMyAvailableTime } from '@/hooks/useTime';

import { useMeetingContext } from '@/pages/meeting/MeetingLayout';
import { type SelectedTime } from '@/types/meetingTypes';

export default function TimeInputPage() {
  const { dateType, timeRange, id } = useMeetingContext();

  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedTimeList, setSelectedTimeList] = useState<SelectedTime[]>([]);

  const { mutate: saveTime } = useUpdateMyAvailableTime(id);

  const handleSave = () => {
    saveTime({
      myTimeList: selectedTimeList,
    });
  };

  return (
    <div>
      <div></div>
      timeinput
    </div>
  );
}
