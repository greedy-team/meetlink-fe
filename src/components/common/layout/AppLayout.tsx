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
  const CONTENT_BOTTOM_PADDING = bottom ? 'pb-28' : '';

  return (
    <div className={`min-h-dvh w-full ${pageBackgroundClassName}`}>
      <div className={['mx-auto w-full', maxWidthClassName].join(' ')}>
        {header}
        {/* 본문에 bottom이 있으면 가려짐 방지 padding 추가 */}
        <main className={`px-4 py-4 ${CONTENT_BOTTOM_PADDING}`}>{children}</main>
      </div>

      {/* 하단 고정 영역 */}
      {bottom && (
        <div className="fixed right-0 bottom-0 left-0 bg-white shadow-sm">
          <div
            className={[
              'mx-auto w-full',
              maxWidthClassName,
              'px-4 pt-3',
              /* 아이폰 인디케이터 영역 고려 */
              'pb-[calc(1rem+env(safe-area-inset-bottom))]',
            ].join(' ')}
          >
            {bottom}
          </div>
        </div>
      )}
    </div>
  );
}
