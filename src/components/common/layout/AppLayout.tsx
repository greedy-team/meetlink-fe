import type { ReactNode } from 'react';

type AppLayoutProps = {
  header?: ReactNode;
  children: ReactNode;
  bottom?: ReactNode;
  pageBackgroundClassName?: string;
  maxWidthClassName?: string;
  // 지도 페이지용
  disableMainPadding?: boolean;
  disableBottomPadding?: boolean;
  disableBottomSpacer?: boolean;
};

export function AppLayout({
  header,
  children,
  bottom,
  pageBackgroundClassName = 'bg-white',
  maxWidthClassName = 'max-w-full md:max-w-[35rem] lg:max-w-[45rem]',
  disableMainPadding = false,
  disableBottomPadding = false,
  disableBottomSpacer = false,
}: AppLayoutProps) {
  return (
    <div className={`flex min-h-dvh w-full flex-col ${pageBackgroundClassName}`}>
      <div className={['mx-auto flex w-full flex-1 flex-col', maxWidthClassName].join(' ')}>
        {header}
        <main
          className={['flex min-h-0 flex-1 flex-col', disableMainPadding ? '' : 'px-4 py-4'].join(
            ' ',
          )}
        >
          {children}
          {/* 하단 고정 영역과 동일한 높이를 가지는 투명 요소 추가 */}
          {bottom && !disableBottomSpacer && (
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
              disableBottomPadding ? '' : 'px-4 pt-3',
              disableBottomPadding
                ? 'pb-[env(safe-area-inset-bottom)]'
                : 'pb-[calc(1rem+env(safe-area-inset-bottom))]',
            ].join(' ')}
          >
            {bottom}
          </div>
        </div>
      )}
    </div>
  );
}
