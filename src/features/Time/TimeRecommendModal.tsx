import { useEffect, useState } from 'react';

import { motion, type PanInfo, useAnimation } from 'framer-motion';

import { TimeRecommendCard } from './TimeRecommendCard';

import { type SelectedTime } from '@/types/meetingTypes';

const SHEET_CONFIG = {
  FULL_VH: 90,
  HALF_VH: 50,
  PEEK_PX: 20,
};

export interface Candidate {
  availableCount: number;
  date: string;
  dayOfWeek: number;
  endTime: string;
  id: number;
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

// 메인 모달 컴포넌트
export default function TimeRecommendModal({
  candidateList,
  participantsNum,
  setSelectedDate,
  timeRange,
  commonTimeList,
  dateType,
}: TimeRecommendModalProps) {
  const [sheetState, setSheetState] = useState<'peek' | 'half' | 'full'>('peek');
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
  }, [sheetState, windowHeight, controls]);

  // 배경 스크롤 방지 로직 (Scroll Lock)
  useEffect(() => {
    if (sheetState === 'half' || sheetState === 'full') {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [sheetState]);

  if (!candidateList || candidateList.length === 0) return null;

  const modalActualHeight = windowHeight * (SHEET_CONFIG.FULL_VH / 100);

  const fullY = 0;
  const halfY = windowHeight * ((SHEET_CONFIG.FULL_VH - SHEET_CONFIG.HALF_VH) / 100);
  const peekY = modalActualHeight - SHEET_CONFIG.PEEK_PX;

  const variants = {
    full: { y: fullY },
    half: { y: halfY },
    peek: { y: peekY },
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    let startY = 0;
    if (sheetState === 'full') startY = fullY;
    if (sheetState === 'half') startY = halfY;
    if (sheetState === 'peek') startY = peekY;

    const projectedY = startY + info.offset.y + info.velocity.y * 0.2;

    const distToFull = Math.abs(projectedY - fullY);
    const distToHalf = Math.abs(projectedY - halfY);
    const distToPeek = Math.abs(projectedY - peekY);

    let nextState: 'peek' | 'half' | 'full' = 'peek';

    if (distToFull < distToHalf && distToFull < distToPeek) {
      nextState = 'full';
    } else if (distToHalf < distToFull && distToHalf < distToPeek) {
      nextState = 'half';
    } else {
      nextState = 'peek';
    }

    setSheetState(nextState);
    controls.start(nextState);
  };

  const handleCardClick = (dateString: string) => {
    setSelectedDate(new Date(dateString));
    setSheetState('peek');
    controls.start('peek');
  };

  return (
    <>
      {sheetState !== 'peek' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          onClick={() => setSheetState('peek')}
          className="fixed inset-0 z-40 bg-black"
        />
      )}

      <motion.div
        variants={variants}
        initial="peek"
        animate={controls}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: peekY }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ height: `${SHEET_CONFIG.FULL_VH}vh` }}
        className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[24px] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        <button
          onClick={() => sheetState === 'peek' && setSheetState('half')}
          className="flex cursor-pointer flex-col items-center pt-3 pb-4"
        >
          <div className="mb-4 h-[5px] w-12 rounded-full bg-gray-300" />
          <div className="flex w-full items-center justify-between px-6">
            <h2 className="text-xl font-bold text-gray-900">추천 만남 시간</h2>
            <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              {candidateList.length}개의 후보
            </div>
          </div>
        </button>

        <div
          className="flex-1 overflow-y-auto px-6 pb-20"
          onPointerDownCapture={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-4">
            {candidateList.map((candidate, index) => {
              const isTopRank = candidate.rank === 1 || index === 0;

              return (
                //  분리한 카드를 가져와서 사용합니다.
                <TimeRecommendCard
                  key={candidate.id}
                  candidate={candidate}
                  participantsNum={participantsNum}
                  isTopRank={isTopRank}
                  onClick={handleCardClick}
                  commonTimeList={commonTimeList}
                  dateType={dateType}
                  timeRange={timeRange}
                />
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
