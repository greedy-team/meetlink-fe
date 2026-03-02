import type { UpdateMyStartPlaceRequest } from '@/types/apiTypes';

export type RecentPlaceItem = UpdateMyStartPlaceRequest & {
  roadAddress?: string;
  jibunAddress?: string;
};

const RECENT_PLACES_KEY = 'recent_places';
const MAX_RECENTS = 3;

export const loadRecentPlaces = (): RecentPlaceItem[] => {
  const raw = localStorage.getItem(RECENT_PLACES_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as RecentPlaceItem[];
  return Array.isArray(parsed) ? parsed : [];
};

export const saveRecentPlaces = (places: RecentPlaceItem[]) => {
  localStorage.setItem(RECENT_PLACES_KEY, JSON.stringify(places));
};

export const upsertRecentPlace = (place: RecentPlaceItem): RecentPlaceItem[] => {
  const current = loadRecentPlaces();
  const next = [place, ...current.filter((p) => p.address !== place.address)].slice(0, MAX_RECENTS);
  saveRecentPlaces(next);
  return next;
};
