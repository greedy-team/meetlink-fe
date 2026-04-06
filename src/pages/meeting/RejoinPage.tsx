import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { NotifyBox } from '@/components/common/general/NotifyBox';
import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { cn } from '@/lib/utils';
import { useParticipantList } from '@/hooks/useParticipant';

import { MeetingInfoCard } from '@/features/meeting/join/MeetingInfoCard';
import { ParticipantSelectedList } from '@/features/meeting/join/ParticipantSelectedList';
import { buildParticipantSummary } from '@/features/meeting/join/participantSummary';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function RejoinPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  // Context에서 모임명 가져오기
  const { meetingName, isLoading: isMeetingLoading, resetGuestDraft } = useMeetingContext();

  // 참여자 목록 조회
  const { data: participantData, isLoading: isParticipantLoading } = useParticipantList();

  const isPageLoading = isMeetingLoading || isParticipantLoading;

  const [selectedInfo, setSelectedInfo] = useState<{ nickname: string; token: string } | null>(
    null,
  );

  const participants = participantData?.result || [];

  // 요약 문구 생성
  const participantSummary = buildParticipantSummary(
    participants.map((p) => ({ nickName: p.nickname })),
  );

  const onGoJoin = () => {
    if (!code) return;
    navigate(`/meeting/${code}/join`, { replace: true });
  };

  // 로그인 로직: 선택된 사용자의 토큰을 저장
  const onLogin = () => {
    if (!code || !selectedInfo) return;

    // 로컬 스토리지에 토큰 저장
    localStorage.setItem('meeting_token', selectedInfo.token);

    // guest draft 초기화
    resetGuestDraft();

    // 메인 대시보드로 이동
    navigate(`/meeting/${code}`, { replace: true });
  };

  return (
    <AppLayout
      header={<Header title="모임 재참여" showBackButton={false} />}
      bottom={
        <div className="space-y-3">
          <NotifyBox variant="emphasis">
            <span className="break-keep whitespace-pre-wrap">
              본인의 닉네임이 없다면{' '}
              <button
                type="button"
                onClick={onGoJoin}
                className="text-greedy-strong hover:text-greedy cursor-pointer font-semibold underline underline-offset-4"
              >
                새로 참여하기
              </button>
              를 이용해주세요
            </span>
          </NotifyBox>

          <FixedBottomButton
            disabled={!selectedInfo || isPageLoading}
            onClick={onLogin}
            className="bg-greedy hover:bg-greedy/50 border-greedy-strong border-2"
          >
            선택한 닉네임으로 참여하기
          </FixedBottomButton>
        </div>
      }
    >
      <div className="space-y-6">
        <MeetingInfoCard
          title={meetingName || '모임'}
          participantSummary={participantSummary}
          isLoading={isPageLoading}
        />

        <div className="space-y-2">
          <div
            className={cn(
              'text-xl font-extrabold',
              isPageLoading ? 'w-32 animate-pulse rounded-lg bg-gray-100 text-gray-100' : '',
            )}
          >
            다시 오셨군요!
          </div>
          <div
            className={cn(
              'text-sm',
              isPageLoading
                ? 'w-48 animate-pulse rounded-lg bg-gray-100 text-gray-100'
                : 'text-muted-foreground',
            )}
          >
            참여 중인 닉네임을 선택해주세요
          </div>
        </div>

        {/* 참여자 목록 렌더링 (서버에서 받아온 nickname과 token 사용) */}
        <ParticipantSelectedList
          participants={participants.map((p) => ({
            nickname: p.nickname,
          }))}
          selectedNickname={selectedInfo?.nickname || null}
          onSelect={(nickname) => {
            const found = participants.find((p) => p.nickname === nickname);
            if (found && found.token) {
              setSelectedInfo({ nickname: found.nickname, token: found.token });
            }
          }}
          isLoading={isPageLoading}
        />
      </div>
    </AppLayout>
  );
}
