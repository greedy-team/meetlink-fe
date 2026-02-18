import { useNavigate, useParams } from 'react-router-dom';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { Header } from '@/components/common/layout/Header';

import { CenterPin } from '@/features/place/confirm/CenterPin';
import { MapPreview } from '@/features/place/confirm/MapPreview';
import { PlaceConfirmSheet } from '@/features/place/confirm/PlaceConfirmSheet';
import { RecenterFab } from '@/features/place/confirm/RecenterFab';
import type { UpdateMyStartPlaceRequest } from '@/types/apiTypes';

export default function ConfirmOnMapPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  const roadAddress = '인천 서구 경서로56번길 3-2';
  const jibunAddress = '인천 서구 경서동 735-2';

  const handleConfirm = () => {
    const selectedPlace: UpdateMyStartPlaceRequest = {
      address: roadAddress,
      latitude: '37.3850',
      longitude: '126.6440',
    };

    navigate(`/meeting/${code}/input/place`, { state: { selectedPlace } });
  };

  return (
    <AppLayout header={<Header title="지도에서 위치 확인" />}>
      {/* AppLayout main padding 상쇄 */}
      <div className="-mx-4 -my-4">
        {/* 지도 영역에 명시적 높이 부여 (이게 핵심) */}
        <div className="relative h-[55dvh] min-h-90 w-full overflow-hidden">
          <MapPreview>
            <CenterPin />
            <RecenterFab onClick={() => {}} />
          </MapPreview>
        </div>

        {/* 하단 시트 */}
        <PlaceConfirmSheet
          roadAddress={roadAddress}
          jibunAddress={jibunAddress}
          onConfirm={handleConfirm}
        />
      </div>
    </AppLayout>
  );
}
