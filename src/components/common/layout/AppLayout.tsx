import type { ReactNode } from 'react';

type AppLayoutProps = {
  header?: ReactNode;
  children: ReactNode;
  bottom?: ReactNode;
  pageBackgroundClassName?: string;
  maxWidthClassName?: string;
};

export function AppLayout({
  header,
  children,
  bottom,
  pageBackgroundClassName = 'bg-white',
  maxWidthClassName = 'max-w-full md:max-w-[30rem] lg:max-w-[35rem]',
}: AppLayoutProps) {
  return (
    /* 1. flex flex-col를 추가하여 내부 마진이 밖으로 나가지 않도록 가둡니다. */
    <div className={`flex min-h-dvh w-full flex-col ${pageBackgroundClassName}`}>
      <div className={['mx-auto flex w-full flex-1 flex-col', maxWidthClassName].join(' ')}>
        {header}
        {/* 본문에 bottom이 있으면 가려짐 방지 padding 추가 */}
        {/* 2. flex-1을 주어 본문 영역이 남은 공간을 정확히 차지하게 합니다. */}
        <main className="flex-1 px-4 py-4">
          {children}
          {/* 하단 고정 영역과 동일한 높이를 가지는 투명 요소 추가 */}
          {bottom && (
            <div className="pointer-events-none invisible" aria-hidden="true">
              <div
                className={['w-full px-4 pt-3', 'pb-[calc(1rem+env(safe-area-inset-bottom))]'].join(
                  ' ',
                )}
              >
                {bottom}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 하단 고정 영역 */}
      {bottom && (
        <div className="fixed right-0 bottom-0 left-0 z-50 bg-white shadow-sm">
          <div
            className={[
              'mx-auto w-full',
              maxWidthClassName,
              'px-4 pt-3',
              'pb-[calc(1rem+env(safe-area-inset-bottom))]',
              /* 아이폰 인디케이터 영역 고려 */
            ].join(' ')}
          >
            {bottom}
          </div>
        </div>
      )}
    </div>
  );
}
