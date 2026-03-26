import React, { useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

import { ParticipantStatusItem } from './ParticipantStatusItem';

import { type ParticipantList } from '@/types/meetingTypes';

interface ParticipantStatusListProps {
  list: ParticipantList;
  className?: string;
  isTimeRecommendEnabled: boolean;
  isPlaceRecommendEnabled: boolean;
  isLoading?: boolean;
  isHost: boolean;
  onTransferHost: (nickName: string) => void;
}

export function ParticipantStatusList({
  list,
  className,
  isTimeRecommendEnabled,
  isPlaceRecommendEnabled,
  isLoading = false,
  isHost,
  onTransferHost,
}: ParticipantStatusListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [targetNickName, setTargetNickName] = useState<string | null>(null);

  //처음에는 최대 3명만 보기
  const visibleList = isExpanded ? list : list.slice(0, 3);
  const showExpandButton = list.length > 3;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="overflow-hidden rounded-3xl border-2 border-gray-200 bg-gray-50">
        <div className="flex flex-col">
          {visibleList.map((participant, index) => {
            const isMe = index === 0;
            const canTransfer = isHost && !isMe; // 방장이고 본인이 아닐 때만 클릭 가능

            return (
              <div key={`${participant.nickName}-${index}`}>
                <ParticipantStatusItem
                  {...participant}
                  isMe={isMe}
                  hasTimeInput={participant.hasTimeInput}
                  hasPlaceInput={participant.hasPlaceInput}
                  isHost={participant.isHost}
                  isTimeRecommendEnabled={isTimeRecommendEnabled}
                  isPlaceRecommendEnabled={isPlaceRecommendEnabled}
                  isLoading={isLoading}
                  isClickable={canTransfer}
                  onClick={() => {
                    if (canTransfer) {
                      setTargetNickName(participant.nickName);
                    }
                  }}
                />

                {!(index === visibleList.length - 1 && !showExpandButton) && (
                  <div className="px-3 py-1">
                    <div className="h-0.5 w-full bg-gray-100" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 모든 참여자 리스트 보기 */}
        {showExpandButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'w-full cursor-pointer border-t border-gray-100 bg-gray-50 py-1 transition-colors hover:bg-gray-100',
              'flex items-center justify-center text-sm font-medium text-gray-500',
            )}
          >
            {isExpanded ? (
              <span className="flex items-center gap-1">
                접기 <ChevronUp className="h-4 w-4" />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                모든 참여자 보기 <ChevronDown className="h-4 w-4" />
              </span>
            )}
          </button>
        )}
      </div>

      {/* 리스트 바깥에서 단일 모달로 렌더링 (상태에 따라 열림/닫힘) */}
      <AlertDialog
        open={targetNickName !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setTargetNickName(null);
        }}
      >
        <AlertDialogContent className="w-[90%] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>모임장을 양도할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              {targetNickName}님에게 모임장 권한을 넘겨요
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel className="h-10 flex-1 cursor-pointer rounded-xl border-2 bg-white shadow-none! hover:bg-gray-100">
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (targetNickName) {
                  onTransferHost(targetNickName);
                  setTargetNickName(null); // 양도 후 모달 닫기
                }
              }}
              className="bg-greedy! hover:bg-greedy/50! h-10 flex-1 cursor-pointer rounded-xl text-white shadow-none!"
            >
              양도하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
