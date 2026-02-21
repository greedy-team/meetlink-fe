import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { useUpdateMyAvailableTime } from '@/hooks/useTime';
import { useGetMyAvailableTime } from '@/hooks/useTime';

import { convertToSelectedTimeList, convertToSlots } from '@/features/Time/timeConverter';
import TimeHeader from '@/features/Time/TimeHeader';
import TimeHeatMap from '@/features/Time/TimeHeapMap';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function TimeInputPage() {
  const { dateType, timeRange, selectedTimeList, setSelectedTimeList } = useMeetingContext();

  //const { data: myAvailableTime, isSuccess } = useGetMyAvailableTime();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { mutate: saveTime, isPending } = useUpdateMyAvailableTime();
  const navigate = useNavigate();

  // useEffect(() => {
  //   // 1. 토큰이 있고, 데이터 패칭이 성공했으며, 데이터가 실제로 존재할 때
  //   if (token && isSuccess && myAvailableTime?.myTimeList) {
  //     // 2. 서버 데이터를 프론트 형식으로 변환
  //     const converted = convertToSelectedTimeList(myAvailableTime.slots);

  //     // 3. 상태에 저장
  //     setSelectedTimeList(converted);
  //   }
  //   // 의존성 배열에 isSuccess와 데이터를 넣어 로딩 완료 시점에 실행되도록 함
  // }, [isSuccess, myAvailableTime, token, dateType]);

  const handleSave = () => {
    const token = localStorage.getItem('meeting_token');
    const convertedData = convertToSlots(selectedTimeList, dateType);
    if (token) {
      saveTime(
        { slots: convertedData },
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
