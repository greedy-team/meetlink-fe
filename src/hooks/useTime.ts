import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { timeKeys } from './queryKeys';

import {
  getMyAvailableTime,
  getWholeAvailableTime,
  updateMyAvailableTime,
} from '@/features/api/timeApi';
import { type UpdateMyAvailableTimeRequest } from '@/types/apiTypes';

//가능 시간 조회
export const useGetMyAvailableTime = () => {
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token');

  return useQuery({
    queryKey: timeKeys.my(code!, token),
    queryFn: () => getMyAvailableTime(code!),
    enabled: !!code && !!token,
    staleTime: 1000 * 60 * 5,
  });
};

//가능 시간 조회
export const useGetWholeAvailableTime = () => {
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token'); // 토큰 가져오기

  return useQuery({
    queryKey: timeKeys.whole(code!, token),
    queryFn: () => getWholeAvailableTime(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });
};

//가능 시간 등록
export const useUpdateMyAvailableTime = () => {
  const { code } = useParams<{ code: string }>();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('meeting_token'); // 토큰 가져오기

  return useMutation({
    mutationFn: (body: UpdateMyAvailableTimeRequest) => updateMyAvailableTime(code!, body),
    onSuccess: () => {
      // 내 가능 시간 리패치
      queryClient.invalidateQueries({
        queryKey: timeKeys.my(code!, token),
      });
    },
    onError: () => {
      // 서버와 통신 실패
    },
  });
};
