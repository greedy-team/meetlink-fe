import { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { Header } from '@/components/common/layout/Header';
import { type RecentPlaceItem, upsertRecentPlace } from '@/lib/recentPlaces';

import { AddressSearchInput } from '@/features/place/search/AddressSearchInput';
import { SearchEmptyState } from '@/features/place/search/SearchEmptyState';
import { SearchGuide } from '@/features/place/search/SearchGuide';
import { PlaceListSkeleton } from '@/features/place/ui/PlaceListSkeleton';
import { RecentPlaceList } from '@/features/place/ui/RecentPlaceList';
import { UseCurrentLocationCard } from '@/features/place/ui/UseCurrentLocationCard';

type KakaoKeywordPlace = {
  x: string;
  y: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
};

type KakaoAddressPlace = {
  x: string;
  y: string;
  address_name: string;
  road_address?: { address_name: string } | null;
  address?: { address_name: string } | null;
};

type KakaoStatus = 'OK' | 'ZERO_RESULT' | 'ERROR';

type KakaoMapsServices = {
  Places: new () => {
    keywordSearch: (
      keyword: string,
      cb: (data: KakaoKeywordPlace[], status: KakaoStatus) => void,
      opts?: { size?: number },
    ) => void;
  };
  Geocoder: new () => {
    addressSearch: (
      addr: string,
      cb: (data: KakaoAddressPlace[], status: KakaoStatus) => void,
      opts?: { size?: number },
    ) => void;
  };
};

const getKakao = () => {
  const w = window as unknown as { kakao?: { maps: { services: KakaoMapsServices } } };
  return w.kakao ?? null;
};

export default function AddressSearchPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RecentPlaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debounceRef = useRef<number | null>(null);

  const trimmed = query.trim();
  const isSearching = trimmed.length > 0;

  // 뒤로가기 로직 고정: 무조건 PlaceInputPage로
  const goBack = () => {
    navigate(`/meeting/${code}/input/place`, { replace: true });
  };

  // 키워드, 주소 검색 동시 실행
  const runSearch = async (keyword: string) => {
    const kakao = getKakao();
    if (!kakao || !kakao.maps.services) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const places = new kakao.maps.services.Places();
    const geocoder = new kakao.maps.services.Geocoder();

    // 키워드 검색 (장소명 검색)
    const keywordPromise = new Promise<RecentPlaceItem[]>((resolve) => {
      places.keywordSearch(
        keyword,
        (data, status) => {
          if (status === 'OK') {
            resolve(
              data.map((d) => ({
                name: d.place_name, // "세종대학교"
                address: d.road_address_name || d.address_name,
                latitude: Number(d.y),
                longitude: Number(d.x),
                roadAddress: d.road_address_name,
                jibunAddress: d.address_name,
              })),
            );
          } else resolve([]);
        },
        { size: 5 },
      );
    });

    // 주소 검색 (정확한 주소 검색)
    const addressPromise = new Promise<RecentPlaceItem[]>((resolve) => {
      geocoder.addressSearch(
        keyword,
        (data, status) => {
          if (status === 'OK') {
            resolve(
              data.map((d) => ({
                name: d.road_address?.address_name || d.address?.address_name || d.address_name,
                address: d.road_address?.address_name || d.address?.address_name || d.address_name,
                latitude: Number(d.y),
                longitude: Number(d.x),
                roadAddress: d.road_address?.address_name,
                jibunAddress: d.address?.address_name || d.address_name,
              })),
            );
          } else resolve([]);
        },
        { size: 5 },
      );
    });

    const [keywordResults, addressResults] = await Promise.all([keywordPromise, addressPromise]);
    const combined = [...keywordResults, ...addressResults];

    // 중복 제거 (같은 주소면 하나만 렌더링)
    const unique = Array.from(new Map(combined.map((item) => [item.address, item])).values());

    setResults(unique);
    setIsLoading(false);
  };

  const handleQueryChange = (next: string) => {
    setQuery(next);
    const nextTrimmed = next.trim();

    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    if (nextTrimmed.length === 0) {
      setIsLoading(false);
      setResults([]);
      return;
    }

    debounceRef.current = window.setTimeout(() => {
      runSearch(nextTrimmed);
    }, 300);
  };

  const handleSelect = (place: RecentPlaceItem) => {
    // 최근 검색어에 추가
    upsertRecentPlace(place);

    // 입력 페이지로 데이터 넘기면서 이동
    navigate(`/meeting/${code}/input/place`, {
      state: { selectedPlace: place, from: location.state?.from },
      replace: true,
    });
  };

  const openConfirmMap = () => {
    navigate(`/meeting/${code}/input/place/confirm`, {
      state: location.state,
      replace: false,
    });
  };

  const listToShow = useMemo(() => results, [results]);

  return (
    <AppLayout header={<Header title="주소 검색" onBack={goBack} />}>
      <div className="space-y-4">
        <h1 className="pt-2 text-lg leading-tight font-bold text-gray-900">
          출발할 주소를 검색해주세요
        </h1>

        <AddressSearchInput value={query} onChange={handleQueryChange} />
        <UseCurrentLocationCard onClick={openConfirmMap} />

        {!isSearching && <SearchGuide />}

        {isSearching &&
          (isLoading ? (
            <PlaceListSkeleton />
          ) : listToShow.length > 0 ? (
            <RecentPlaceList places={listToShow} onSelect={handleSelect} title="검색 결과" />
          ) : (
            <SearchEmptyState />
          ))}
      </div>
    </AppLayout>
  );
}
