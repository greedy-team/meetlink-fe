import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { placeKeys } from './queryKeys';

import { getMyStartPlace, updateMyStartPlace } from '@/features/api/placeApi';
import { type UpdateMyStartPlaceRequest } from '@/types/apiTypes';

//출발지 조회
export const useGetMyStartPlace = (id: string) => {
  const { code } = useParams<{ code: string }>();

  return useQuery({
    queryKey: placeKeys.my(code!, id),
    queryFn: () => getMyStartPlace(code!, id),
    enabled: !!code && !!id,
    staleTime: 1000 * 60 * 5,
  });
};

//출발지 등록
export const useUpdateMyStartPlace = (id: string) => {
  const { code } = useParams<{ code: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateMyStartPlaceRequest) => updateMyStartPlace(code!, id, body),
    onSuccess: () => {
      // 성공시 데이터 리패치
      queryClient.invalidateQueries({
        queryKey: placeKeys.my(code!, id),
      });
    },
    onError: () => {
      // 서버와 통신 실패
    },
  });
};
