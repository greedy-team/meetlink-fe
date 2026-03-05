import { useEffect, useState } from 'react';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { Header } from '@/components/common/layout/Header';
import { useCalculateRecommendTime, useRecommendTime } from '@/hooks/useRecommend';
import { useGetWholeAvailableTime } from '@/hooks/useTime';

import { convertToCommonTimeList } from '@/features/Time/timeFunctions';
import TimeHeader from '@/features/Time/TimeHeader';
import TimeHeatMap from '@/features/Time/TimeHeatMap';
import TimeRecommendModal from '@/features/Time/TimeRecommendModal';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function TimeRecommendPage() {
  const { dateType, timeRange, setSelectedTimeList, participantStatusList } = useMeetingContext();
  const { data: wholeTimeData } = useGetWholeAvailableTime();
  const { data: timeRecommendData } = useRecommendTime();
  const { mutate: calculateRecommendTime } = useCalculateRecommendTime();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const participantsNum = participantStatusList.length;
  const commonTimeList = convertToCommonTimeList(wholeTimeData?.result);
  const candidateList = timeRecommendData?.result;

  console.log(candidateList);
  useEffect(() => {
    console.log('didcalculate');
    calculateRecommendTime();
  }, [calculateRecommendTime]);

  return (
    <AppLayout
      header={
        <div className="flex flex-col">
          <Header title="추천 시간 후보" showBackButton={true} showSettingButton={false} />
          <TimeHeader
            dateType={dateType}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTimeList={commonTimeList}
            participantsNum={participantsNum}
            timeRange={timeRange}
          />
        </div>
      }
      pageBackgroundClassName="bg-gray-100/70"
      bottom={
        <div className="space-y-3">
          <TimeRecommendModal
            candidateList={candidateList}
            participantsNum={participantsNum}
            setSelectedDate={setSelectedDate}
            commonTimeList={commonTimeList}
            dateType={dateType}
            timeRange={timeRange}
          />
        </div>
      }
    >
      <div className="space-y-4">
        <TimeHeatMap
          mode="OUTPUT"
          participantsNum={participantsNum}
          dateType={dateType}
          timeRange={timeRange}
          selectedDate={selectedDate}
          selectedTimeList={commonTimeList}
          setSelectedTimeList={setSelectedTimeList}
        />
      </div>
    </AppLayout>
  );
}
