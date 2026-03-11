import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import FallBackPage from './pages/FallBackPage';

const CreatePage = lazy(() => import('./pages/create/CreatePage'));
const SharePage = lazy(() => import('./pages/create/SharePage'));
const LayoutPreviewPage = lazy(() => import('./pages/dev/LayoutPreviewPage'));
const StartPage = lazy(() => import('./pages/landing/StartPage'));
const AddressSearchPage = lazy(() => import('./pages/meeting/input/AddressSearchPage'));
const ConfirmOnMapPage = lazy(() => import('./pages/meeting/input/ConfirmOnMapPage'));
const PlaceInputPage = lazy(() => import('./pages/meeting/input/PlaceInputPage'));
const TimeInputPage = lazy(() => import('./pages/meeting/input/TimeInputPage'));
const JoinPage = lazy(() => import('./pages/meeting/JoinPage'));
const MainPage = lazy(() => import('./pages/meeting/MainPage'));
const MeetingLayout = lazy(() => import('./pages/meeting/MeetingLayout'));
const PlaceRecommendPage = lazy(() => import('./pages/meeting/recommend/PlaceRecommendPage'));
const TimeRecommendPage = lazy(() => import('./pages/meeting/recommend/TimeRecommendPage'));
const RejoinPage = lazy(() => import('./pages/meeting/RejoinPage'));
const SettingPage = lazy(() => import('./pages/meeting/SettingPage'));

import './App.css';

function App() {
  return (
    <Suspense fallback={<FallBackPage />}>
      <Routes>
        <Route path="/preview/layout" element={<LayoutPreviewPage />} />
        <Route path="/" element={<StartPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/share/:code" element={<SharePage />} />

        <Route path="/meeting/:code" element={<MeetingLayout />}>
          <Route index element={<MainPage />} />
          <Route path="join" element={<JoinPage />} />
          <Route path="rejoin" element={<RejoinPage />} />
          <Route path="settings" element={<SettingPage />} />

          <Route path="input/time" element={<TimeInputPage />} />
          <Route path="input/place" element={<PlaceInputPage />} />
          <Route path="input/place/search" element={<AddressSearchPage />} />
          <Route path="input/place/confirm" element={<ConfirmOnMapPage />} />

          <Route path="recommendations/time" element={<TimeRecommendPage />} />
          <Route path="recommendations/place" element={<PlaceRecommendPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
