export function SearchGuide() {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-base font-semibold text-gray-900">이렇게 검색해 보세요</h2>
      <ul className="list-disc space-y-2 pl-5 text-base text-gray-500">
        <li>도로명 + 건물번호 (위례성대로 2)</li>
        <li>건물명 + 번지 (방이동 44-2)</li>
        <li>건물명, 아파트명 (반포 자이, 분당 주공 1차)</li>
      </ul>
    </section>
  );
}
