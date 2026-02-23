//참가자 현황
export interface ParticipantStatus {
  id: number;
  nickName: string;
  hasTimeInput: boolean;
  hasPlaceInput: boolean;
}
//참가자 현황 리스트
export type ParticipantList = ParticipantStatus[];

//시간 정보
export interface TimeInfo {
  startTime: string;
  availableNumber: number;
}

//시간 정보 리스트
export interface SelectedTime {
  date: string;
  dayOfWeek: number;
  startTimeList: TimeInfo[];
}

//추천 시간
export interface RecommendTime {
  date: string;
  startTime: string;
  endTime: string;
  rank: number;
  availableNumber: number;
}

//참가자 이동 정보
export interface ParticipantMovement {
  nickName: string;
  takenTime: number;
  movementData: string;
  // 프론트 렌더링용 (polyline 그리기)
  movementPath?: { lat: number; lng: number }[];
}

//추천 장소
export interface RecommendPlace {
  placeName: string;
  placeAddress: string;
  latitude: string;
  longitude: string;
  rank: number;
  averageTime: number;
  maxTime: number;
  participantMovementList: ParticipantMovement[];
}
