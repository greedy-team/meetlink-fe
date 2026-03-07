//참가자 현황
export interface ParticipantStatus {
  nickName: string;
  token?: string;
  hasTimeInput?: boolean;
  hasPlaceInput?: boolean;
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
  movementPath?: { lat: number; lng: number }[]; // 경로 정보
  segments?: PathSegment[]; // 이동 수단별(도보/대중교통) 경로 구분 정보
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

export interface PathSegment {
  mode: string; // 'WALK', 'BUS', 'SUBWAY' 등
  path: { lat: number; lng: number }[];
}
