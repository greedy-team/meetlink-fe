import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const INFO_LIST: InfoItem[] = [
  {
    icon: Calendar,
    title: '쉬운 모임 생성',
    description: '미뤄 두었던 모임을 시작하세요.',
  },
  {
    icon: Clock,
    title: '시간 추천',
    description: '참여자들의 가능시간을 바탕으로 만남 시간을 추천해요.',
  },
  {
    icon: MapPin,
    title: '장소 추천',
    description: '참여자들의 출발지를 바탕으로 만남 장소를 추천해요.',
  },
];

export default function StartPage() {
  //캐러셀
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

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
      <div className="mt-40 flex flex-col items-center gap-5 text-center">
        <div className="bg-greedy flex items-center justify-center gap-2 rounded-2xl px-2 py-1 font-semibold text-white">
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
        <Carousel setApi={setApi} opts={{ loop: true }} className="mt-20 w-55">
          <CarouselContent>
            {INFO_LIST.map((item, index) => (
              <CarouselItem key={index} className="flex items-center justify-center gap-2">
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
        <div className="flex justify-center gap-2">
          {INFO_LIST.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'rounded-full transition-all duration-300',
                current === index ? 'bg-greedy h-2.5 w-8' : 'h-2.5 w-2.5 bg-gray-200',
              )}
              aria-label={`${index + 1}번 슬라이드로 이동`}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
