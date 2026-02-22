import { useState } from 'react';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { useGetMeetingDetail } from '@/hooks/useMeeting';
import { useMyStatus, useParticipantList } from '@/hooks/useParticipant';

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
  selectedTimeList: SelectedTime[];
  setSelectedTimeList: React.Dispatch<React.SetStateAction<SelectedTime[]>>;

  nickName: string;
  id: string;

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

  const token = localStorage.getItem('meeting_token');

  const isJoinPage = pathname.endsWith('/join') || pathname.endsWith('/reconnect');
  const isInputPage = pathname.includes('/input');

  useEffect(() => {
    // 토큰이 없는 경우
    // join 관련 페이지도 아니고, input 페이지도 아닐 때만 join으로 보냅니다.
    if (!isJoinPage && !isInputPage && !token) {
      navigate(`/meeting/${code}/join`, { replace: true });
      return;
    }

    // 서버 요청 중일 때는 판단을 유보하고 대기합니다.
    if (isMyStatusLoading || isMyStatusFetching) return;

    // 2. 토큰은 있으나 서버에서 권한이 없다고 판단한 경우 (잘못된 토큰 등)
    // 이 역시 input 페이지가 아닐 때만 체크하여 join으로 보냅니다.
    if (!isJoinPage && token && (isMyStatusError || !myStatusData?.status)) {
      navigate(`/meeting/${code}/join`, { replace: true });
    }

    // 3. 이미 참여 완료된 사용자가 '참여/재접속' 페이지로 접근하는 경우 메인으로 보냅니다.
    if (isJoinPage && token && myStatusData?.status) {
      navigate(`/meeting/${code}`, { replace: true });
    }
  }, [
    isJoinPage,
    isInputPage, // 의존성 배열에 추가
    myStatusData,
    isMyStatusError,
    isMyStatusLoading,
    isMyStatusFetching,
    token,
    navigate,
    code,
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
        id: p.id,
        nickName: p.nickname,
        hasPlaceInput: p.placeSubmitted,
        hasTimeInput: p.timeSubmitted,
      }),
    ),
    selectedTimeList,
    setSelectedTimeList,

    nickName: myStatusData?.result?.nickname || '',
    id: myStatusData?.result?.id?.toString() || '',

    //isLoading: isMeetingLoading || isParticipantLoading || isTimeLoading || isPlaceLoading,
  };

  if (
    (!isJoinPage && !isInputPage && !token) ||
    isMyStatusLoading ||
    isMyStatusFetching ||
    isMeetingLoading ||
    isParticipantLoading
  ) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <span className="font-medium text-gray-500">데이터를 불러오는 중입니다...</span>
      </div>
    );
  }

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
