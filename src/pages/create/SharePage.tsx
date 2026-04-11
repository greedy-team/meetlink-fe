import { useNavigate, useParams } from 'react-router-dom';

import { AlertCircle, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

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
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const shareData = isMobile
      ? {
          title: `MeetLink 모임 초대 : ${meetingName}`,
          text: '우리 언제 만날까요? 가능한 시간과 출발 위치를 입력해주세요!',
          url: shareUrl,
        }
      : {
          url: shareUrl,
        };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('url 이 복사되었어요', {
            description: '링크를 공유해보세요',
          });
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        toast.error('오류가 발생했어요', {
          description: '잠시 후에 다시 시도해보세요',
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
      }
    }
  };

  return (
    <AppLayout
      header={
        <div className="mx-5 mt-8 mb-5 flex flex-col gap-2 text-left">
          <div className="text-3xl font-bold tracking-tight text-gray-900">링크 공유하기</div>
          <div className="text-gray-500">생성한 모임 정보를 확인하고 초대하세요!</div>
        </div>
      }
      pageBackgroundClassName="bg-white"
      bottom={
        isSuccess && (
          <div className="flex flex-col gap-3">
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
      <div className="mx-1 flex flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <div className="flex flex-col gap-1.5">
          <Label
            className={cn(
              'text-sm font-medium text-gray-600',
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

        <div className="h-px w-full bg-gray-200" />

        <SettingInfoCard
          isEnabled={isTimeRecommendEnabled}
          title="시간 추천"
          icon={Clock}
          isLoading={isLoading}
        >
          <div className="ml-13 flex flex-col gap-1 text-sm font-medium text-gray-600">
            <span>{dateType}</span>
            <span>
              {timeRange[0]} ~ {timeRange[1]}
            </span>
          </div>
        </SettingInfoCard>
        <SettingInfoCard
          isEnabled={isPlaceRecommendEnabled}
          title="장소 추천"
          icon={MapPin}
          isLoading={isLoading}
        >
          <div className="ml-13 flex flex-col gap-1 text-sm font-medium text-gray-600">
            <span>{placeType}</span>
          </div>
        </SettingInfoCard>
      </div>
    </AppLayout>
  );
}
