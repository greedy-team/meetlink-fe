import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import axios from 'axios';

import { meetingKeys, participantKeys, recommendKeys } from './queryKeys';

import { createMeeting, getMeetingDetail, updateMeetingDetail } from '@/features/api/meetingApi';
import { type UpdateMeetingDetailRequest } from '@/types/apiTypes';

//모임 생성
export const useCreateMeeting = () => {
  return useMutation({
    mutationFn: createMeeting,
  });
};

//모임 정보 조회
export const useGetMeetingDetail = () => {
  const { code } = useParams<{ code: string }>();

  return useQuery({
    queryKey: meetingKeys.detail(code!),
    queryFn: () => getMeetingDetail(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      //404 에러 일때만
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

//모임 정보 수정
export const useUpdateMeetingDetail = () => {
  const { code } = useParams<{ code: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateMeetingDetailRequest) => updateMeetingDetail(code!, body),
    onSuccess: () => {
      //성공시 데이터 리패치
      queryClient.invalidateQueries({
        queryKey: meetingKeys.detail(code!),
      });
      queryClient.invalidateQueries({
        queryKey: recommendKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: participantKeys.all,
      });
    },
    onError: () => {
      //서버와 통신 실패
    },
  });
};
