import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { participantKeys } from './queryKeys';

import {
  getMyStatus,
  getParticipantList,
  joinMeeting,
  leaveMeeting,
} from '@/features/api/participantApi';
import { type JoinMeetingRequest } from '@/types/apiTypes';

//모임 참여
export const useJoinMeeting = () => {
  const { code } = useParams<{ code: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: JoinMeetingRequest) => joinMeeting(code!, body),

    onSuccess: (data) => {
      if (data.status && data.result?.token) {
        localStorage.setItem('meeting_token', data.result.token);

        queryClient.invalidateQueries({ queryKey: participantKeys.all });
      }
    },
    onError: () => {
      //실패시 처리
    },
  });
};

//모임 참여자 목록 조회
export const useParticipantList = () => {
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token'); // 토큰 가져오기

  return useQuery({
    queryKey: participantKeys.list(code!, token), // 쿼리 키에 토큰 전달
    queryFn: () => getParticipantList(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });
};

//내 참여 상태 조회
export const useMyStatus = () => {
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token'); // 토큰 가져오기

  return useQuery({
    queryKey: participantKeys.status(code!, token), //  쿼리 키에 토큰 전달
    queryFn: () => getMyStatus(code!),
    enabled: !!code && !!token,
    staleTime: 1000 * 60 * 5,
    // 에러 유형에 따른 재시도 로직 추가
    retry: (failureCount: number, error: AxiosError) => {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        return false;
      }
      // 그 외 일시적 에러(네트워크 끊김 등)는 기본값처럼 최대 3번까지 재시도
      return failureCount < 3;
    },
  });
};

//모임 나가기
export const useLeaveMeeting = () => {
  const { code } = useParams<{ code: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => leaveMeeting(code!),

    onSuccess: () => {
      localStorage.removeItem('meeting_token');
      queryClient.removeQueries({
        queryKey: participantKeys.all,
      });
    },
    onError: () => {
      //실패 시 처리
    },
  });
};
