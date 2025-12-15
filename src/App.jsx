import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import DebtDestroyer from './games/DebtDestroyer'
import CreditQuest from './games/CreditQuest'
import SavingsSprint from './games/SavingsSprint'
import ProtectedRoute from './components/ProtectedRoute'
import GameHub from './pages/GameHub'
import MarketPredictor from './games/MarketPredictor'
import NeedsVsWants from './games/NeedsVsWants'
import TimeTraveler from './games/TimeTraveler'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game/debt-destroyer" element={<DebtDestroyer />} />
     
        <Route path="/game-hub" element={
          <ProtectedRoute>
            <GameHub />
          </ProtectedRoute>
        } />
        <Route path="/game/market-predictor" element={<MarketPredictor />} />
        <Route path="/game/needs-vs-wants" element={<NeedsVsWants />} />
        <Route path="/game/time-traveler" element={<TimeTraveler />} />
        <Route path="/game/credit-quest" element={<CreditQuest />} />
        <Route path="/game/savings-sprint" element={<SavingsSprint />} />
        {/* Protected Dashboard Route */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <GameHub />
          </ProtectedRoute>
        } />
        {/* Fallback route to handle unknown locations */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App