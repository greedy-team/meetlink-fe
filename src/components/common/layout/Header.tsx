import { useNavigate } from 'react-router-dom';

import { ChevronLeft } from 'lucide-react';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  showSettingButton?: boolean;
  onBack?: () => void;
};

export function Header({
  title,
  showBackButton = true,
  showSettingButton = false,
  onBack,
}: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) return onBack();
    navigate(-1);
  };

  return (
    <header className="flex h-16 items-center border-b bg-white px-4">
      <div className="flex flex-1 items-center gap-2">
        {showBackButton && (
          <button type="button" onClick={handleBack} className="flex items-center">
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <span className="text-lg font-bold">{title}</span>
      </div>

      {showSettingButton && (
        <button
          type="button"
          onClick={() => navigate('setting')}
          className="inline-flex h-10 w-10 items-center justify-center"
          aria-label="설정"
        >
          <img src="/icons/settings.svg" alt="" aria-hidden="true" className="h-6 w-6" />
        </button>
      )}
    </header>
  );
}
