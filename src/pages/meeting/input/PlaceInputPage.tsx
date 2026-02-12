import { useState } from 'react';

import { useUpdateMyStartPlace } from '@/hooks/usePlace';

import { useMeetingContext } from '@/pages/meeting/MeetingLayout';

export default function PlaceInputPage() {
  const { id } = useMeetingContext();

  const [selectedPlace, setSelectedPlace] = useState<string>('');
  const [currentPlaceList, setCurrentPlaceList] = useState<string[]>([]);

  const { mutate: savePlace } = useUpdateMyStartPlace(id);

  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSave = () => {
    savePlace({
      address: address,
      latitude: latitude,
      longitude: longitude,
    });
  };

  return (
    <div>
      <div></div>
      placeinput
    </div>
  );
}
