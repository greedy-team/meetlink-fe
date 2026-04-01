import { Search } from 'lucide-react';

export function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 text-gray-300">
        <Search className="h-16 w-16" />
      </div>
      <div className="text-lg font-semibold text-gray-700">검색 결과가 없습니다</div>
      <div className="mt-2 text-sm text-gray-400">다른 검색어로 다시 시도해보세요</div>
    </div>
  );
}
