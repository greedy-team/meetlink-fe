import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Clock, MapPin } from 'lucide-react';

import { NotifyBox } from '@/components/common/general/NotifyBox';
import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { useJoinMeeting } from '@/hooks/useParticipant';
import { useUpdateMyStartPlace } from '@/hooks/usePlace';
import { useUpdateMyAvailableTime } from '@/hooks/useTime';

import { GoToButton } from '@/features/meeting/general/GotoButton';
import { MeetingInfoCard } from '@/features/meeting/join/MeetingInfoCard';
import { NickNameInput } from '@/features/meeting/join/NickNameInput';
import { buildParticipantSummary } from '@/features/meeting/join/participantSummary';
import { convertToAvailabilities } from '@/features/Time/timeConverter';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function JoinPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  const {
    meetingName,
    participantStatusList,
    tempNickName,
    setTempNickName,
    isTimeRecommendEnabled,
    isPlaceRecommendEnabled,
    selectedTimeList,
    selectedPlace,
    dateType,
    id,
  } = useMeetingContext();

  const participantSummary = useMemo(
    () => buildParticipantSummary(participantStatusList || []),
    [participantStatusList],
  );

  const canSubmit = tempNickName.trim().length > 0;

  const { mutateAsync: joinAsync, isPending: joinPending } = useJoinMeeting();
  const { mutateAsync: saveTimeAsync, isPending: timePending } = useUpdateMyAvailableTime();
  const { mutateAsync: savePlaceAsync, isPending: placePending } = useUpdateMyStartPlace();

  const goReconnect = () => {
    if (!code) return;
    navigate(`/meeting/${code}/reconnect`);
  };

  const goTimeInput = () => {
    if (!code) return;
    navigate(`/meeting/${code}/input/time`);
  };

  const goPlaceInput = () => {
    if (!code) return;
    navigate(`/meeting/${code}/input/place`, { state: { from: 'join' } });
  };

  const onSubmit = async () => {
    if (!code) return;
    const trimmed = tempNickName.trim();
    if (!trimmed) return;

    try {
      const joinData = await joinAsync({ nickname: trimmed });

      if (joinData.status) {
        const promises = [];

        // 입력한 시간 데이터가 있는 경우
        if (selectedTimeList && selectedTimeList.length > 0) {
          const convertedData = convertToAvailabilities(selectedTimeList, dateType);
          promises.push(saveTimeAsync({ availabilities: convertedData }));
        }

        // 입력한 장소 데이터가 있는 경우
        if (selectedPlace && selectedPlace.address) {
          promises.push(savePlaceAsync(selectedPlace));
        }

        if (promises.length > 0) {
          await Promise.all(promises);
        }

        navigate(`/meeting/${code}`, { replace: true });
      }
    } catch (error) {
      console.error('참여 및 정보 저장 중 에러가 발생했습니다:', error);
    }
  };

  const isPending = joinPending || timePending || placePending;

  return (
    <AppLayout
      header={<Header title="모임 참여 페이지" showBackButton={false} />}
      bottom={
        <div className="space-y-3">
          <button
            type="button"
            onClick={goReconnect}
            className="text-greedy-strong w-full text-center text-sm font-semibold underline underline-offset-4"
          >
            이미 참여하셨나요?
          </button>

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
        <MeetingInfoCard title={meetingName || '모임'} participantSummary={participantSummary} />

        <NickNameInput value={tempNickName} onChange={setTempNickName} />

        <div className="space-y-3">
          <NotifyBox variant="emphasis">모임 참여 이후 닉네임은 변경할 수 없어요</NotifyBox>
          <p className="text-muted-foreground text-sm">
            지금 바로 입력하거나, 참여 후 나중에 입력해도 돼요
          </p>
        </div>
        <div className="space-y-3">
          {isTimeRecommendEnabled && (
            <GoToButton
              icon={Clock}
              title="가능한 시간 선택"
              description="모임 만남 시간을 추천하는데 활용돼요"
              onClick={goTimeInput}
            />
          )}

          {isPlaceRecommendEnabled && (
            <GoToButton
              icon={MapPin}
              title="출발지 입력"
              description="모임 만남 장소를 추천하는데 활용돼요"
              onClick={goPlaceInput}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
