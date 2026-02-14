import { useNavigate } from 'react-router-dom';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';

export default function StartPage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('create');
  };

  return (
    <AppLayout
      header={''}
      pageBackgroundClassName="bg-gray-100/70"
      bottom={
        <div className="flex items-center pt-2">
          <FixedBottomButton
            className="bg-greedy hover:bg-greedy/50 mx-auto h-17 w-95/100 rounded-4xl text-xl"
            onClick={handleStartClick}
          >
            시작하기
          </FixedBottomButton>
        </div>
      }
    >
      <div className="mt-40 flex flex-col gap-5 text-center">
        <div className="text-4xl font-bold">
          결정 안되던 약속, <br />
          여기서 끝내세요
        </div>
        <div className="text-gray-500">
          모두의 시간과 위치를 고려해 <br />
          가장 납득이 되는 약속을 만들어 드릴게요
        </div>
      </div>
    </AppLayout>
  );
}
