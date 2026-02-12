import { useState } from 'react';

import { useJoinMeeting } from '@/hooks/useParticipant';

import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function JoinPage() {
  const {
    meetingName,
    participantStatusList,
    nickName,
    setNickName,
    setId,
    isTimeRecommendEnabled,
    isPlaceRecommendEnabled,
  } = useMeetingContext();

  const [inputNickName, setInputNickName] = useState('');

  const participantsNum = participantStatusList ? participantStatusList.length : 0;

  const { mutate: join } = useJoinMeeting();

  return (
    <div>
      <div>participate</div>
    </div>
  );
}
