import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { Header } from '@/components/common/layout/Header';

import { AddressSearchInput } from '@/features/place/search/AddressSearchInput';
import { SearchEmptyState } from '@/features/place/search/SearchEmptyState';
import { SearchGuide } from '@/features/place/search/SearchGuide';
import { RecentPlaceList } from '@/features/place/ui/RecentPlaceList';
import { UseCurrentLocationCard } from '@/features/place/ui/UseCurrentLocationCard';
import type { UpdateMyStartPlaceRequest } from '@/types/apiTypes';

const RECENT_PLACES_KEY = 'recent_places';
const MAX_RECENTS = 5;

const loadRecentPlaces = (): UpdateMyStartPlaceRequest[] => {
  const raw = localStorage.getItem(RECENT_PLACES_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as UpdateMyStartPlaceRequest[];
  return Array.isArray(parsed) ? parsed : [];
};

const saveRecentPlaces = (places: UpdateMyStartPlaceRequest[]) => {
  localStorage.setItem(RECENT_PLACES_KEY, JSON.stringify(places));
};

const upsertRecentPlace = (place: UpdateMyStartPlaceRequest): UpdateMyStartPlaceRequest[] => {
  const current = loadRecentPlaces();
  const next = [place, ...current.filter((p) => p.address !== place.address)].slice(0, MAX_RECENTS);
  saveRecentPlaces(next);
  return next;
};

type KakaoKeywordPlace = {
  x: string; // longitude
  y: string; // latitude
  address_name: string;
  road_address_name?: string;
};

type KakaoStatus = 'OK' | 'ZERO_RESULT' | 'ERROR';

type KakaoPlacesService = {
  keywordSearch: (
    keyword: string,
    callback: (data: KakaoKeywordPlace[], status: KakaoStatus) => void,
    options?: { size?: number },
  ) => void;
};

type KakaoMapsServices = {
  Places: new () => KakaoPlacesService;
};

type KakaoMaps = {
  services: KakaoMapsServices;
};

type KakaoGlobal = {
  maps: KakaoMaps;
};

const getKakao = (): KakaoGlobal | null => {
  const w = window as unknown as { kakao?: KakaoGlobal };
  return w.kakao ?? null;
};

export default function AddressSearchPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UpdateMyStartPlaceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debounceRef = useRef<number | null>(null);

  const trimmed = query.trim();
  const isSearching = trimmed.length > 0;

  const runSearch = (keyword: string) => {
    const kakao = getKakao();
    if (!kakao) {
      setResults([]);
      return;
    }

    const Places = kakao.maps.services?.Places;
    if (!Places) {
      // libraries=services가 안 붙었거나, SDK 초기화가 덜 된 상태
      setResults([]);
      return;
    }

    const places = new Places();

    setIsLoading(true);
    places.keywordSearch(
      keyword,
      (data, status) => {
        setIsLoading(false);

        if (status !== 'OK') {
          setResults([]);
          return;
        }

        const mapped: UpdateMyStartPlaceRequest[] = data
          .map((d) => {
            const address = d.road_address_name?.trim() || d.address_name?.trim() || '';
            if (!address) return null;

            return {
              address,
              latitude: Number(d.y),
              longitude: Number(d.x),
            };
          })
          .filter((v): v is UpdateMyStartPlaceRequest => v !== null);

        setResults(mapped);
      },
      { size: 10 },
    );
  };

  const handleQueryChange = (next: string) => {
    setQuery(next);

    const nextTrimmed = next.trim();

    // 디바운스
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

  const handleSelect = (place: UpdateMyStartPlaceRequest) => {
    // 선택 즉시 recent 반영
    upsertRecentPlace(place);

    // 출발지 입력 페이지로 자동 반영 (selectedPlace)
    navigate(`/meeting/${code}/input/place`, {
      state: { selectedPlace: place },
    });
  };

  const openConfirmMap = () => {
    navigate(`/meeting/${code}/input/place/confirm`);
  };

  const listToShow = useMemo(() => results, [results]);

  return (
    <AppLayout header={<Header title="주소 검색" />}>
      <div className="space-y-4">
        <h1 className="pt-2 text-lg leading-tight font-bold text-gray-900">
          출발할 주소를 검색해주세요
        </h1>

        <AddressSearchInput value={query} onChange={handleQueryChange} />
        <UseCurrentLocationCard onClick={openConfirmMap} />

        {!isSearching && <SearchGuide />}

        {isSearching &&
          (isLoading ? (
            <div className="rounded-xl bg-gray-50 px-4 py-5 text-sm text-gray-500">검색 중...</div>
          ) : listToShow.length > 0 ? (
            <RecentPlaceList places={listToShow} onSelect={handleSelect} title="검색 결과" />
          ) : (
            <SearchEmptyState />
          ))}
      </div>
    </AppLayout>
  );
}
