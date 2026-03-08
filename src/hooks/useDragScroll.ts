import { useRef } from 'react';

export function useDragScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false); // 드래그와 단순 클릭을 구분하기 위한 상태

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    hasDragged.current = false; // 마우스를 누를 때 클릭 상태로 초기화
    if (scrollRef.current) {
      startX.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeft.current = scrollRef.current.scrollLeft;
    }
  };

  const onMouseLeave = () => {
    isDragging.current = false;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;

    // 마우스가 5px 이상 움직였을 때 드래그로 간주하여 클릭 이벤트를 막음
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }

    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // 드래그 중일 때는 버튼 클릭이 안 되도록 막음
  const withClickPrevention = (onClickAction: () => void) => (e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClickAction();
  };

  return {
    scrollRef,
    events: { onMouseDown, onMouseLeave, onMouseUp, onMouseMove },
    withClickPrevention,
  };
}
