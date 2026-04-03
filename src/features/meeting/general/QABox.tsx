import { ChevronRight, MessagesSquare } from 'lucide-react';

export function QABox() {
  return (
    <a
      href="https://www.instagram.com/meetlink.now/"
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-2 flex w-full cursor-pointer items-center justify-between rounded-3xl border-2 border-gray-200 bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100"
    >
      <div className="flex items-center gap-4 text-left">
        <div className="bg-greedy/10 text-greedy flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors">
          <MessagesSquare size={24} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-base leading-tight font-bold text-gray-900">
            함께 만드는 MeetLink
          </span>
          <span className="text-xs leading-relaxed font-medium text-gray-400">
            더 나은 MeetLink를 위해 여러분의 소중한 의견을 들려주세요
          </span>
        </div>
      </div>

      <div className="ml-4 flex h-11 shrink-0 items-center justify-center text-gray-500 transition-colors">
        <ChevronRight strokeWidth={3} className="h-6 w-6" />
      </div>
    </a>
  );
}
