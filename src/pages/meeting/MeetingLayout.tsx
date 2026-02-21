import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { useGetMeetingDetail } from '@/hooks/useMeeting';
import { useParticipantList } from '@/hooks/useParticipant';
import { useRecommendPlace, useRecommendTime } from '@/hooks/useRecommend';

import {
  type ParticipantList,
  type ParticipantStatus,
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
  timeRange: [number, number];
  participantStatusList: ParticipantList;
  //commonTimeList: SelectedTime[] | undefined;
  //recommendTimeList: RecommendTime[] | undefined;
  //recommendPlaceList: RecommendPlace[] | undefined;

  //클라
  nickName: string;
  setNickName: React.Dispatch<React.SetStateAction<string>>;
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;

  // 3. 로딩 상태
  //isLoading: boolean;
}

interface RawParticipantStatus {
  id: number;
  nickname: string;
  placeSubmitted: boolean;
  timeSubmitted: boolean;
}

export default function MeetingLayout() {
  const { data: meetingData, isLoading: isMeetingLoading } = useGetMeetingDetail();
  const { data: participantData, isLoading: isParticipantLoading } = useParticipantList();
  //const { data: timeData, isLoading: isTimeLoading } = useRecommendTime();
  //const { data: placeData, isLoading: isPlaceLoading } = useRecommendPlace();

  const [nickName, setNickName] = useState('');
  const [id, setId] = useState('');

  const contextValue: MeetingOutletContext = {
    meetingName: meetingData?.result?.name || '',
    isTimeRecommendEnabled: meetingData?.result?.enableTimeRecommendation || false,
    isPlaceRecommendEnabled: meetingData?.result?.enablePlaceRecommendation || false,
    dateType: meetingData?.result?.timeAvailabilityType || '',
    timeRange: [
      parseInt(meetingData?.result?.timeRangeStart?.split(':')[0] || '6', 10),
      parseInt(meetingData?.result?.timeRangeEnd?.split(':')[0] || '24', 10),
    ],
    participantStatusList: (participantData?.result || []).map(
      (p: RawParticipantStatus): ParticipantStatus => ({
        id: p.id,
        nickName: p.nickname, // nickname -> nickName
        hasPlaceInput: p.placeSubmitted, // placeSubmitted -> hasPlaceInput
        hasTimeInput: p.timeSubmitted, // timeSubmitted -> hasTimeInput
      }),
    ),
    //commonTimeList: timeData?.commonTimeList,
    //recommendTimeList: timeData?.recommendTimeList,
    //recommendPlaceList: placeData?.recommendPlaceList,

    nickName,
    setNickName,
    id,
    setId,

    //isLoading: isMeetingLoading || isParticipantLoading || isTimeLoading || isPlaceLoading,
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
