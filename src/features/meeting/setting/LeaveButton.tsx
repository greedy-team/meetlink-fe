import { LogOut } from 'lucide-react';

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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LeaveButtonProps {
  onLeave: () => void;
  className?: string;
}

export function LeaveButton({ onLeave, className }: LeaveButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600',
            'my-3 h-14 w-full rounded-2xl py-3 font-semibold transition-all',
            'flex flex-row items-center justify-start gap-3',
            className, // 외부에서 위치 조정을 위한 커스텀 클래스 허용
          )}
        >
          <div className="w-1" />
          <LogOut
            size={22}
            strokeWidth={2.5}
            className="h-auto! w-auto! shrink-0 transition-colors"
          />
          <span className="text-base">모임 나가기</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[85%] rounded-2xl md:w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>모임에서 나가시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            참여자 정보는 저장되지 않습니다. 재참가 시 정보 재입력이 필요합니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row gap-2">
          <AlertDialogCancel className="mt-0 flex-1 rounded-xl border-none bg-gray-100 hover:bg-gray-200">
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onLeave}
            className="bg-greedy hover:bg-greedy/80 flex-1 rounded-xl text-white"
          >
            나가기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
