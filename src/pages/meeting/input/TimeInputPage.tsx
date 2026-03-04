import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { useUpdateMyAvailableTime } from '@/hooks/useTime';
import { useGetMyAvailableTime } from '@/hooks/useTime';

import { convertToAvailabilities, convertToSelectedTimeList } from '@/features/Time/timeFunctions';
import TimeHeader from '@/features/Time/TimeHeader';
import TimeHeatMap from '@/features/Time/TimeHeatMap';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function TimeInputPage() {
  const { dateType, timeRange, selectedTimeList, setSelectedTimeList } = useMeetingContext();

  const { data: myTimeList, isSuccess } = useGetMyAvailableTime();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { mutate: saveTime, isPending } = useUpdateMyAvailableTime();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('meeting_token');
    if (token && isSuccess && myTimeList.result.availabilities) {
      const converted = convertToSelectedTimeList(myTimeList.result.availabilities);
      setSelectedTimeList(converted);
    }
  }, [isSuccess, myTimeList, setSelectedTimeList]);

  const handleSave = () => {
    const token = localStorage.getItem('meeting_token');
    const convertedData = convertToAvailabilities(selectedTimeList, dateType);
    if (token) {
      saveTime(
        { availabilities: convertedData },
        {
          onSuccess: (data) => {},
          onError: (error) => {},
        },
      );
    }
    navigate(-1);
  };

  return (
    <AppLayout
      header={
        <>
          <Header title="가능 시간 선택" showBackButton={true} showSettingButton={false} />
          <TimeHeader
            dateType={dateType}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTimeList={selectedTimeList}
            participantsNum={1}
            timeRange={timeRange}
          />
        </>
      }
      pageBackgroundClassName="bg-gray-100/70"
      bottom={
        <div className="space-y-3">
          <FixedBottomButton
            className="bg-greedy hover:bg-greedy/50"
            loading={isPending}
            onClick={handleSave}
          >
            저장하기
          </FixedBottomButton>
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
