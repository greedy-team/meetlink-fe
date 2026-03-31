import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';
import { Bell, Clock, MapPin } from 'lucide-react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { IosPwaGuideModal } from '@/components/common/general/IosPwaGuideModal';
import { NotifyBox } from '@/components/common/general/NotifyBox';
import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { isIosSafari } from '@/lib/device';
import { requestPushPermission } from '@/lib/firebase';
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
  } = useMeetingContext();

  const participantSummary = useMemo(
    () => buildParticipantSummary(participantStatusList || []),
    [participantStatusList],
  );

  const canSubmit = tempNickName.trim().length > 0 && tempNickName.length <= 10;

  const { mutateAsync: joinAsync, isPending: joinPending } = useJoinMeeting();
  const { mutateAsync: saveTimeAsync, isPending: timePending } = useUpdateMyAvailableTime();
  const { mutateAsync: savePlaceAsync, isPending: placePending } = useUpdateMyStartPlace();

  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isIosModalOpen, setIsIosModalOpen] = useState(false);
  const [showIosNotify, setShowIosNotify] = useState(false);

  const handleTogglePush = () => {
    if (isIosSafari()) {
      setIsIosModalOpen(true); // 아이폰 모달 띄우기
      setShowIosNotify(true); // 밑에 NotifyBox도 보여주기
      return; // 토글이 켜지지 않게 막음
    }
    setIsPushEnabled(!isPushEnabled);
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
            toast.success('모임 참여 완료!', {
              description: '모임에 정상적으로 참여했어요',
              icon: <CheckCircle2 className="text-greedy h-5 w-5" />,
            });
          },
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              //실패 토스트
              toast.error('오류 발생!', {
                description: error.message,
                icon: <AlertCircle className="h-5 w-5 text-red-500" />,
              });
            } else {
              //실패 토스트
              toast.error('오류 발생!', {
                description: '인터넷 연결 상태를 확인해보세요!',
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

        resetGuestDraft();

        // 푸시 알림 권한 묻기 (토글 켠 사람만)
        if (isPushEnabled) {
          try {
            const fcmToken = await requestPushPermission();

            if (fcmToken) {
              // TODO: 백엔드 API 연동하여 토큰 저장하기
              // await registerFcmToken({ token: fcmToken });

              toast.success('알림 설정이 완료되었어요!', {
                description: '모두가 입력하면 알려드릴게요',
              });
            }
          } catch (error) {
            // 알림 권한 거부 또는 기타 에러 발생 시에도 모임 참여는 성공시켜야 하므로, 에러는 콘솔에만 기록하고 사용자에게는 알리지 않음
            console.error('푸시 알림 설정 실패:', error);
          }
        }

        // 알림 설정 결과와 상관없이 모임 메인 페이지로 이동
        navigate(`/meeting/${code}`, { replace: true });
      }
    } catch (error) {
      //console.error('참여 및 정보 저장 중 에러가 발생했습니다:', error);

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

  const isPending = joinPending || timePending || placePending;

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
            className="bg-greedy hover:bg-greedy/50 text-white"
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
          {/* 알림 설정 토글 UI */}
          <div
            className={cn(
              'flex w-full items-center justify-between rounded-3xl border-2 p-4 transition-all duration-200',
              'border-gray-200 bg-gray-50 hover:bg-gray-100',
              isPushEnabled ? 'border-greedy/20 bg-greedy/15 hover:bg-greedy/30' : '', // 토글 켜지면 초록색 배경
            )}
          >
            <div className="flex flex-col gap-1 text-left">
              <div className="flex items-center gap-2">
                <Bell
                  size={24}
                  className={cn(
                    'h-auto! w-auto! text-gray-900 transition-colors',
                    isPushEnabled ? 'text-greedy' : '', // 토글 켜지면 아이콘 초록색
                  )}
                />
                <span
                  className={cn(
                    'text-base leading-tight font-bold text-gray-900',
                    isPushEnabled ? 'text-greedy' : '', // 토글 켜지면 텍스트 초록색
                  )}
                >
                  결과 알림 받기
                </span>
              </div>
              <span
                className={cn(
                  'text-xs leading-relaxed font-medium text-gray-400',
                  isPushEnabled ? 'text-greedy' : '',
                )}
              >
                모든 멤버가 입력하면 알려드려요
              </span>
            </div>

            <div className="ml-4 flex h-11 shrink-0 items-center justify-center">
              {/* 토글 스위치 */}
              <button
                type="button"
                onClick={handleTogglePush}
                className={cn(
                  'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
                  isPushEnabled ? 'bg-greedy' : 'bg-gray-200',
                )}
              >
                <span
                  className={cn(
                    'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform',
                    isPushEnabled ? 'translate-x-6' : 'translate-x-1',
                  )}
                />
              </button>
            </div>
          </div>

          {/* 아이폰 경고 NotifyBox */}
          {showIosNotify && (
            <NotifyBox variant="emphasis" className="animate-in fade-in slide-in-from-top-2">
              아이폰은 브라우저 하단 <strong>공유 버튼</strong>을 눌러{' '}
              <strong>[홈 화면에 추가]</strong>를 해야만 알림을 받을 수 있어요!
            </NotifyBox>
          )}
        </div>
      </div>

      {/* 아이폰 PWA 가이드 모달 */}
      <IosPwaGuideModal isOpen={isIosModalOpen} onClose={() => setIsIosModalOpen(false)} />
    </AppLayout>
  );
}
