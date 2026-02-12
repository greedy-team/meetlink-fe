import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { timeKeys } from './queryKeys';

import { getMyAvailableTime, updateMyAvailableTime } from '@/features/api/timeApi';
import { type UpdateMyAvailableTimeRequest } from '@/types/apiTypes';

//가능 시간 조회
export const useGetMyAvailableTime = (id: string) => {
  const { code } = useParams<{ code: string }>();

  return useQuery({
    queryKey: timeKeys.my(code!, id),
    queryFn: () => getMyAvailableTime(code!, id),
    enabled: !!code && !!id,
    staleTime: 1000 * 60 * 5,
  });
};

//가능 시간 등록
export const useUpdateMyAvailableTime = (id: string) => {
  const { code } = useParams<{ code: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateMyAvailableTimeRequest) => updateMyAvailableTime(code!, id, body),
    onSuccess: () => {
      // 성공시 데이터 리패치
      queryClient.invalidateQueries({
        queryKey: timeKeys.my(code!, id),
      });
    },
    onError: () => {
      // 서버와 통신 실패
    },
  });
};
