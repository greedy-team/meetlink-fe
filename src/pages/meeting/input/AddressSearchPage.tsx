import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { Header } from '@/components/common/layout/Header';

import { AddressSearchInput } from '@/features/place/search/AddressSearchInput';
import { SearchEmptyState } from '@/features/place/search/SearchEmptyState';
import { SearchGuide } from '@/features/place/search/SearchGuide';
import { RecentPlaceList } from '@/features/place/ui/RecentPlaceList';
import { UseCurrentLocationCard } from '@/features/place/ui/UseCurrentLocationCard';
import type { UpdateMyStartPlaceRequest } from '@/types/apiTypes';

// UI-only 목데이터 (나중에 실제 검색 API로 교체)
const MOCK_RESULTS: UpdateMyStartPlaceRequest[] = [
  { address: '서울 강남구 테헤란로 123', latitude: '37.5012', longitude: '127.0396' },
  { address: '서울 서초구 서초대로 234', latitude: '37.4929', longitude: '127.0144' },
  { address: '인천 연수구 송도과학로 56', latitude: '37.3850', longitude: '126.6440' },
  { address: '서울 마포구 양화로 45', latitude: '37.5563', longitude: '126.9237' },
  { address: '서울 중구 을지로 100', latitude: '37.5663', longitude: '126.9920' },
];

export default function AddressSearchPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  const [query, setQuery] = useState('');

  const trimmed = query.trim();
  const isSearching = trimmed.length > 0;

  const results = useMemo(() => {
    if (!isSearching) return [];
    return MOCK_RESULTS.filter((r) => r.address.includes(trimmed));
  }, [isSearching, trimmed]);

  const handleSelect = (place: UpdateMyStartPlaceRequest) => {
    navigate(`/meeting/${code}/input/place`, {
      state: { selectedPlace: place },
    });
  };

  const openConfirmMap = () => {
    navigate(`/meeting/${code}/input/place/confirm`);
  };

  return (
    <AppLayout header={<Header title="주소 검색" />}>
      <div className="space-y-4">
        <h1 className="pt-2 text-lg leading-tight font-bold text-gray-900">
          출발할 주소를 검색해주세요
        </h1>

        <AddressSearchInput value={query} onChange={setQuery} />
        <UseCurrentLocationCard onClick={openConfirmMap} />

        {!isSearching && <SearchGuide />}

        {isSearching &&
          (results.length > 0 ? (
            <RecentPlaceList places={results} onSelect={handleSelect} />
          ) : (
            <SearchEmptyState />
          ))}
      </div>
    </AppLayout>
  );
}
