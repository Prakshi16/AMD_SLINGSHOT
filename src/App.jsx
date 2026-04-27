import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './UserContext';
import SignUpScreen from './components/SignUpScreen';
import OnboardingStep1 from './components/OnboardingStep1';
import OnboardingStep2 from './components/OnboardingStep2';
import HomeScreen from './components/HomeScreen';
import BrowseScreen from './components/BrowseScreen';
import ChatScreen from './components/ChatScreen';
import StatsScreen from './components/StatsScreen';
import ProfileScreen from './components/ProfileScreen';
import MealDetail from './components/MealDetail';
import NavBar from './components/NavBar';

function AppRoutes() {
  const { user } = useUser();

  return (
    <div className="max-w-[390px] mx-auto relative min-h-screen bg-background">
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <SignUpScreen />} />

        {/* Onboarding — only accessible if NOT logged in */}
        <Route path="/onboarding/step1" element={user ? <Navigate to="/home" /> : <OnboardingStep1 />} />
        <Route path="/onboarding/step2" element={user ? <Navigate to="/home" /> : <OnboardingStep2 />} />

        {/* Main app routes — only accessible if logged in */}
        <Route path="/home" element={user ? <><HomeScreen /><NavBar active="home" /></> : <Navigate to="/" />} />
        <Route path="/browse" element={user ? <><BrowseScreen /><NavBar active="explore" /></> : <Navigate to="/" />} />
        <Route path="/chat" element={user ? <><ChatScreen /><NavBar active="smart_toy" /></> : <Navigate to="/" />} />
        <Route path="/stats" element={user ? <><StatsScreen /><NavBar active="query_stats" /></> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <><ProfileScreen /><NavBar active="person" /></> : <Navigate to="/" />} />
        <Route path="/meal/:mealId" element={user ? <MealDetail /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
