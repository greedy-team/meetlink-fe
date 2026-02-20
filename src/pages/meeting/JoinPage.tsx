import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Clock, MapPin } from 'lucide-react';

import { NotifyBox } from '@/components/common/general/NotifyBox';
import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { useJoinMeeting } from '@/hooks/useParticipant';

import { GoToButton } from '@/features/meeting/general/GotoButton';
import { MeetingInfoCard } from '@/features/meeting/join/MeetingInfoCard';
import { NickNameInput } from '@/features/meeting/join/NickNameInput';
import { buildParticipantSummary } from '@/features/meeting/join/participantSummary';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';
import type { ParticipantStatus } from '@/types/meetingTypes';

export default function JoinPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  const {
    meetingName,
    participantStatusList,
    nickName,
    setNickName,
    // setId,
    isTimeRecommendEnabled,
    isPlaceRecommendEnabled,
  } = useMeetingContext();

  const [inputNickName, setInputNickName] = useState(nickName ?? '');

  // UI 확인용 목데이터
  const mockParticipantStatusList = useMemo<ParticipantStatus[]>(
    () => [
      { nickName: '민수', hasTimeInput: false, hasPlaceInput: false },
      { nickName: '지현', hasTimeInput: false, hasPlaceInput: false },
      { nickName: '도윤', hasTimeInput: false, hasPlaceInput: false },
      { nickName: '서연', hasTimeInput: false, hasPlaceInput: false },
    ],
    [],
  );

  const effectiveParticipantStatusList =
    participantStatusList && participantStatusList.length > 0
      ? participantStatusList
      : mockParticipantStatusList;

  const participantSummary = useMemo(
    () => buildParticipantSummary(effectiveParticipantStatusList),
    [effectiveParticipantStatusList],
  );

  const canSubmit = inputNickName.trim().length > 0;

  const { mutate: join, isPending } = useJoinMeeting();

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
    navigate(`/meeting/${code}/input/place`);
  };

  const onSubmit = () => {
    if (!code) return;
    const trimmed = inputNickName.trim();
    if (!trimmed) return;

    join(
      { nickName: trimmed },
      {
        onSuccess: () => {
          setNickName(trimmed);
          // TODO: 백엔드가 participantId/token을 주면 여기서 setId + storage 저장 로직 추가
          navigate(`/meeting/${code}`, { replace: true });
        },
      },
    );
  };

  return (
    <AppLayout
      header={<Header title="모임 참여 페이지" showBackButton />}
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

        <NickNameInput value={inputNickName} onChange={setInputNickName} />

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
