import { useParams } from 'react-router-dom';

import { CalendarDays, CheckCircle2, Clock, MapPin, XCircle } from 'lucide-react';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useGetMeetingDetail } from '@/hooks/useMeeting';

export default function SharePage() {
  const { data: meetingData, isLoading: isMeetingLoading } = useGetMeetingDetail();
  const { code } = useParams<{ code: string }>();

  const meetingName = meetingData?.result?.name || '모임 이름 없음';
  const isTimeRecommendEnabled = meetingData?.result?.enableTimeRecommendation || false;
  const isPlaceRecommendEnabled = meetingData?.result?.enablePlaceRecommendation || false;
  const dateType =
    meetingData?.result?.timeAvailabilityType === 'WEEKLY' ? '매주 반복' : '특정 날짜';
  const [start, end] = [
    meetingData?.result?.timeRangeStart?.split(':').slice(0, 2).join(':') || '00:00',
    meetingData?.result?.timeRangeEnd?.split(':')[0] === '23'
      ? '24:00'
      : meetingData?.result?.timeRangeEnd?.split(':').slice(0, 2).join(':') || '24:00',
  ];

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
        console.log('공유 성공!');
      } else {
        // 2. 지원하지 않는 브라우저(예: 일부 PC 브라우저)일 경우 클립보드 복사
        await navigator.clipboard.writeText(shareData.url);
        console.log('클립보드 복사 완료');
      }
    } catch (err) {
      // 사용자가 공유를 취소했을 때는 에러가 발생하므로 체크
      if ((err as Error).name !== 'AbortError') {
        console.error('공유 중 에러 발생:', err);
      }
    }
  };

  if (isMeetingLoading) return <div>로딩중</div>;

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
        <div className="flex flex-col items-center px-6 pb-6">
          <FixedBottomButton
            className="bg-greedy hover:bg-greedy/90 shadow-greedy/20 shadow-xl"
            onClick={handleShare}
          >
            초대 링크 복사 및 공유하기
          </FixedBottomButton>
        </div>
      }
    >
      <div className="mx-6 mt-4 flex flex-col gap-4">
        {/* 모임 요약 카드 */}
        <div className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          {/* 모임 이름 */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-gray-500">모임 이름</Label>
            <div className="text-xl font-bold text-gray-900">{meetingName}</div>
          </div>

          <div className="h-px w-full bg-gray-100" />

          {/* 설정 정보 리스트 */}
          <div className="flex flex-col gap-6">
            {/* 장소 추천 설정 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-base font-semibold text-gray-800">중간 장소 추천</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isPlaceRecommendEnabled ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">사용</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-gray-300" />
                    <span className="text-sm font-medium text-gray-400">사용 안 함</span>
                  </>
                )}
              </div>
            </div>

            {/* 시간 추천 설정 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="text-base font-semibold text-gray-800">되는 시간 추천</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isTimeRecommendEnabled ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-green-600">사용</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-gray-300" />
                      <span className="text-sm font-medium text-gray-400">사용 안 함</span>
                    </>
                  )}
                </div>
              </div>

              {/* 시간 추천을 사용할 경우 상세 정보 표시 */}
              {isTimeRecommendEnabled && (
                <div className="ml-[52px] flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{dateType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">
                      {start} ~ {end}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
