import { useMemo, useState } from 'react';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { Header } from '@/components/common/layout/Header';
import { useRecommendTime } from '@/hooks/useRecommend';
import { useGetWholeAvailableTime } from '@/hooks/useTime';

import { convertToCommonTimeList } from '@/features/Time/timeFunctions';
import TimeHeader from '@/features/Time/TimeHeader';
import TimeHeatMap from '@/features/Time/TimeHeatMap';
import TimeRecommendModal from '@/features/Time/TimeRecommendModal';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';
import { type TimeCandidate } from '@/types/meetingTypes';

export default function TimeRecommendPage() {
  const { dateType, timeRange, participantStatusList, isLoading } = useMeetingContext();
  const { data: wholeTimeData } = useGetWholeAvailableTime();
  const { data: timeRecommendData } = useRecommendTime();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCandidate, setSelectedCandidate] = useState<TimeCandidate>();

  const participantsNum = participantStatusList.length;
  const commonTimeList = useMemo(() => {
    return convertToCommonTimeList(wholeTimeData?.result);
  }, [wholeTimeData]);

  const candidateList = timeRecommendData?.result;

  const maxAvailableNum = useMemo(() => {
    if (!commonTimeList || commonTimeList.length === 0) return 0;

    return Math.max(
      ...commonTimeList.flatMap((selectedTime) =>
        selectedTime.startTimeList.map((timeInfo) => timeInfo.availableNumber),
      ),
    );
  }, [commonTimeList]);

  return (
    <AppLayout
      header={
        <>
          <Header title="추천 시간 후보" showBackButton={true} showSettingButton={false} />
          {!isLoading && (
            <TimeHeader
              dateType={dateType}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTimeList={commonTimeList}
              participantsNum={maxAvailableNum}
              timeRange={timeRange}
            />
          )}
        </>
      }
      pageBackgroundClassName="bg-white"
      bottom={
        <div className="relative space-y-3">
          {!isLoading && (
            <TimeRecommendModal
              candidateList={candidateList}
              participantsNum={participantsNum}
              maxAvailableNum={maxAvailableNum}
              setSelectedDate={setSelectedDate}
              commonTimeList={commonTimeList}
              dateType={dateType}
              timeRange={timeRange}
              setSelectedCandidate={setSelectedCandidate}
            />
          )}
        </div>
      }
      disableBottomPadding={true}
    >
      <div className="mb-10 space-y-4">
        {!isLoading && (
          <TimeHeatMap
            mode="OUTPUT"
            participantsNum={participantsNum}
            maxAvailableNum={maxAvailableNum}
            dateType={dateType}
            timeRange={timeRange}
            selectedDate={selectedDate}
            selectedTimeList={commonTimeList}
            selectedCandidate={selectedCandidate}
          />
        )}
      </div>
    </AppLayout>
  );
}
