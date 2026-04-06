import { Share } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface IosPwaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IosPwaGuideModal({ isOpen, onClose }: IosPwaGuideModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-[90%] rounded-2xl">
        <AlertDialogHeader className="flex flex-col items-center gap-1">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
            <Share className="h-6 w-6 text-gray-600" />
          </div>
          <AlertDialogTitle className="text-center">
            아이폰은 홈 화면에 추가해야
            <br />
            알림을 받을 수 있어요
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-center leading-relaxed">
            1. 브라우저 하단의 <b>공유 버튼(네모 화살표)</b>을 누르세요
            <br />
            2. <b>[홈 화면에 추가]</b>를 선택하세요
            <br />
            3. 바탕화면에 생긴 앱으로 접속해주세요
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2 flex-row gap-2">
          <AlertDialogAction
            onClick={onClose}
            className="bg-greedy! hover:bg-greedy/50! h-10 flex-1 cursor-pointer rounded-xl text-white shadow-none!"
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
