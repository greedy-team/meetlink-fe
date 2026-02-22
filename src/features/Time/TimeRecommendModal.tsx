import React, { useEffect, useState } from 'react';

import { motion, type PanInfo, useAnimation } from 'framer-motion';

// --- ⚙️ 바텀 시트 멈춤 높이 설정 ---
const SHEET_CONFIG = {
  FULL_VH: 90,
  HALF_VH: 55,
  PEEK_PX: 60,
};
// ------------------------------------

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
}

const getDayText = (day: number) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[day] ?? '';
};

const formatTime = (timeStr: string) => {
  const [hour] = timeStr.split(':');
  const h = parseInt(hour, 10);
  if (h < 12) return `오전 ${h}시`;
  if (h === 12) return `오후 12시`;
  return `오후 ${h - 12}시`;
};

export default function TimeRecommendModal({ candidateList }: TimeRecommendModalProps) {
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

  // 💡 [추가된 부분] 배경 스크롤 방지 로직 (Scroll Lock)
  useEffect(() => {
    // 모달이 위로 올라와 있을 때(half, full)만 배경 스크롤을 막습니다.
    if (sheetState === 'half' || sheetState === 'full') {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // 모바일 브라우저의 기본 스와이프 액션 방지
    } else {
      // 바닥에 내려가 있을 때(peek)는 다시 배경 스크롤을 허용합니다.
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    // 컴포넌트가 언마운트(삭제)될 때 원래대로 복구하는 클린업 함수
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
        <div
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
        </div>

        <div
          className="flex-1 overflow-y-auto px-6 pb-20"
          onPointerDownCapture={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-4">
            {candidateList.map((candidate, index) => {
              const isTopRank = candidate.rank === 1 || index === 0;
              const dateObj = new Date(candidate.date);
              const month = dateObj.getMonth() + 1;
              const day = dateObj.getDate();

              return (
                <div
                  key={candidate.id}
                  className={`relative flex flex-col gap-4 rounded-2xl border p-5 ${
                    isTopRank ? 'border-green-600 bg-green-50/30' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {month}월 {day}일 ({getDayText(candidate.dayOfWeek)})
                        </span>
                        {isTopRank && (
                          <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
                            추천
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-600">
                        {formatTime(candidate.startTime)} ~ {formatTime(candidate.endTime)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      {candidate.availableCount}명
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
