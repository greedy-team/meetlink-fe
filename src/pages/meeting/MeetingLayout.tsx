import { useState } from 'react';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { useGetMeetingDetail } from '@/hooks/useMeeting';
import { useMyStatus, useParticipantList } from '@/hooks/useParticipant';

import type { UpdateMyStartPlaceRequest } from '@/types/apiTypes';
import {
  type ParticipantList,
  type ParticipantStatus,
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
  selectedTimeList: SelectedTime[];
  setSelectedTimeList: React.Dispatch<React.SetStateAction<SelectedTime[]>>;
  selectedPlace: UpdateMyStartPlaceRequest;
  setSelectedPlace: React.Dispatch<React.SetStateAction<UpdateMyStartPlaceRequest>>;
  // 임시 닉네임 보관용
  tempNickName: string;
  setTempNickName: React.Dispatch<React.SetStateAction<string>>;

  nickName: string;

  isLoading: boolean;
}

interface RawParticipantStatus {
  nickname: string;
  token?: string;
  placeSubmitted?: boolean;
  timeSubmitted?: boolean;
}

export default function MeetingLayout() {
  const { code } = useParams<{ code: string }>();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: meetingData, isLoading: isMeetingLoading } = useGetMeetingDetail();
  const {
    data: myStatusData,
    isLoading: isMyStatusLoading,
    isFetching: isMyStatusFetching,
    isError: isMyStatusError,
  } = useMyStatus();
  const { data: participantData, isLoading: isParticipantLoading } = useParticipantList();

  const [selectedTimeList, setSelectedTimeList] = useState<SelectedTime[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<UpdateMyStartPlaceRequest>({
    address: '',
    latitude: 0,
    longitude: 0,
  });
  const [tempNickName, setTempNickName] = useState<string>('');

  const token = localStorage.getItem('meeting_token');

  const isJoinPage = pathname.endsWith('/join') || pathname.endsWith('/reconnect');
  const isInputPage = pathname.includes('/input');

  useEffect(() => {
    //토큰이 없는데, 참가 페이지도 아니고 입력 페이지도 아님.
    if (!isJoinPage && !isInputPage && !token) {
      navigate(`/meeting/${code}/join`, { replace: true });
      return;
    }

    //내 상태 요청중이라면 - 내가 이 모임에 참여되어 있는지 확인
    if (isMyStatusLoading || isMyStatusFetching) return;

    //토큰은 있는데 참가 페이지가 아니고 잘못된 토큰을 가지고 있는 경우
    if (token && !isJoinPage && (isMyStatusError || !myStatusData?.status)) {
      navigate(`/meeting/${code}/join`, { replace: true });
    }

    //토큰이 있고 모임에 이미 참여했었는데 참가 페이지라면
    if (token && isJoinPage && myStatusData?.status) {
      navigate(`/meeting/${code}`, { replace: true });
    }
  }, [
    isJoinPage,
    isInputPage,
    myStatusData,
    isMyStatusError,
    isMyStatusLoading,
    isMyStatusFetching,
    token,
    code,
    navigate,
  ]);

  const contextValue: MeetingOutletContext = {
    meetingName: meetingData?.result?.name || '',
    isTimeRecommendEnabled: meetingData?.result?.enableTimeRecommendation || false,
    isPlaceRecommendEnabled: meetingData?.result?.enablePlaceRecommendation || false,
    dateType: meetingData?.result?.timeAvailabilityType || '',
    timeRange: [
      parseInt(meetingData?.result?.timeRangeStart?.split(':')[0] || '6', 10),
      // End Time 파싱 로직: 23이면 24로 올림 처리
      ((hour: number) => (hour === 23 ? 24 : hour))(
        parseInt(meetingData?.result?.timeRangeEnd?.split(':')[0] || '24', 10),
      ),
    ],
    participantStatusList: (participantData?.result || []).map(
      (p: RawParticipantStatus): ParticipantStatus => ({
        nickName: p.nickname,
        token: p?.token,
        hasPlaceInput: p?.placeSubmitted,
        hasTimeInput: p?.timeSubmitted,
      }),
    ),
    selectedTimeList,
    setSelectedTimeList,
    selectedPlace,
    setSelectedPlace,
    tempNickName,
    setTempNickName,

    nickName: myStatusData?.result?.nickname || '',

    isLoading: isMeetingLoading || isParticipantLoading,
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
