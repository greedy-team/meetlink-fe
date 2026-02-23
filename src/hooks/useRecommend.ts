import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { recommendKeys } from './queryKeys';

import {
  calculateRecommendTime,
  getRecommendPlace,
  getRecommendResult,
  getRecommendTime,
} from '@/features/api/recommendApi';

//추천 시간 조회
export const useRecommendTime = () => {
  const { code } = useParams<{ code: string }>();

  return useQuery({
    queryKey: recommendKeys.time(code!),
    queryFn: () => getRecommendTime(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });
};

//추천 시간 계산 요청
export const useCalculateRecommendTime = () => {
  const queryClient = useQueryClient();
  const { code } = useParams<{ code: string }>();

  return useMutation({
    // 1. 함수를 직접 실행하지 말고, 실행하는 '함수'를 전달하세요.
    mutationFn: () => calculateRecommendTime(code!),

    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries({
          queryKey: recommendKeys.time(code!),
        });
      }
    },
  });
};

//추천 장소 조회
export const useRecommendPlace = () => {
  const { code } = useParams<{ code: string }>();

  return useQuery({
    queryKey: recommendKeys.place(code!),
    queryFn: () => getRecommendPlace(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });
};

//추천 결과 조회
export const useRecommendResult = () => {
  const { code } = useParams<{ code: string }>();
  return useQuery({
    queryKey: recommendKeys.result(code!),
    queryFn: () => getRecommendResult(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });
};
