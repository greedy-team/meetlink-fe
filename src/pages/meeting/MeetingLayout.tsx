import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { useGetMeetingDetail } from '@/hooks/useMeeting';
import { useParticipantList } from '@/hooks/useParticipant';
import { useRecommendPlace, useRecommendTime } from '@/hooks/useRecommend';

import {
  type ParticipantList,
  type RecommendPlace,
  type RecommendTime,
  type SelectedTime,
} from '@/types/meetingTypes';

export interface MeetingOutletContext {
  //서버
  meetingName: string;
  isTimeRecommendEnabled: boolean;
  isPlaceRecommendEnabled: boolean;
  dateType: string;
  timeRange: string;
  participantStatusList: ParticipantList | undefined;
  commonTimeList: SelectedTime[] | undefined;
  recommendTimeList: RecommendTime[] | undefined;
  recommendPlaceList: RecommendPlace[] | undefined;

  //클라
  nickName: string;
  setNickName: React.Dispatch<React.SetStateAction<string>>;
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;

  // 3. 로딩 상태
  isLoading: boolean;
}

export default function MeetingLayout() {
  const { data: meetingData, isLoading: isMeetingLoading } = useGetMeetingDetail();
  const { data: participantData, isLoading: isParticipantLoading } = useParticipantList();
  const { data: timeData, isLoading: isTimeLoading } = useRecommendTime();
  const { data: placeData, isLoading: isPlaceLoading } = useRecommendPlace();

  const [nickName, setNickName] = useState('');
  const [id, setId] = useState('');

  const contextValue: MeetingOutletContext = {
    meetingName: meetingData?.meetingName || '',
    isTimeRecommendEnabled: meetingData?.isTimeRecommendEnabled || false,
    isPlaceRecommendEnabled: meetingData?.isPlaceRecommendEnabled || false,
    dateType: meetingData?.dateType || '',
    timeRange: meetingData?.timeRange || '',
    participantStatusList: participantData?.participantList,
    commonTimeList: timeData?.commonTimeList,
    recommendTimeList: timeData?.recommendTimeList,
    recommendPlaceList: placeData?.recommendPlaceList,

    nickName,
    setNickName,
    id,
    setId,

    isLoading: isMeetingLoading || isParticipantLoading || isTimeLoading || isPlaceLoading,
  };

  return (
    <div>
      <Outlet context={contextValue} />
    </div>
  );
}

// 커스텀 훅
export const useMeetingContext = () => {
  return useOutletContext<MeetingOutletContext>();
};
