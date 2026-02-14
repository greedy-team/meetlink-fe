import { NotifyBox } from '@/components/common/general/NotifyBox';
import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { Header } from '@/components/common/layout/Header';

export default function LayoutPreviewPage() {
  return (
    <AppLayout
      header={<Header title="레이아웃 프리뷰" />}
      pageBackgroundClassName="bg-gray-100/70"
      bottom={
        <div className="space-y-3">
          {/* 기본 버튼 */}
          <FixedBottomButton>확인</FixedBottomButton>

          {/* 로딩 상태 확인 */}
          <FixedBottomButton loading>저장 중</FixedBottomButton>
        </div>
      }
    >
      <div className="space-y-4">
        {/* NotifyBox 확인 */}
        <NotifyBox variant="default">
          회색 기본 안내 박스입니다. 한 줄/두 줄 줄바꿈도 같이 확인하세요.
        </NotifyBox>

        <NotifyBox variant="emphasis">
          강조 안내 박스입니다. 중요한 공지/주의 문구에 사용합니다.
        </NotifyBox>

        {/* 스크롤/여백/폭 확인용 더미 콘텐츠 */}
        <div className="h-40 rounded-xl bg-white/80" />
        <div className="h-40 rounded-xl bg-white/80" />
        <div className="h-40 rounded-xl bg-white/80" />
        <div className="h-40 rounded-xl bg-white/80" />
      </div>
    </AppLayout>
  );
}
