import type { ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface LeaveButtonProps {
  onLeave: () => void;
  className?: string;
  children: ReactNode;
}

export function LeaveButton({ onLeave, className, children }: LeaveButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent className="w-[85%] rounded-2xl md:w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>모임에서 나갈까요?</AlertDialogTitle>
          <AlertDialogDescription>
            참여자 정보는 저장되지 않아요. 재참가 시 정보 재입력이 필요해요
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row gap-2">
          <AlertDialogCancel className="h-10 flex-1 cursor-pointer rounded-xl border-2 bg-white shadow-none! hover:bg-gray-100">
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onLeave}
            className="h-10 flex-1 cursor-pointer rounded-xl border-2 border-red-100 bg-red-50 text-red-500! shadow-none! hover:bg-red-100! hover:text-red-600!"
          >
            나가기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
