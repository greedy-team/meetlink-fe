import { Outlet } from 'react-router-dom';
import { useState } from 'react';

export default function MeetingLayout() {
  const [temp, setTemp] = useState('');
  return (
    <div>
      <Outlet context={{temp, setTemp}} />
    </div>
  )
};