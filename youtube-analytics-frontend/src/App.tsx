import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import VideoAnalytics from './pages/VideoAnalytics';
import ChannelInsights from './pages/ChannelInsights';
import CompetitorAnalysis from './pages/CompetitorAnalysis';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Register from './pages/register';

function App() {
  return (
    
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video-analytics" element={<VideoAnalytics />} />
        <Route path="/channel-insights" element={<ChannelInsights />} />
        <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
        <Route path='/LoginPage' element={<LoginPage/>}/>
        <Route path='/Register' element={<Register/>}/>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    
  );
}

export default App;
