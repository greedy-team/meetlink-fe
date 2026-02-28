export function PlaceListSkeleton() {
  const skeletons = Array.from({ length: 3 });

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-sm font-semibold text-gray-500">검색 결과</h2>

      <div className="divide-y divide-gray-200">
        {skeletons.map((_, idx) => (
          <div key={idx} className="flex w-full items-start gap-3 py-4">
            {/* 아이콘 스켈레톤 (동그라미) */}
            <div className="mt-0.5 h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-100" />

            {/* 텍스트 스켈레톤 (오른쪽 영역) */}
            <div className="flex-1 space-y-2.5 py-1">
              {/* 첫 번째 줄: 장소명/도로명 주소 (조금 길게) */}
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
              {/* 두 번째 줄: 지번 주소/상세 주소 (조금 짧게) */}
              <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
