import { useState } from 'react';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { useGetMeetingDetail } from '@/hooks/useMeeting';
import { useMyStatus, useParticipantList } from '@/hooks/useParticipant';
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

  //const { data: timeData, isLoading: isTimeLoading } = useRecommendTime();
  //const { data: placeData, isLoading: isPlaceLoading } = useRecommendPlace();

  const token = localStorage.getItem('meeting_token');

  // 2. 가드 로직 설정
  const isPublicPage = pathname.endsWith('/join') || pathname.endsWith('/reconnect');

  useEffect(() => {
    // 토큰이 아예 없으면 로딩을 기다릴 필요 없이 즉시 join으로
    if (!isPublicPage && !token) {
      navigate(`/meeting/${code}/join`, { replace: true });
      return;
    }

    // 서버 요청 중일 때는 대기
    if (isMyStatusLoading || isMyStatusFetching) return;

    // 토큰은 있으나 서버에서 권한 없다고 한 경우 (예: 잘못된 토큰)
    if (!isPublicPage && (isMyStatusError || !myStatusData?.status)) {
      navigate(`/meeting/${code}/join`, { replace: true });
    }

    // 이미 참여했는데 '참여' 페이지로 접근하는 경우 메인으로
    if (isPublicPage && token && myStatusData?.status) {
      navigate(`/meeting/${code}`, { replace: true });
    }
  }, [
    isPublicPage,
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

    nickName: myStatusData?.result?.nickname || '',
    id: myStatusData?.result?.id?.toString() || '',

    //isLoading: isMeetingLoading || isParticipantLoading || isTimeLoading || isPlaceLoading,
  };

  if (
    !isPublicPage &&
    (!token || isMyStatusLoading || isMyStatusFetching || isMeetingLoading || isParticipantLoading)
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
