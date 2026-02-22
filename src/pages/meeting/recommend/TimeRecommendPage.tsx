import { useState } from 'react';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { Header } from '@/components/common/layout/Header';
import { useRecommendTime } from '@/hooks/useRecommend';

import { convertToCommonTimeList } from '@/features/Time/timeConverter';
import TimeHeader from '@/features/Time/TimeHeader';
import TimeHeatMap from '@/features/Time/TimeHeapMap';
import TimeRecommendModal from '@/features/Time/TimeRecommendModal';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';
import { type RecommendTime, type SelectedTime } from '@/types/meetingTypes';
const mockCandidateList = [
  {
    id: 1,
    rank: 1,
    date: '2026-03-05',
    dayOfWeek: 4, // 목요일
    startTime: '08:00',
    endTime: '10:00',
    availableCount: 4,
  },
  {
    id: 2,
    rank: 2,
    date: '2026-03-02',
    dayOfWeek: 1, // 월요일
    startTime: '08:00',
    endTime: '10:00',
    availableCount: 3,
  },
  {
    id: 3,
    rank: 3,
    date: '2026-03-06',
    dayOfWeek: 5, // 금요일
    startTime: '14:00',
    endTime: '16:00',
    availableCount: 2,
  },
  {
    id: 4,
    rank: 4,
    date: '2026-03-07',
    dayOfWeek: 6, // 토요일
    startTime: '19:00',
    endTime: '21:00',
    availableCount: 4,
  },
  {
    id: 5,
    rank: 5,
    date: '2026-03-08',
    dayOfWeek: 0, // 일요일
    startTime: '13:00',
    endTime: '15:00',
    availableCount: 1,
  },
  {
    id: 4,
    rank: 4,
    date: '2026-03-07',
    dayOfWeek: 6, // 토요일
    startTime: '19:00',
    endTime: '21:00',
    availableCount: 4,
  },
  {
    id: 5,
    rank: 5,
    date: '2026-03-08',
    dayOfWeek: 0, // 일요일
    startTime: '13:00',
    endTime: '15:00',
    availableCount: 1,
  },
];
export default function TimeRecommendPage() {
  const { dateType, timeRange, selectedTimeList, setSelectedTimeList } = useMeetingContext();
  const { data: timeData } = useRecommendTime();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const commonTimeList = convertToCommonTimeList(timeData?.result.heatmaps);
  const candidateList = timeData?.result.candidates;

  return (
    <AppLayout
      header={
        <div className="flex flex-col">
          <Header title="추천 시간 후보" showBackButton={true} showSettingButton={false} />
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
          <TimeRecommendModal candidateList={mockCandidateList} setSelectedDate={setSelectedDate} />
        </div>
      }
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
