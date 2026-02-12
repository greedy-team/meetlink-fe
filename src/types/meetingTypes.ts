export interface ParticipantStatus {
  nickName: string;
  hasTimeInput: boolean;
  hasPlaceInput: boolean;
}
export type ParticipantList = ParticipantStatus[];

export interface TimeInfo {
  startTime: string;
  availableNumber: number;
}

export interface SelectedTime {
  date: string;
  startTimeList: TimeInfo[];
}

export interface RecommendTime {
  date: string;
  startTime: string;
  endTime: string;
  rank: number;
  availableNumber: number;
}

export interface ParticipantMovement {
  nickName: string;
  takenTime: number;
  movementData: string;
}

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
