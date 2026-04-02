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

interface DisablePushModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DisablePushModal({ isOpen, onClose, onConfirm }: DisablePushModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-[85%] rounded-2xl md:w-full">
        <AlertDialogHeader className="flex flex-col gap-1 pt-2">
          <AlertDialogTitle className="text-center">알림을 끌까요?</AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-center leading-relaxed">
            더 이상 모임 결과 알림을 받을 수 없어요
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2 flex-row gap-2">
          <AlertDialogCancel
            onClick={onClose}
            className="h-10 flex-1 cursor-pointer rounded-xl border-2 bg-white shadow-none! hover:bg-gray-100"
          >
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="h-10 flex-1 cursor-pointer rounded-xl border-2 border-red-100 bg-red-50 text-red-500! shadow-none! hover:bg-red-100! hover:text-red-600!"
          >
            끄기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
