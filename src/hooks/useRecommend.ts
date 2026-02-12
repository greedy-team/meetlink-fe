import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { recommendKeys } from './queryKeys';

import { getRecommendPlace, getRecommendTime } from '@/features/api/recommendApi';

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
