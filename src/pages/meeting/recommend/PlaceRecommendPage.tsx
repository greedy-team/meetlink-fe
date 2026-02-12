import { useState } from 'react';

import { useMeetingContext } from '@/pages/meeting/MeetingLayout';
import { type RecommendPlace } from '@/types/meetingTypes';

export default function PlaceRecommendPage() {
  const { recommendPlaceList, participantStatusList } = useMeetingContext();

  return (
    <div>
      <div></div>placeRecommend
    </div>
  );
}
