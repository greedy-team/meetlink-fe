import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';
import { Bell, Check, Clock, MapPin } from 'lucide-react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { InAppBrowserGuideModal } from '@/components/common/general/InAppBrowserGuideModal';
import { IosPwaGuideModal } from '@/components/common/general/IosPwaGuideModal';
import { NotifyBox } from '@/components/common/general/NotifyBox';
import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { isInAppBrowser, isIosSafari } from '@/lib/device';
import { cn } from '@/lib/utils';
import { useJoinMeeting } from '@/hooks/useParticipant';
import { useUpdateMyStartPlace } from '@/hooks/usePlace';
import { useUpdateMyAvailableTime } from '@/hooks/useTime';

import { GoToButton } from '@/features/meeting/general/GotoButton';
import { MeetingInfoCard } from '@/features/meeting/join/MeetingInfoCard';
import { NickNameInput } from '@/features/meeting/join/NickNameInput';
import { buildParticipantSummary } from '@/features/meeting/join/participantSummary';
import { convertToAvailabilities } from '@/features/Time/timeFunctions';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function JoinPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  const {
    meetingName,
    isLoading: isMeetingLoading,
    participantStatusList,
    tempNickName,
    setTempNickName,
    isTimeRecommendEnabled,
    isPlaceRecommendEnabled,
    selectedTimeList,
    selectedPlace,
    dateType,
    resetGuestDraft,
    joinPushOptIn,
    setJoinPushOptIn,
    enablePush,
    isPushProcessing,
  } = useMeetingContext();

  const participantSummary = useMemo(
    () => buildParticipantSummary(participantStatusList || []),
    [participantStatusList],
  );

  const canSubmit = tempNickName.trim().length > 0 && tempNickName.length <= 10;

  const { mutateAsync: joinAsync, isPending: joinPending } = useJoinMeeting();
  const { mutateAsync: saveTimeAsync, isPending: timePending } = useUpdateMyAvailableTime();
  const { mutateAsync: savePlaceAsync, isPending: placePending } = useUpdateMyStartPlace();

  const [isIosModalOpen, setIsIosModalOpen] = useState(false);
  const [showIosNotify, setShowIosNotify] = useState(false);
  const [isInAppModalOpen, setIsInAppModalOpen] = useState(false);
  const [showInAppNotify, setShowInAppNotify] = useState(false);

  const handleTogglePush = () => {
    if (isInAppBrowser()) {
      setIsInAppModalOpen(true);
      setShowInAppNotify(true);
      setShowIosNotify(false);
      return;
    }

    if (isIosSafari()) {
      setShowInAppNotify(false);
      setIsIosModalOpen(true);
      setShowIosNotify(true);
      return;
    }

    setShowInAppNotify(false);
    setShowIosNotify(false);
    setJoinPushOptIn((prev) => !prev);
  };

  const goRejoin = () => {
    if (!code) return;
    navigate(`/meeting/${code}/rejoin`);
  };

  const goTimeInput = () => {
    if (!code) return;
    navigate(`/meeting/${code}/input/time`);
  };

  const goPlaceInput = () => {
    if (!code) return;
    navigate(`/meeting/${code}/input/place`, { state: { from: 'join' } });
  };

  // 닉네임 에러 관리 상태 (중복 등))
  const [nicknameError, setNicknameError] = useState<string>('');

  // 닉네임 다시 입력하면 기존 에러 메시지 지움
  const handleNicknameChange = (value: string) => {
    setTempNickName(value);
    if (nicknameError) setNicknameError('');
  };

  const onSubmit = async () => {
    if (!code) return;
    const trimmed = tempNickName.trim();
    if (!trimmed) return;

    try {
      const joinData = await joinAsync(
        { nickname: trimmed },
        {
          onSuccess: () => {
            toast.success('모임 참여 완료', {
              description: '모임에 정상적으로 참여했어요',
              icon: <CheckCircle2 className="text-greedy h-5 w-5" />,
            });
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
        },
      );

      if (joinData.status) {
        const promises = [];

        // 입력한 시간 데이터가 있는 경우
        if (selectedTimeList && selectedTimeList.length > 0) {
          const convertedData = convertToAvailabilities(selectedTimeList, dateType);
          promises.push(saveTimeAsync({ availabilities: convertedData }));
        }

        // 입력한 장소 데이터가 있는 경우
        if (selectedPlace && selectedPlace.address) {
          promises.push(
            savePlaceAsync({
              name: selectedPlace.name || selectedPlace.address,
              address: selectedPlace.address,
              latitude: selectedPlace.latitude,
              longitude: selectedPlace.longitude,
            }),
          );
        }

        if (promises.length > 0) {
          await Promise.all(promises);
        }

        if (joinPushOptIn) {
          const isPushSuccess = await enablePush();

          if (isPushSuccess) {
            toast.success('알림 설정이 완료되었어요', {
              description: '모두가 입력하면 알려드릴게요',
            });
          } else {
            toast.error('알림 설정에 실패했어요', {
              description: '권한 설정을 확인한 뒤 메인 화면에서 다시 시도해주세요',
            });
          }
        }

        resetGuestDraft();
        navigate(`/meeting/${code}`, { replace: true });
      }
    } catch (error) {
      const err = error as {
        response?: {
          status?: number;
          data?: {
            status?: boolean;
            code?: string;
            message?: string;
            result?: {
              nickname?: string;
            };
          };
        };
      };

      const status = err.response?.status;
      const errorCode = err.response?.data?.code;

      if (status === 409 && errorCode === 'DUPLICATE_NICKNAME') {
        setNicknameError('이미 사용 중인 닉네임이에요');
      } else if (status === 400 && errorCode === 'VALIDATION_FAILED') {
        setNicknameError('닉네임은 필수 입력 사항이에요');
      } else {
        setNicknameError('닉네임 설정에 실패했어요. 다시 시도해주세요');
      }
    }
  };

  const isPending = joinPending || timePending || placePending || isPushProcessing;

  const isPageLoading = isMeetingLoading;

  return (
    <AppLayout
      header={<Header title="모임 참여" showBackButton={false} />}
      bottom={
        <div className="space-y-3">
          {/* 참여자가 1명이라도 있을 때만 버튼 노출 */}
          {participantStatusList && participantStatusList.length > 0 && (
            <button
              type="button"
              onClick={goRejoin}
              className="text-greedy-strong hover:text-greedy w-full cursor-pointer text-center text-sm font-semibold underline underline-offset-4"
            >
              이미 참여하셨나요?
            </button>
          )}

          <FixedBottomButton
            disabled={!canSubmit || isPending}
            loading={isPending}
            onClick={onSubmit}
            className="bg-greedy hover:bg-greedy/50 border-greedy-strong border-2"
          >
            참여하기
          </FixedBottomButton>
        </div>
      }
    >
      <div className="space-y-3">
        <MeetingInfoCard
          title={meetingName || '모임'}
          participantSummary={participantSummary}
          isLoading={isPageLoading}
        />

        <NickNameInput
          value={tempNickName}
          onChange={handleNicknameChange}
          error={nicknameError}
          isLoading={isPageLoading}
        />

        {!isPageLoading && (
          <div className="space-y-3">
            <NotifyBox variant="emphasis">모임 참여 이후 닉네임은 변경할 수 없어요</NotifyBox>
            <p className="text-muted-foreground text-sm">
              지금 바로 입력하거나, 참여 후 나중에 입력해도 돼요
            </p>
          </div>
        )}

        <div className="space-y-3">
          {isTimeRecommendEnabled && (
            <GoToButton
              icon={Clock}
              title="가능한 시간 선택"
              description="모임 만남 시간을 추천하는데 활용돼요"
              onClick={goTimeInput}
              isDone={Boolean(selectedTimeList && selectedTimeList.length > 0)}
              isLoading={isPageLoading}
            />
          )}

          {isPlaceRecommendEnabled && (
            <GoToButton
              icon={MapPin}
              title="출발지 입력"
              description="모임 만남 장소를 추천하는데 활용돼요"
              onClick={goPlaceInput}
              isDone={Boolean(selectedPlace && selectedPlace.address)}
              isLoading={isPageLoading}
            />
          )}

          {/* 알림 설정 UI */}
          {isPageLoading ? (
            <div className="animate-pulse rounded-3xl border-2 border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <div className="h-5 w-24 rounded bg-gray-200" />
                  <div className="h-3 w-44 rounded bg-gray-200" />
                </div>
                <div className="h-12 w-12 rounded-[15px] bg-gray-200" />
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'flex flex-col rounded-3xl border-2 p-3 transition-all duration-200',
                joinPushOptIn
                  ? 'border-greedy bg-greedy/5'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100',
              )}
            >
              <button
                className="flex w-full cursor-pointer items-center justify-between p-1"
                type="button"
                onClick={handleTogglePush}
              >
                <div className="flex flex-col gap-2 text-left">
                  <div className="flex items-center gap-2">
                    <Bell
                      size={24}
                      className={cn(
                        'h-auto! w-auto! transition-colors',
                        joinPushOptIn ? 'text-greedy' : 'text-gray-900',
                      )}
                    />
                    <span
                      className={cn(
                        'text-base font-bold transition-colors',
                        joinPushOptIn ? 'text-greedy' : 'text-gray-900',
                      )}
                    >
                      알림 받기
                    </span>
                  </div>
                  <div className="text-xs leading-tight font-medium whitespace-pre-wrap text-gray-400">
                    모임 진행 상황을 놓치지 않게 알려드려요
                  </div>
                </div>

                <Check
                  strokeWidth={4}
                  size={30}
                  className={cn(
                    'ml-4 h-auto! w-auto! shrink-0 rounded-[15px] p-3 transition-colors',
                    joinPushOptIn ? 'bg-[#CCE3D3] text-[#4A8B5F]' : 'bg-gray-200 text-transparent',
                  )}
                />
              </button>
            </div>
          )}

          {showInAppNotify && (
            <NotifyBox variant="emphasis" className="animate-in fade-in slide-in-from-top-2">
              앱에서 바로 열면 알림 설정이 지원되지 않아요.{' '}
              <strong>크롬 또는 사파리에서 열어주세요</strong>
            </NotifyBox>
          )}

          {/* 아이폰 경고 NotifyBox */}
          {showIosNotify && (
            <NotifyBox variant="emphasis" className="animate-in fade-in slide-in-from-top-2">
              아이폰은 브라우저 하단 <strong>공유 버튼</strong>을 눌러{' '}
              <strong>[홈 화면에 추가]</strong>를 해야만 알림을 받을 수 있어요
            </NotifyBox>
          )}
        </div>
      </div>

      <InAppBrowserGuideModal
        isOpen={isInAppModalOpen}
        onClose={() => setIsInAppModalOpen(false)}
      />
      <IosPwaGuideModal isOpen={isIosModalOpen} onClose={() => setIsIosModalOpen(false)} />
    </AppLayout>
  );
}
