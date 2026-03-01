import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { recommendKeys } from './queryKeys';

import {
  calculateRecommendPlace,
  calculateRecommendTime,
  getRecommendPlace,
  getRecommendResult,
  getRecommendTime,
} from '@/features/api/recommendApi';

//추천 시간 조회
export const useRecommendTime = () => {
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token'); // 토큰 가져오기

  return useQuery({
    queryKey: recommendKeys.time(code!, token),
    queryFn: () => getRecommendTime(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });
};

//추천 시간 계산 요청
export const useCalculateRecommendTime = () => {
  const queryClient = useQueryClient();
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token'); // 토큰 가져오기

  return useMutation({
    mutationFn: () => calculateRecommendTime(code!),

    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries({
          queryKey: recommendKeys.time(code!, token),
        });
      }
    },
  });
};

//추천 장소 조회
export const useRecommendPlace = () => {
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token'); // 토큰 가져오기

  return useQuery({
    queryKey: recommendKeys.place(code!, token),
    queryFn: () => getRecommendPlace(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });
};

//추천 시간 계산 요청
export const useCalculateRecommendPlace = () => {
  const queryClient = useQueryClient();
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token'); // 토큰 가져오기

  return useMutation({
    mutationFn: () => calculateRecommendPlace(code!),

    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries({
          queryKey: recommendKeys.place(code!, token),
        });
      }
    },
  });
};

//추천 결과 조회
export const useRecommendResult = () => {
  const { code } = useParams<{ code: string }>();
  const token = localStorage.getItem('meeting_token'); // 토큰 가져오기
  return useQuery({
    queryKey: recommendKeys.result(code!, token),
    queryFn: () => getRecommendResult(code!),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });
};
