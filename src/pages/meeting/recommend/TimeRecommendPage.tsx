import { useState } from 'react';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';

import TimeHeader from '@/features/Time/TimeHeader';
import TimeHeatMap from '@/features/Time/TimeHeapMap';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';
import { type RecommendTime, type SelectedTime } from '@/types/meetingTypes';

export default function TimeRecommendPage() {
  const {
    dateType,
    timeRange,
    recommendTimeList,
    commonTimeList,
    selectedTimeList,
    setSelectedTimeList,
  } = useMeetingContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [selectedWeek, setSelectedWeek] = useState('');

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
      bottom={<div className="space-y-3"></div>}
    >
      <div className="space-y-4">
        <TimeHeatMap
          mode="INPUT"
          dateType={dateType}
          timeRange={timeRange}
          selectedDate={selectedDate}
          selectedTimeList={selectedTimeList}
          setSelectedTimeList={setSelectedTimeList}
        />
      </div>
    </AppLayout>
  );
}
