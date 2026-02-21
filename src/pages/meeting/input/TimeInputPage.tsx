import { useMemo, useState } from 'react';

import { format, startOfWeek } from 'date-fns';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { useUpdateMyAvailableTime } from '@/hooks/useTime';

import TimeHeader from '@/features/Time/TimeHeader';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';
import { type SelectedTime } from '@/types/meetingTypes';

export default function TimeInputPage() {
  const { dateType, timeRange, id } = useMeetingContext();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeList, setSelectedTimeList] = useState<SelectedTime[]>([]);

  const { mutate: saveTime } = useUpdateMyAvailableTime(id);

  const firstDate: string | number = useMemo(() => {
    if (dateType === 'WEEKLY') {
      return 0;
    } else {
      const sunday = startOfWeek(selectedDate, { weekStartsOn: 0 }); // 0: 일요일 시작
      return format(sunday, 'yyyy-MM-dd');
    }
  }, [dateType, selectedDate]);

  // const handleSave = () => {
  //   saveTime({
  //     //myTimeList: selectedTimeList,
  //   });
  // };

  return (
    <AppLayout
      header={
        <div className="flex flex-col">
          <Header title="가능 시간 선택" showBackButton={true} showSettingButton={false} />
          <TimeHeader
            dateType={dateType}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
      }
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
