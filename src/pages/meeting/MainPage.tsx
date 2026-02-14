import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function MainPage() {
  const {
    meetingName,
    isTimeRecommendEnabled,
    isPlaceRecommendEnabled,
    participantStatusList,
    recommendTimeList,
    recommendPlaceList,
  } = useMeetingContext();

  const bestRecommandedTime = recommendTimeList?.[0];
  const bestRecommandedPlace = recommendPlaceList?.[0];

  return (
    <div>
      <div>a</div>
    </div>
  );
}
