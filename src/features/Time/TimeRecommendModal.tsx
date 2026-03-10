import { useCallback, useEffect, useMemo, useState } from 'react';

import { animate, motion, type PanInfo, useMotionValue } from 'framer-motion';

import { TimeRecommendCard } from './TimeRecommendCard';

import { type SelectedTime } from '@/types/meetingTypes';

const SHEET_CONFIG = {
  FULL_VH: 90,
  HALF_VH: 50,
  PEEK_PX: 70,
};

const SPRING = { type: 'spring', damping: 30, stiffness: 300, mass: 0.8 } as const;

type SheetState = 'peek' | 'half' | 'full';

export interface Candidate {
  availableCount: number;
  date: string;
  dayOfWeek: number;
  endTime: string;
  rank: number;
  startTime: string;
}

interface TimeRecommendModalProps {
  candidateList: Candidate[] | undefined;
  participantsNum: number;
  maxAvailableNum: number;
  setSelectedDate: (date: Date) => void;
  timeRange: [number, number];
  commonTimeList: SelectedTime[];
  dateType: string;
  setSelectedRecommendDate: (date: string | number) => void;
}

function getSafeAreaBottom(): number {
  if (typeof window === 'undefined') return 0;
  const el = document.createElement('div');
  el.style.cssText =
    'position:fixed;bottom:0;left:0;width:0;height:0;padding-bottom:env(safe-area-inset-bottom);visibility:hidden;pointer-events:none;';
  document.body.appendChild(el);
  const value = parseInt(getComputedStyle(el).paddingBottom, 10) || 0;
  document.body.removeChild(el);
  return value;
}

function getViewportHeight(): number {
  if (typeof window === 'undefined') return 800;
  return window.visualViewport?.height ?? window.innerHeight;
}

export default function TimeRecommendModal({
  candidateList,
  participantsNum,
  maxAvailableNum,
  setSelectedDate,
  timeRange,
  commonTimeList,
  dateType,
  setSelectedRecommendDate,
}: TimeRecommendModalProps) {
  const [sheetState, setSheetState] = useState<SheetState>('peek');
  const [viewportHeight, setViewportHeight] = useState(getViewportHeight);
  const [safeAreaBottom, setSafeAreaBottom] = useState(() => getSafeAreaBottom());
  const y = useMotionValue(0);

  const [selectedCardKey, setSelectedCardKey] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(getViewportHeight());
      setSafeAreaBottom(getSafeAreaBottom());
    };
    window.visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const isOpened = sheetState !== 'peek';
    document.body.style.overflow = isOpened ? 'hidden' : '';
    document.body.style.touchAction = isOpened ? 'none' : 'auto';
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = 'auto';
    };
  }, [sheetState]);

  const modalHeight = useMemo(
    () => viewportHeight * (SHEET_CONFIG.FULL_VH / 100),
    [viewportHeight],
  );

  const snapPoints = useMemo(() => {
    const peekVisible = SHEET_CONFIG.PEEK_PX + safeAreaBottom;
    return {
      full: 0,
      half: viewportHeight * ((SHEET_CONFIG.FULL_VH - SHEET_CONFIG.HALF_VH) / 100),
      peek: modalHeight - peekVisible,
    };
  }, [viewportHeight, safeAreaBottom, modalHeight]);

  useEffect(() => {
    y.set(snapPoints[sheetState]);
  }, [snapPoints, sheetState, y]);

  useEffect(() => {
    y.set(snapPoints.peek);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const snapTo = useCallback(
    (state: SheetState) => {
      setSheetState(state);
      animate(y, snapPoints[state], SPRING);
    },
    [snapPoints, y],
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const currentY = y.get();
      const projectedY = currentY + info.velocity.y * 0.1;

      const closest = (
        [
          { state: 'full' as SheetState, val: snapPoints.full },
          { state: 'half' as SheetState, val: snapPoints.half },
          { state: 'peek' as SheetState, val: snapPoints.peek },
        ] as const
      ).reduce((a, b) => (Math.abs(projectedY - a.val) <= Math.abs(projectedY - b.val) ? a : b));

      snapTo(closest.state);
    },
    [y, snapPoints, snapTo],
  );

  const handleCardClick = useCallback(
    (candidate: Candidate) => {
      setSelectedCardKey(`${candidate.date}-${candidate.dayOfWeek}-${candidate.startTime}`);

      if (dateType !== 'WEEKLY' && candidate.date) {
        setSelectedDate(new Date(candidate.date));
      }
      if (dateType === 'WEEKLY') {
        setSelectedRecommendDate(candidate.dayOfWeek);
      } else {
        setSelectedRecommendDate(candidate.date);
      }
      snapTo('peek');
    },
    [dateType, setSelectedDate, snapTo, setSelectedRecommendDate],
  );

  if (!candidateList || candidateList.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-dvh overflow-hidden">
      {sheetState !== 'peek' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          onClick={() => snapTo('peek')}
          className="pointer-events-auto absolute inset-0 cursor-pointer bg-black"
        />
      )}

      <motion.div
        style={{ y, height: `${modalHeight}px` }}
        drag="y"
        dragConstraints={{ top: snapPoints.full, bottom: snapPoints.peek }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col rounded-t-4xl bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        <button
          onClick={() => sheetState === 'peek' && snapTo('half')}
          className="flex cursor-grab flex-col items-center pt-3 pb-4 active:cursor-grabbing"
          aria-label="Expand recommendation sheet"
        >
          <div className="mb-3 h-2 w-30 rounded-full bg-gray-200" />
          <div className="flex w-full items-center justify-between px-6">
            <h2 className="text-xl font-bold text-gray-900">추천 만남 시간</h2>
            <div className="text-greedy bg-greedy/10 rounded-full px-3 py-1 text-sm font-semibold">
              {candidateList.length}개의 후보
            </div>
          </div>
        </button>

        <div
          className="flex flex-1 touch-pan-y flex-col gap-4 overflow-y-auto overscroll-contain px-6"
          style={{ paddingBottom: `calc(5rem + ${safeAreaBottom}px)` }}
          onPointerDownCapture={(e) => e.stopPropagation()}
        >
          {candidateList.map((candidate) => {
            const cardKey = `${candidate.date}-${candidate.dayOfWeek}-${candidate.startTime}`;
            return (
              <TimeRecommendCard
                key={cardKey}
                candidate={candidate}
                participantsNum={participantsNum}
                maxAvailableNum={maxAvailableNum}
                isTopRank={selectedCardKey === cardKey}
                onClick={() => handleCardClick(candidate)}
                commonTimeList={commonTimeList}
                dateType={dateType}
                timeRange={timeRange}
              />
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
