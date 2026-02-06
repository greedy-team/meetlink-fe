import './App.css'
import { Routes, Route } from 'react-router-dom';
import StartPage from './pages/landing/StartPage';
import CreatePage from './pages/create/CreatePage';
import SharePage from './pages/create/SharePage';
import MainPage from './pages/meeting/MainPage';
import TimeInputPage from './pages/meeting/input/TimeInputPage';
import PlaceInputPage from './pages/meeting/input/PlaceInputPage';
import TimeResultPage from './pages/meeting/result/TimeResultPage';
import PlaceResultPage from './pages/meeting/result/PlaceResultPage';

function App() {
  return (
    <Routes>
      <Route path="/start" element={<StartPage />} />
      <Route path="/create/:code" element={<CreatePage />} />
      <Route path="/share/:code" element={<SharePage />} /> 
      <Route path="/meeting/:code">
        <Route index element={<MainPage />} /> 
        
        <Route path="input/time" element={<TimeInputPage />} />
        <Route path="input/place" element={<PlaceInputPage />} />
        
        <Route path="result/time" element={<TimeResultPage />} />
        <Route path="result/place" element={<PlaceResultPage />} />
      </Route>
    </Routes>
  )
}

export default App
