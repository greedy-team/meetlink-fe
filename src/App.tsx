import './App.css'
import { Routes, Route } from 'react-router-dom';
import StartPage from './pages/landing/StartPage';
import CreatePage from './pages/create/CreatePage';
import SharePage from './pages/create/SharePage';
import MainPage from './pages/meeting/MainPage';
import JoinPage from './pages/meeting/JoinPage';
import SettingPage from './pages/meeting/SettingPage';
import TimeInputPage from './pages/meeting/input/TimeInputPage';
import PlaceInputPage from './pages/meeting/input/PlaceInputPage';
import AddressSearchPage from './pages/meeting/input/AddressSearchPage';
import TimeRecommendPage from './pages/meeting/recommend/TimeRecommendPage';
import PlaceRecommendPage from './pages/meeting/recommend/PlaceRecommendPage';
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
        <Route path="join" element={<JoinPage />} /> 
        <Route path="setting" element={<SettingPage />} /> 
        
        <Route path="input/time" element={<TimeInputPage />} />
        <Route path="input/place" element={<PlaceInputPage />} />
        <Route path="input/place/search" element={<AddressSearchPage />} />
        
        <Route path="recommend/time" element={<TimeRecommendPage />} />
        <Route path="recommend/place" element={<PlaceRecommendPage />} />
      </Route>
    </Routes>
  )
}

export default App
