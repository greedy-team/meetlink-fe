import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { participantKeys, placeKeys } from './queryKeys';

import { getMyStartPlace, updateMyStartPlace } from '@/features/api/placeApi';
import { type UpdateMyStartPlaceRequest } from '@/types/apiTypes';

//출발지 조회
export const useGetMyStartPlace = () => {
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token');

  return useQuery({
    queryKey: placeKeys.my(code!, token),
    queryFn: () => getMyStartPlace(code!, token!),
    enabled: !!code && !!token,
    staleTime: 1000 * 60 * 5,
  });
};

//출발지 등록
export const useUpdateMyStartPlace = () => {
  const { code } = useParams<{ code: string }>();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('meeting_token');

  return useMutation({
    mutationFn: (body: UpdateMyStartPlaceRequest) => updateMyStartPlace(code!, body),
    onSuccess: () => {
      //내 출발지 리패치
      queryClient.invalidateQueries({
        queryKey: placeKeys.my(code!, token),
      });

      //참여자 현황 리패치
      queryClient.invalidateQueries({
        queryKey: participantKeys.list(code!, token),
      });
    },
    onError: () => {
      // 서버와 통신 실패
    },
  });
};
