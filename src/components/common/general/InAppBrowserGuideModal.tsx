import { ExternalLink } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface InAppBrowserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InAppBrowserGuideModal({ isOpen, onClose }: InAppBrowserGuideModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-[90%] rounded-2xl">
        <AlertDialogHeader className="flex flex-col items-center gap-1">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
            <ExternalLink className="h-6 w-6 text-gray-600" />
          </div>

          <AlertDialogTitle className="text-center">
            인앱 브라우저에서는
            <br />
            알림을 설정할 수 없어요
          </AlertDialogTitle>

          <AlertDialogDescription className="mt-2 text-center leading-relaxed">
            카카오톡 같은 인앱 브라우저에서는
            <br />
            웹 알림이 지원되지 않아요.
            <br />
            <br />
            브라우저 메뉴에서 <b>[외부 브라우저로 열기]</b>를 눌러
            <br />
            크롬 또는 사파리에서 다시 접속해주세요.
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
