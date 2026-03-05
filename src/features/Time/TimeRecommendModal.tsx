import { useCallback, useEffect, useMemo, useState } from 'react';

import { motion, type PanInfo, useAnimation } from 'framer-motion';

import { TimeRecommendCard } from './TimeRecommendCard';

import { type SelectedTime } from '@/types/meetingTypes';

const SHEET_CONFIG = {
  FULL_VH: 90,
  HALF_VH: 50,
  PEEK_PX: 70,
};

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
  setSelectedDate: (date: Date) => void;
  timeRange: [number, number];
  commonTimeList: SelectedTime[];
  dateType: string;
}

export default function TimeRecommendModal({
  candidateList,
  participantsNum,
  setSelectedDate,
  timeRange,
  commonTimeList,
  dateType,
}: TimeRecommendModalProps) {
  const [sheetState, setSheetState] = useState<SheetState>('peek');
  const controls = useAnimation();

  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800,
  );

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    controls.start(sheetState);
  }, [sheetState, controls]);

  useEffect(() => {
    const isOpened = sheetState !== 'peek';
    document.body.style.overflow = isOpened ? 'hidden' : '';
    document.body.style.touchAction = isOpened ? 'none' : 'auto';

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = 'auto';
    };
  }, [sheetState]);

  const variants = useMemo(() => {
    const modalActualHeight = windowHeight * (SHEET_CONFIG.FULL_VH / 100);
    return {
      full: { y: 0 },
      half: { y: windowHeight * ((SHEET_CONFIG.FULL_VH - SHEET_CONFIG.HALF_VH) / 100) },
      peek: { y: modalActualHeight - SHEET_CONFIG.PEEK_PX },
    };
  }, [windowHeight]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const currentY = variants[sheetState].y + info.offset.y;
      const projectedY = currentY + info.velocity.y * 0.1;

      const distances = [
        { state: 'full' as SheetState, dist: Math.abs(projectedY - variants.full.y) },
        { state: 'half' as SheetState, dist: Math.abs(projectedY - variants.half.y) },
        { state: 'peek' as SheetState, dist: Math.abs(projectedY - variants.peek.y) },
      ];

      distances.sort((a, b) => a.dist - b.dist);
      const nextState = distances[0].state;

      setSheetState(nextState);
      controls.start(nextState);
    },
    [sheetState, variants, controls],
  );

  const handleCardClick = useCallback(
    (candidate: Candidate) => {
      if (dateType !== 'WEEKLY' && candidate.date) {
        setSelectedDate(new Date(candidate.date));
      }
      setSheetState('peek');
    },
    [dateType, setSelectedDate],
  );

  if (!candidateList || candidateList.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-dvh overflow-hidden">
      {/* Dim 배경 레이어 */}
      {sheetState !== 'peek' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          onClick={() => setSheetState('peek')}
          className="pointer-events-auto absolute inset-0 cursor-pointer bg-black"
        />
      )}

      {/* 바텀 시트 메인 */}
      <motion.div
        variants={variants}
        initial="peek"
        animate={controls}
        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: variants.peek.y }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ height: `${SHEET_CONFIG.FULL_VH}vh` }}
        className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col rounded-t-4xl bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        <button
          onClick={() => sheetState === 'peek' && setSheetState('half')}
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
          className="flex flex-1 touch-pan-y flex-col gap-4 overflow-y-auto overscroll-contain px-6 pb-20"
          onPointerDownCapture={(e) => e.stopPropagation()}
        >
          {candidateList.map((candidate, index) => (
            <TimeRecommendCard
              key={`${candidate.date}-${candidate.dayOfWeek}-${candidate.startTime}`}
              candidate={candidate}
              participantsNum={participantsNum}
              isTopRank={candidate.rank === 1 || index === 0}
              onClick={() => handleCardClick(candidate)}
              commonTimeList={commonTimeList}
              dateType={dateType}
              timeRange={timeRange}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
