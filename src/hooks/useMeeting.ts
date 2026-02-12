import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { meetingKeys } from './queryKeys';

import { createMeeting, getMeetingDetail, updateMeetingDetail } from '@/features/api/meetingApi';
import { type UpdateMeetingDetailRequest } from '@/types/apiTypes';

//모임 생성
export const useCreateMeeting = () => {
  return useMutation({
    mutationFn: createMeeting,
    onSuccess: () => {
      //성공 시
    },
    onError: () => {
      //서버와 통신 실패
    },
  });
};

//모임 정보 조회 - 코드 입력과 페이지에서 불러오는 버전 둘다 가능
export const useGetMeetingDetail = (manualCode?: string) => {
  const { code: paramCode } = useParams<{ code: string }>();
  const targetCode = manualCode || paramCode;

  return useQuery({
    queryKey: meetingKeys.detail(targetCode!),
    queryFn: () => getMeetingDetail(targetCode!),
    enabled: !!targetCode,
    staleTime: 1000 * 60 * 5,
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
    },
    onError: () => {
      //서버와 통신 실패
    },
  });
};
