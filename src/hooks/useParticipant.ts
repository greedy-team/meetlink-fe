import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: participantKeys.list(code!),
      });
    },
    onError: () => {
      //실패시
    },
  });
};

//모임 참여자 목록 조회
export const useParticipantList = () => {
  const { code } = useParams<{ code: string }>();

  return useQuery({
    queryKey: participantKeys.list(code!),
    queryFn: () => getParticipantList(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });
};

//내 참여 상태 조회
export const useMyStatus = (id: string) => {
  const { code } = useParams<{ code: string }>();

  return useQuery({
    queryKey: participantKeys.status(code!, id),
    queryFn: () => getMyStatus(code!, id),
    enabled: !!code && !!id,
    staleTime: 1000 * 60 * 5,
  });
};

//모임 나가기
export const useLeaveMeeting = () => {
  const { code } = useParams<{ code: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leaveMeeting(code!, id),

    onSuccess: (_, targetId) => {
      queryClient.invalidateQueries({
        queryKey: participantKeys.list(code!),
      });
      queryClient.removeQueries({
        queryKey: participantKeys.status(code!, targetId),
      });
    },
    onError: () => {
      //실패 시
    },
  });
};
