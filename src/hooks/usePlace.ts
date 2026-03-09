import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { participantKeys, placeKeys, recommendKeys } from './queryKeys';

import { getMyStartPlace, updateMyStartPlace } from '@/features/api/placeApi';
import { type UpdateMyStartPlaceRequest } from '@/types/apiTypes';

//출발지 조회
export const useGetMyStartPlace = () => {
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token');

  return useQuery({
    queryKey: placeKeys.my(code!, token),
    queryFn: () => getMyStartPlace(code!),
    enabled: !!code && !!token,
    staleTime: 1000 * 60 * 5,
    // 404 에러(장소 입력 정보 없음)일 때 불필요한 재시도 방지
    retry: (failureCount, error: unknown) => {
      const err = error as { response?: { status?: number } };

      if (err?.response?.status === 404) {
        return false;
      }
      // 그 외 통신 에러(500 등)는 최대 3번까지 재시도
      return failureCount < 3;
    },
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
        queryKey: placeKeys.all,
      });

      //참여자 현황 리패치
      queryClient.invalidateQueries({
        queryKey: participantKeys.list(code!, token),
      });

      //추천 결과 래패치
      queryClient.invalidateQueries({
        queryKey: recommendKeys.all,
      });
    },
    onError: () => {
      // 서버와 통신 실패
    },
  });
};
