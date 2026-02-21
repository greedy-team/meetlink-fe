import { NotifyBox } from '@/components/common/general/NotifyBox';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';

type Props = {
  roadAddress: string;
  jibunAddress: string;
  onConfirm: () => void;
  onConfirmDisabled?: boolean;
};

export function PlaceConfirmSheet({
  roadAddress,
  jibunAddress,
  onConfirm,
  onConfirmDisabled,
}: Props) {
  return (
    <div className="rounded-t-3xl bg-white px-5 pt-5 pb-6 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
      <div className="space-y-2">
        <div className="text-2xl font-extrabold text-gray-900">{roadAddress}</div>
        <div className="text-base font-medium text-gray-500">{jibunAddress}</div>
      </div>

      <div className="mt-4">
        <NotifyBox variant="default" className="bg-red-50 text-red-600">
          지도의 표시와 실제 주소가 맞는지 확인해주세요.
        </NotifyBox>
      </div>

      <div className="mt-5">
        <FixedBottomButton
          onClick={onConfirm}
          disabled={onConfirmDisabled}
          className="bg-greedy hover:bg-greedy/50 text-white"
        >
          이 위치로 주소 등록
        </FixedBottomButton>
      </div>
    </div>
  );
}
