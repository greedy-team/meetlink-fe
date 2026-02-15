import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Calendar, type LucideIcon, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';

import { RecommendItem } from './RecommendItem';

//임시 지도
interface LatLngMapProps {
  lat: number;
  lng: number;
  zoom?: number;
}

const LatLngMap: React.FC<LatLngMapProps> = ({ lat, lng, zoom = 15 }) => {
  // 2. URL 생성 (q 파라미터에 좌표를 넣어야 마커가 찍힙니다)
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <iframe
        title="Google Map"
        src={mapUrl}
        width="100%"
        height="100%"
        style={{
          border: 0,
          pointerEvents: 'none',
        }}
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default LatLngMap;

import { type RecommendPlace, type RecommendTime } from '@/types/meetingTypes';
interface RecommendSummaryCardProps {
  isTimeRecommendEnabled: boolean;
  isPlaceRecommendEnabled: boolean;
  bestTime?: RecommendTime;
  bestPlace?: RecommendPlace;
  className?: string;
}

export function RecommendSummaryCard({
  isTimeRecommendEnabled,
  isPlaceRecommendEnabled,
  bestTime,
  bestPlace,
  className,
}: RecommendSummaryCardProps) {
  const navigate = useNavigate();
  const handleGoToButton = (url: string) => {
    navigate(url);
  };

  if (!isTimeRecommendEnabled && !isPlaceRecommendEnabled) {
    return null; // 혹시나 방지
  }

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm',
        className,
      )}
    >
      <div className="flex flex-col gap-2 p-3">
        {isPlaceRecommendEnabled && <LatLngMap lat={37.5546} lng={126.9706} />}

        {isTimeRecommendEnabled && (
          <RecommendItem
            icon={Calendar}
            label="추천 시간"
            value="1"
            onClick={() => handleGoToButton('recommend/time')}
          />
        )}

        {isTimeRecommendEnabled && isPlaceRecommendEnabled && (
          <div className="h-px w-full bg-gray-200" />
        )}

        {isPlaceRecommendEnabled && (
          <RecommendItem
            icon={MapPin}
            label="추천 장소"
            value="세종대학교ㅌ"
            onClick={() => handleGoToButton('recommend/place')}
          />
        )}
      </div>
    </div>
  );
}
