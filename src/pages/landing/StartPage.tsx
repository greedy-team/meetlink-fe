import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Autoplay from 'embla-carousel-autoplay';
import { Calendar, Clock, Link, type LucideIcon, MapPin } from 'lucide-react';

import { AppLayout } from '@/components/common/layout/AppLayout';
import { FixedBottomButton } from '@/components/common/layout/FixedBottomButton';
import { type CarouselApi } from '@/components/ui/carousel';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface InfoItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

//캐러셀 아이템 정보
const INFO_LIST: InfoItem[] = [
  {
    icon: Calendar,
    title: '모임 생성',
    description: '미뤄 두었던 모임을 시작하세요',
  },
  {
    icon: Clock,
    title: '시간 추천',
    description: '만남 시간을 결정하세요',
  },
  {
    icon: MapPin,
    title: '장소 추천',
    description: '만남 장소를 결정하세요',
  },
];

export default function StartPage() {
  //캐러셀
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  //2초 마다 자동 전환
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('create');
  };

  return (
    <AppLayout
      header={''}
      pageBackgroundClassName="bg-white"
      bottom={
        <div className="flex items-center pt-2">
          <FixedBottomButton className="bg-greedy hover:bg-greedy/50" onClick={handleStartClick}>
            시작하기
          </FixedBottomButton>
        </div>
      }
    >
      <div className="mt-25 flex flex-col items-center gap-4 text-center">
        <div className="bg-greedy flex items-center justify-center gap-2 rounded-2xl px-3 py-1 font-semibold text-white">
          <Link size={16} className="h-auto! w-auto!" />
          MeetLink
        </div>

        <div className="text-4xl font-bold">
          결정 안되던 약속, <br />
          여기서 끝내세요
        </div>

        <div className="text-gray-500">
          모두의 시간과 위치를 고려해 <br />
          가장 납득이 되는 약속을 만들어 드릴게요
        </div>

        {/* 캐러셀 */}
        <Carousel
          setApi={setApi}
          opts={{ loop: true, duration: 50 }}
          plugins={[plugin.current]}
          className="mt-25 w-55"
        >
          <CarouselContent>
            {INFO_LIST.map((item, index) => (
              <CarouselItem key={index} className="flex justify-center gap-3">
                <div className="bg-greedy/20 flex h-16 w-16 items-center justify-center rounded-2xl">
                  <item.icon size={30} className="text-greedy h-auto! w-auto!" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="text-lg font-bold">{item.title}</div>
                  <div className="w-35 text-sm break-keep text-gray-500">{item.description}</div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* 하단 인디게이터 */}
        <div className="flex justify-center gap-2">
          {INFO_LIST.map((_, index) => (
            <div
              key={index}
              className={cn(
                'rounded-full transition-all duration-500',
                current === index ? 'bg-greedy h-2.5 w-8' : 'h-2.5 w-2.5 bg-gray-200',
              )}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
