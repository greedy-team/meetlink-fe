import './App.css'
import { Routes, Route } from 'react-router-dom';
import StartPage from './pages/landing/StartPage';
import CreatePage from './pages/create/CreatePage';
import SharePage from './pages/create/SharePage';
import MainPage from './pages/meeting/MainPage';
import ParticipatePage from './pages/meeting/ParticipatePage';
import SettingPage from './pages/meeting/SettingPage';
import TimeInputPage from './pages/meeting/input/TimeInputPage';
import PlaceInputPage from './pages/meeting/input/PlaceInputPage';
import MapInputPage from './pages/meeting/input/MapInputPage';
import TimeResultPage from './pages/meeting/result/TimeResultPage';
import PlaceResultPage from './pages/meeting/result/PlaceResultPage';
import MeetingLayout from './pages/meeting/MeetingLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/start" element={<StartPage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/share/:code" element={<SharePage />} /> 

      <Route path="/meeting/:code" element={<MeetingLayout />}>
        <Route index element={<MainPage />} /> 
        <Route path="participate" element={<ParticipatePage />} /> 
        <Route path="setting" element={<SettingPage />} /> 
        
        <Route path="input/time" element={<TimeInputPage />} />
        <Route path="input/place" element={<PlaceInputPage />} />
        <Route path="input/place/map" element={<MapInputPage />} />
        
        <Route path="result/time" element={<TimeResultPage />} />
        <Route path="result/place" element={<PlaceResultPage />} />
      </Route>
    </Routes>
  )
}

export default App
