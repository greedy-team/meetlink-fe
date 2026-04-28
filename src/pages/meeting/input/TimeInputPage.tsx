import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { useGetMyAvailableTime, useUpdateMyAvailableTime } from '@/hooks/useTime';

import { convertToAvailabilities, convertToSelectedTimeList } from '@/features/Time/timeFunctions';
import TimeHeader from '@/features/Time/TimeHeader';
import TimeHeatMap from '@/features/Time/TimeHeatMap';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function TimeInputPage() {
  const { dateType, timeRange, selectedTimeList, setSelectedTimeList, isLoading } =
    useMeetingContext();
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const { data: myTimeList, isSuccess } = useGetMyAvailableTime();
  const { mutate: saveTime, isPending } = useUpdateMyAvailableTime();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draftSelectedTimeList, setDraftSelectedTimeList] = useState(selectedTimeList);

  useEffect(() => {
    setDraftSelectedTimeList(selectedTimeList);
  }, [selectedTimeList]);

  useEffect(() => {
    const token = localStorage.getItem('meeting_token');

    if (token && isSuccess && myTimeList.result) {
      const converted = convertToSelectedTimeList(myTimeList.result);
      setDraftSelectedTimeList(converted);
    }
  }, [isSuccess, myTimeList]);

  const handleSave = () => {
    const token = localStorage.getItem('meeting_token');
    const convertedData = convertToAvailabilities(draftSelectedTimeList, dateType);

    if (token) {
      saveTime(
        { availabilities: convertedData },
        {
          onSuccess: () => {
            setSelectedTimeList(draftSelectedTimeList);

            toast.success('시간 등록 완료', {
              description: '시간이 정상적으로 등록되었어요',
              icon: <CheckCircle2 className="text-greedy h-5 w-5" />,
            });

            navigate(`/meeting/${code}/`);
          },
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              toast.error('오류가 발생했어요', {
                description: error.message,
                icon: <AlertCircle className="h-5 w-5 text-red-500" />,
              });
            } else {
              toast.error('오류가 발생했어요', {
                description: '잠시 후에 다시 시도해보세요',
                icon: <AlertCircle className="h-5 w-5 text-red-500" />,
              });
            }
          },
        },
      );
    } else {
      setSelectedTimeList(draftSelectedTimeList);
      navigate(`/meeting/${code}/join`);
    }
  };

  return (
    <AppLayout
      header={
        <>
          <Header title="가능 시간 선택" showBackButton={true} showSettingButton={false} />
          {!isLoading && (
            <TimeHeader
              dateType={dateType}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTimeList={draftSelectedTimeList}
              participantsNum={1}
              timeRange={timeRange}
            />
          )}
        </>
      }
      pageBackgroundClassName="bg-white"
      bottom={
        <div className="space-y-3">
          {!isLoading && (
            <FixedBottomButton
              className="bg-greedy hover:bg-greedy/50"
              loading={isPending}
              onClick={handleSave}
            >
              저장하기
            </FixedBottomButton>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {!isLoading && (
          <TimeHeatMap
            mode="INPUT"
            dateType={dateType}
            timeRange={timeRange}
            selectedDate={selectedDate}
            selectedTimeList={draftSelectedTimeList}
            setSelectedTimeList={setDraftSelectedTimeList}
          />
        )}
      </div>
    </AppLayout>
  );
}
