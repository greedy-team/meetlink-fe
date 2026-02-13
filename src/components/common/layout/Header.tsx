import { useNavigate } from 'react-router-dom';

import { ChevronLeft } from 'lucide-react';

type HeaderProps = {
  title: string;
  onBack?: () => void;
};

export function Header({ title, onBack }: HeaderProps) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate(-1);
  };

  return (
    <header className="flex h-16 shrink-0 items-center border-b bg-white px-4">
      {/* 뒤로가기 + 제목 (왼쪽 정렬) */}
      <button type="button" onClick={handleBack} className="flex items-center gap-2 text-gray-900">
        {/* 아이콘 */}
        <ChevronLeft className="h-6 w-6" />

        {/* 제목 */}
        <span className="text-lg font-bold">{title}</span>
      </button>
    </header>
  );
}
