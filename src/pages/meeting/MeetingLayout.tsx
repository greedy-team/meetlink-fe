import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';

import axios from 'axios';
import { toast } from 'sonner';

import {
  deletePushPermission,
  requestPushPermission,
  subscribeForegroundMessage,
} from '@/lib/firebase';
import { useGetMeetingDetail } from '@/hooks/useMeeting';
import {
  useDeletePushToken,
  useMyStatus,
  useParticipantList,
  useRegisterPushToken,
} from '@/hooks/useParticipant';

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
  // 공통 draft
  selectedTimeList: SelectedTime[];
  setSelectedTimeList: React.Dispatch<React.SetStateAction<SelectedTime[]>>;
  selectedPlace: UpdateMyStartPlaceRequest;
  setSelectedPlace: React.Dispatch<React.SetStateAction<UpdateMyStartPlaceRequest>>;
  tempNickName: string;
  setTempNickName: React.Dispatch<React.SetStateAction<string>>;
  resetGuestDraft: () => void;
  nickName: string;
  isHost: boolean;
  // 조인 페이지 전용 임시 알림 체크값
  joinPushOptIn: boolean;
  setJoinPushOptIn: React.Dispatch<React.SetStateAction<boolean>>;
  // 실제 푸시 상태
  isPushEnabled: boolean;
  isPushProcessing: boolean;
  enablePush: () => Promise<boolean>;
  disablePush: () => Promise<boolean>;

  isLoading: boolean;
}

interface RawParticipantStatus {
  nickname: string;
  token?: string;
  isPlaceSubmitted?: boolean;
  isTimeSubmitted?: boolean;
  isHost: boolean;
}

const EMPTY_PLACE: UpdateMyStartPlaceRequest = {
  name: '',
  address: '',
  latitude: 0,
  longitude: 0,
};

export default function MeetingLayout() {
  const { code } = useParams<{ code: string }>();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const {
    data: meetingData,
    isLoading: isMeetingLoading,
    isError: isMeetingError,
    error: meetingError,
  } = useGetMeetingDetail();

  useEffect(() => {
    if (
      isMeetingError &&
      axios.isAxiosError(meetingError) &&
      meetingError.response?.status === 404
    ) {
      toast.error('존재하지 않는 모임입니다');
      navigate('/');
    }
  }, [isMeetingError, meetingError, navigate]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupForegroundMessage = async () => {
      unsubscribe = await subscribeForegroundMessage();
    };

    setupForegroundMessage();

    return () => {
      unsubscribe?.();
    };
  }, []);

  const {
    data: myStatusData,
    isLoading: isMyStatusLoading,
    isFetching: isMyStatusFetching,
    isError: isMyStatusError,
  } = useMyStatus();
  const { data: participantData, isLoading: isParticipantLoading } = useParticipantList();
  const { mutateAsync: registerPushTokenAsync } = useRegisterPushToken();
  const { mutateAsync: deletePushTokenAsync } = useDeletePushToken();

  // 토큰 유효할 경우 draft
  const [memberSelectedTimeList, setMemberSelectedTimeList] = useState<SelectedTime[]>([]);
  const [memberSelectedPlace, setMemberSelectedPlace] =
    useState<UpdateMyStartPlaceRequest>(EMPTY_PLACE);
  const [memberTempNickName, setMemberTempNickName] = useState<string>('');

  // 그 이외 draft
  const [guestSelectedTimeList, setGuestSelectedTimeList] = useState<SelectedTime[]>([]);
  const [guestSelectedPlace, setGuestSelectedPlace] =
    useState<UpdateMyStartPlaceRequest>(EMPTY_PLACE);
  const [guestTempNickName, setGuestTempNickName] = useState<string>('');

  // 조인 페이지에서만 쓰는 임시 알림 체크값
  const [joinPushOptIn, setJoinPushOptIn] = useState(false);

  // 실제 푸시 활성 상태
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(
    () => localStorage.getItem('push_enabled') === 'true',
  );
  const [isPushProcessing, setIsPushProcessing] = useState(false);

  useEffect(() => {
    if (isPushEnabled) {
      localStorage.setItem('push_enabled', 'true');
    } else {
      localStorage.removeItem('push_enabled');
    }
  }, [isPushEnabled]);

  const enablePush = useCallback(async (): Promise<boolean> => {
    if (isPushProcessing) return false;

    setIsPushProcessing(true);

    try {
      const fcmToken = await requestPushPermission();

      if (!fcmToken) {
        setIsPushEnabled(false);
        return false;
      }

      const response = await registerPushTokenAsync({
        token: fcmToken,
      });

      if (!response.status) {
        setIsPushEnabled(false);
        return false;
      }
      setIsPushEnabled(true);

      return true;
    } catch (error) {
      console.error('푸시 알림 설정 실패:', error);
      setIsPushEnabled(false);
      return false;
    } finally {
      setIsPushProcessing(false);
    }
  }, [isPushProcessing, registerPushTokenAsync]);

  const disablePush = useCallback(async (): Promise<boolean> => {
    if (isPushProcessing) return false;

    setIsPushProcessing(true);

    try {
      const response = await deletePushTokenAsync();

      if (!response.status) {
        return false;
      }

      const isDeleted = await deletePushPermission();
      setIsPushEnabled(false);

      return isDeleted;
    } catch (error) {
      console.error('푸시 알림 해제 실패:', error);
      return false;
    } finally {
      setIsPushProcessing(false);
    }
  }, [isPushProcessing, deletePushTokenAsync]);

  const resetGuestDraft = () => {
    setGuestTempNickName('');
    setGuestSelectedTimeList([]);
    setGuestSelectedPlace(EMPTY_PLACE);
    setJoinPushOptIn(false);
  };

  const token = localStorage.getItem('meeting_token');

  const isJoinPage = pathname.endsWith('/join') || pathname.endsWith('/rejoin');
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
      return;
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

  //세팅 페이지에 있는가?
  const isSettingPage = pathname.includes('/settings');

  useEffect(() => {
    //세팅 페이지에 있는데 호스트가 아니라면
    if (isSettingPage && !myStatusData?.result?.isHost) {
      navigate(`/meeting/${code}`, { replace: true });
    }
  }, [isSettingPage, myStatusData, code, navigate]);

  const hasValidMemberSession = Boolean(token) && Boolean(myStatusData?.status) && !isMyStatusError;

  const selectedTimeList = hasValidMemberSession ? memberSelectedTimeList : guestSelectedTimeList;
  const setSelectedTimeList = hasValidMemberSession
    ? setMemberSelectedTimeList
    : setGuestSelectedTimeList;

  const selectedPlace = hasValidMemberSession ? memberSelectedPlace : guestSelectedPlace;
  const setSelectedPlace = hasValidMemberSession ? setMemberSelectedPlace : setGuestSelectedPlace;

  const tempNickName = hasValidMemberSession ? memberTempNickName : guestTempNickName;
  const setTempNickName = hasValidMemberSession ? setMemberTempNickName : setGuestTempNickName;

  const contextValue: MeetingOutletContext = {
    meetingName: meetingData?.result?.name || '',
    isTimeRecommendEnabled: meetingData?.result?.enableTimeRecommendation || false,
    isPlaceRecommendEnabled: meetingData?.result?.enablePlaceRecommendation || false,
    dateType: meetingData?.result?.timeAvailabilityType || '',
    timeRange: [
      parseInt(meetingData?.result?.timeRangeStart?.split(':')[0] || '6', 10),
      ((hour: number) => (hour === 23 ? 24 : hour))(
        parseInt(meetingData?.result?.timeRangeEnd?.split(':')[0] || '24', 10),
      ),
    ],
    participantStatusList: (participantData?.result || []).map(
      (p: RawParticipantStatus): ParticipantStatus => ({
        nickName: p.nickname,
        token: p?.token,
        hasPlaceInput: p?.isPlaceSubmitted,
        hasTimeInput: p?.isTimeSubmitted,
        isHost: p?.isHost,
      }),
    ),
    selectedTimeList,
    setSelectedTimeList,
    selectedPlace,
    setSelectedPlace,
    tempNickName,
    setTempNickName,

    nickName: myStatusData?.result?.nickname || '',
    isHost: myStatusData?.result?.isHost || false,

    isLoading: isMeetingLoading || isParticipantLoading || isMyStatusLoading || isMyStatusFetching,
    resetGuestDraft,

    joinPushOptIn,
    setJoinPushOptIn,
    isPushEnabled,
    isPushProcessing,
    enablePush,
    disablePush,
  };

  return (
    <div>
      <Outlet context={contextValue} key={contextValue.isLoading ? 'loading' : 'ready'} />
    </div>
  );
}

// 커스텀 훅
export const useMeetingContext = () => {
  return useOutletContext<MeetingOutletContext>();
};
