import { useNavigate, useParams } from 'react-router-dom';

import { CalendarDays, Clock, MapPin } from 'lucide-react';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useGetMeetingDetail } from '@/hooks/useMeeting';

import { SettingInfoCard } from '@/features/meeting/general/SettingInfoCard';

export default function SharePage() {
  const { data: meetingData, isLoading, isSuccess } = useGetMeetingDetail();
  const { code } = useParams<{ code: string }>();

  const meetingName = meetingData?.result?.name || '없음';
  const isTimeRecommendEnabled = meetingData?.result?.enableTimeRecommendation || false;
  const isPlaceRecommendEnabled = meetingData?.result?.enablePlaceRecommendation || false;
  const dateType =
    meetingData?.result?.timeAvailabilityType === 'WEEKLY' ? '매주 반복' : '특정 날짜';
  const timeRange = [
    meetingData?.result?.timeRangeStart?.split(':').slice(0, 2).join(':') || '00:00',
    meetingData?.result?.timeRangeEnd?.split(':')[0] === '23'
      ? '24:00'
      : meetingData?.result?.timeRangeEnd?.split(':').slice(0, 2).join(':') || '24:00',
  ];
  const placeType = '공평한 만남';

  const navigate = useNavigate();
  const handleJoin = () => {
    navigate(`/meeting/${code}/join`);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/meeting/${code}`;
    const shareData = {
      title: `MeetLink 모임 초대 : ${meetingName}`,
      text: '우리 언제 만날까요? 가능한 시간과 출발 위치를 입력해주세요!',
      url: shareUrl,
    };

    try {
      // 1. 브라우저가 Web Share API를 지원하고, 데이터 공유가 가능한지 확인
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        // 2. 지원하지 않는 브라우저(예: 일부 PC 브라우저)일 경우 클립보드 복사
        await navigator.clipboard.writeText(shareData.url);
      }
    } catch (err) {
      // 사용자가 공유를 취소했을 때는 에러가 발생하므로 체크
      if ((err as Error).name !== 'AbortError') {
        console.error('공유 중 에러 발생:', err);
      }
    }
  };

  return (
    <AppLayout
      header={
        <div className="mx-8 mt-12 mb-2 flex flex-col gap-2 text-left">
          <div className="text-3xl font-bold tracking-tight text-gray-900">링크 공유하기</div>
          <div className="text-gray-500">생성한 모임 정보를 확인하고 초대하세요!</div>
        </div>
      }
      pageBackgroundClassName="bg-gray-50"
      bottom={
        isSuccess && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleJoin}
              className={cn(
                'w-full cursor-pointer underline underline-offset-4',
                'text-greedy-strong hover:text-greedy text-center text-sm font-semibold',
              )}
            >
              모임에 바로 참여할래요
            </button>
            <FixedBottomButton className="bg-greedy hover:bg-greedy/50" onClick={handleShare}>
              초대 링크 복사 및 공유하기
            </FixedBottomButton>
          </div>
        )
      }
    >
      <div className="mx-3 flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex flex-col gap-1.5">
          <Label
            className={cn(
              'text-sm font-medium text-gray-500',
              isLoading ? 'w-15 rounded-lg bg-gray-100 text-gray-100' : '',
            )}
          >
            모임 이름
          </Label>
          <div
            className={cn(
              'text-xl font-bold text-gray-900',
              isLoading ? 'w-30 rounded-lg bg-gray-100 text-gray-100' : '',
            )}
          >
            {meetingName}
          </div>
        </div>

        <div className="h-px w-full bg-gray-100" />

        <SettingInfoCard
          isEnabled={isTimeRecommendEnabled}
          title="시간 추천"
          icon={Clock}
          isLoading={isLoading}
        >
          <div className="ml-13 flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{dateType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="font-medium">
                {timeRange[0]} ~ {timeRange[1]}
              </span>
            </div>
          </div>
        </SettingInfoCard>
        <SettingInfoCard
          isEnabled={isPlaceRecommendEnabled}
          title="장소 추천"
          icon={MapPin}
          isLoading={isLoading}
        >
          <div className="ml-13 flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{placeType}</span>
            </div>
          </div>
        </SettingInfoCard>
      </div>
    </AppLayout>
  );
}
