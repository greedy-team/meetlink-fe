import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { NotifyBox } from '@/components/common/general/NotifyBox';
import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';
import { storage } from '@/lib/storage';

import { MeetingInfoCard } from '@/features/meeting/join/MeetingInfoCard';
import { ParticipantSelectedList } from '@/features/meeting/join/ParticipantSelectedList';
import { buildParticipantSummary } from '@/features/meeting/join/participantSummary';
import { useMeetingContext } from '@/pages/meeting/MeetingLayout';
import type { ParticipantStatus } from '@/types/meetingTypes';

// TODO: 우선 목데이터로 처리, 추후 API 연결 예정
const MOCK_PARTICIPANTS: ParticipantStatus[] = [
  { nickName: '민수', hasTimeInput: false, hasPlaceInput: false },
  { nickName: '지현', hasTimeInput: false, hasPlaceInput: false },
  { nickName: '도윤', hasTimeInput: false, hasPlaceInput: false },
  { nickName: '서연', hasTimeInput: false, hasPlaceInput: false },
];

export default function ReconnectPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  const { meetingName } = useMeetingContext();

  useEffect(() => {
    if (!code) navigate('/start', { replace: true });
  }, [code, navigate]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 일단 mock 데이터 사용
  const participants = useMemo(() => MOCK_PARTICIPANTS, []);
  const participantSummary = useMemo(() => buildParticipantSummary(participants), [participants]);

  const onGoJoin = () => {
    if (!code) return;
    navigate(`/meeting/${code}/join`, { replace: true });
  };

  // 선택 후 로컬 저장 → 메인 이동
  const onLogin = () => {
    if (!code || !selectedId) return;
    storage.setParticipantId(code, selectedId);
    navigate(`/meeting/${code}`, { replace: true });
  };

  return (
    <AppLayout
      header={<Header title="" showBackButton />}
      bottom={
        <div className="space-y-3">
          <NotifyBox variant="emphasis">
            {/* 공백 기준 줄바꿈 적용 */}
            <span className="break-keep whitespace-pre-wrap">
              본인의 닉네임이 없다면{' '}
              <button
                type="button"
                onClick={onGoJoin}
                className="font-semibold text-[#0B5A2A] underline underline-offset-4"
              >
                새로 참여하기
              </button>
              를 이용해주세요
            </span>
          </NotifyBox>

          <FixedBottomButton
            disabled={!selectedId}
            onClick={onLogin}
            className="bg-emerald-700 text-white hover:bg-emerald-800"
          >
            선택한 닉네임으로 로그인
          </FixedBottomButton>
        </div>
      }
    >
      <div className="space-y-6">
        <MeetingInfoCard title={meetingName || '모임'} participantSummary={participantSummary} />

        <div className="space-y-2">
          <div className="text-xl font-extrabold">다시 오셨군요!</div>
          <div className="text-muted-foreground text-sm">참여 중인 닉네임을 선택해주세요</div>
        </div>

        <ParticipantSelectedList
          participants={participants.map((p, idx) => ({
            id: String(idx + 1), // mock이라 임시 id
            nickname: p.nickName,
          }))}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </AppLayout>
  );
}
