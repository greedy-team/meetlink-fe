import { useState } from 'react';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { useUpdateMyAvailableTime } from '@/hooks/useTime';

import { useMeetingContext } from '@/pages/meeting/MeetingLayout';
import { type SelectedTime } from '@/types/meetingTypes';

export default function TimeInputPage() {
  const { dateType, timeRange, id } = useMeetingContext();

  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedTimeList, setSelectedTimeList] = useState<SelectedTime[]>([]);

  const { mutate: saveTime } = useUpdateMyAvailableTime(id);

  // const handleSave = () => {
  //   saveTime({
  //     //myTimeList: selectedTimeList,
  //   });
  // };

  return (
    <AppLayout
      header={<Header title="가능 시간 선택" showBackButton={true} showSettingButton={false} />}
      pageBackgroundClassName="bg-gray-100/70"
      bottom={
        <div className="space-y-3">
          <FixedBottomButton>저장하기</FixedBottomButton>
        </div>
      }
    >
      <div className="space-y-4"></div>
    </AppLayout>
  );
}
