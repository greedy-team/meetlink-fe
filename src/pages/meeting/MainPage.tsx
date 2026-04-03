import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';
import { AlertCircle, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

import { IosPwaGuideModal } from '@/components/common/general/IosPwaGuideModal';
import { NotifyBox } from '@/components/common/general/NotifyBox';
import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useTransferHost } from '@/hooks/useParticipant';
import { useLeaveMeeting } from '@/hooks/useParticipant';
import { useRecommendResult } from '@/hooks/useRecommend';

import { DisablePushModal } from '@/features/meeting/general/DisablePushModal';
import { GoToButton } from '@/features/meeting/general/GotoButton';
import { ParticipantStatusList } from '@/features/meeting/general/ParticipantStatusList';
import { QABox } from '@/features/meeting/general/QABox';
import { RecommendSummaryCard } from '@/features/meeting/general/RecommendSummaryCard';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function MainPage() {
  const {
    meetingName,
    isTimeRecommendEnabled,
    isPlaceRecommendEnabled,
    participantStatusList,
    nickName,
    isHost,
    isLoading: isMeetingLoading,
    isPushEnabled,
    isPushProcessing,
    enablePush,
    disablePush,
  } = useMeetingContext();

  const { data: resultData } = useRecommendResult();
  const { code } = useParams<{ code: string }>();

  const { mutate: transferHost } = useTransferHost();
  const { mutate: leaveMeeting } = useLeaveMeeting();

  const isLoading = isMeetingLoading;

  const navigate = useNavigate();

  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [isIosModalOpen, setIsIosModalOpen] = useState(false);

  const handleNotificationClick = async () => {
    if (isPushProcessing) return;

    if (isPushEnabled) {
      setIsDisableModalOpen(true);
      return;
    }

    const isPushSuccess = await enablePush();

    if (isPushSuccess) {
      toast.success('알림이 켜졌어요', {
        description: '모임의 소식을 알림으로 보내드려요',
      });
    } else {
      toast.error('알림 설정에 실패했어요', {
        description: '브라우저 권한을 확인한 뒤 다시 시도해주세요',
      });
    }
  };

  const handleDisableConfirm = async () => {
    setIsDisableModalOpen(false);

    const isDisableSuccess = await disablePush();

    if (isDisableSuccess) {
      toast.success('알림이 꺼졌어요', {
        description: '더 이상 알림을 받지 않아요',
      });
    } else {
      toast.success('알림은 꺼졌어요', {
        description: '일부 토큰 정리는 브라우저 상태에 따라 지연될 수 있어요',
      });
    }
  };

  const handleGoToButton = (url: string) => {
    navigate(url);
  };
  const bestRecommendedTime = resultData?.result.timeCandidate;
  const bestRecommendedPlace = resultData?.result.placeCandidate;

  const isTimeCalculating = bestRecommendedTime?.calculationStatus === 'CALCULATING';
  const isPlaceCalculating = bestRecommendedPlace?.calculationStatus === 'CALCULATING';

  const safeParticipantList =
    participantStatusList && participantStatusList.length > 0
      ? participantStatusList
      : [
          {
            nickName: '안보여요',
            hasTimeInput: false,
            hasPlaceInput: false,
            isHost: false,
          },
        ];

  const sortedParticipantStatusList = [
    ...safeParticipantList.filter((p) => p.nickName === nickName),
    ...safeParticipantList.filter((p) => p.isHost === true && p.nickName !== nickName),
    ...safeParticipantList.filter((p) => p.nickName !== nickName && !p.isHost),
  ];
  const myStatus = sortedParticipantStatusList[0];

  const completedCount = sortedParticipantStatusList.filter(
    (p) => p.hasTimeInput && p.hasPlaceInput,
  ).length;
  const totalCount = sortedParticipantStatusList.length;

  const handleTransferHost = async (nickName: string) => {
    const requestData = {
      nickname: nickName,
    };
    transferHost(requestData, {
      onSuccess: () => {
        toast.success('양도 성공', {
          description: '모임장이 성공적으로 양도되었어요',
          icon: <CheckCircle2 className="text-greedy h-5 w-5" />,
        });
        navigate(`/meeting/${code}`);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          //실패 토스트
          toast.error('오류가 발생했어요', {
            description: error.message,
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          });
        } else {
          //실패 토스트
          toast.error('오류가 발생했어요', {
            description: '잠시 후에 다시 시도해보세요',
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          });
        }
      },
    });
  };

  const handleLeave = () => {
    leaveMeeting(undefined, {
      onSuccess: () => {
        toast.success('나가기 성공', {
          description: '모임에서 성공적으로 나갔어요',
          icon: <CheckCircle2 className="text-greedy h-5 w-5" />,
        });
        navigate(`/meeting/${code}/join`);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          //실패 토스트
          toast.error('오류가 발생했어요', {
            description: error.message,
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          });
        } else {
          //실패 토스트
          toast.error('오류가 발생했어요', {
            description: '잠시 후에 다시 시도해보세요',
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          });
        }
      },
    });
  };

  const handleShare = async () => {
    // 공유할 데이터 설정
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
        //console.error('공유 중 에러 발생:', err);
      }
    }
  };

  return (
    <AppLayout
      header={
        <Header
          title={meetingName || '임시'}
          showBackButton={false}
          showSettingButton={isHost}
          showLeaveButton={true}
          showNotificationButton={true}
          isPushEnabled={isPushEnabled}
          onNotificationClick={handleNotificationClick}
          onShowIosGuide={() => setIsIosModalOpen(true)}
          className={cn(isLoading ? 'w-20 rounded-lg bg-gray-100 text-gray-100' : '')}
          onLeave={handleLeave}
        />
      }
      pageBackgroundClassName="bg-white"
      bottom={
        <div className="flex items-center pt-2">
          {!isLoading && (
            <FixedBottomButton
              className="bg-greedy hover:bg-greedy/50 border-greedy-strong border-2"
              onClick={handleShare}
            >
              초대 링크 복사 및 공유하기
            </FixedBottomButton>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="">
          <RecommendSummaryCard
            isTimeRecommendEnabled={isTimeRecommendEnabled || isLoading}
            isPlaceRecommendEnabled={isPlaceRecommendEnabled || isLoading}
            bestTime={bestRecommendedTime}
            bestPlace={bestRecommendedPlace}
            isLoading={isLoading}
            isPlaceCalculating={isPlaceCalculating}
            isTimeCalculating={isTimeCalculating}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="meeting-todo" className="text-base font-semibold">
            내가 할 일
          </Label>

          {(isTimeRecommendEnabled || isLoading) && (
            <GoToButton
              icon={Clock}
              title="가능한 시간 선택하기"
              description="모임 만남 시간을 추천하는데 활용돼요"
              onClick={() => handleGoToButton('input/time')}
              isDone={myStatus?.hasTimeInput}
              isLoading={isLoading}
            />
          )}
          {(isPlaceRecommendEnabled || isLoading) && (
            <GoToButton
              icon={MapPin}
              title="출발지 입력하기"
              description={'모임 만남 장소를 추천하는데 활용돼요'}
              onClick={() => navigate('input/place', { state: { from: 'main' } })}
              isDone={myStatus?.hasPlaceInput}
              isLoading={isLoading}
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <Label htmlFor="meeting-participant" className="text-base font-semibold">
              참여자 현황
            </Label>
            {!isLoading && (
              <div className="bg-greedy/90 flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold text-white">
                {completedCount}/{totalCount} 입력 완료
              </div>
            )}
          </div>
          {isHost && (
            <NotifyBox variant="emphasis" className="">
              참여자를 클릭하면 모임장을 양도할 수 있어요
            </NotifyBox>
          )}
          <ParticipantStatusList
            list={sortedParticipantStatusList || []}
            isTimeRecommendEnabled={isTimeRecommendEnabled}
            isPlaceRecommendEnabled={isPlaceRecommendEnabled}
            isLoading={isLoading}
            isHost={isHost}
            onTransferHost={handleTransferHost}
          />
          <QABox />
        </div>
      </div>
      <IosPwaGuideModal isOpen={isIosModalOpen} onClose={() => setIsIosModalOpen(false)} />
      <DisablePushModal
        isOpen={isDisableModalOpen}
        onClose={() => setIsDisableModalOpen(false)}
        onConfirm={handleDisableConfirm}
      />
    </AppLayout>
  );
}
