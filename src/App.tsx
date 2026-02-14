import { Route, Routes } from 'react-router-dom';

import CreatePage from './pages/create/CreatePage';
import SharePage from './pages/create/SharePage';
import LayoutPreviewPage from './pages/dev/LayoutPreviewPage';
import StartPage from './pages/landing/StartPage';
import AddressSearchPage from './pages/meeting/input/AddressSearchPage';
import PlaceInputPage from './pages/meeting/input/PlaceInputPage';
import TimeInputPage from './pages/meeting/input/TimeInputPage';
import JoinPage from './pages/meeting/JoinPage';
import MainPage from './pages/meeting/MainPage';
import MeetingLayout from './pages/meeting/MeetingLayout';
import PlaceRecommendPage from './pages/meeting/recommend/PlaceRecommendPage';
import TimeRecommendPage from './pages/meeting/recommend/TimeRecommendPage';
import SettingPage from './pages/meeting/SettingPage';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/preview/layout" element={<LayoutPreviewPage />} />
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
  );
}

export default App;
