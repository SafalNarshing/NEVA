import { Routes, Route, Outlet } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame'
import BottomNav from './components/BottomNav'
import { LanguageProvider } from './i18n/LanguageContext'
import { ConversationProvider } from './context/ConversationContext'
import Home from './pages/Home'
import Instructions from './pages/Instructions'
import InstructionDetail from './pages/InstructionDetail'
import Chat from './pages/Chat'
import LiveMode from './pages/LiveMode'
import MapPage from './pages/MapPage'

/** Shell for tabbed screens: scrollable content + persistent bottom nav. */
function TabbedLayout() {
  return (
    <div className="flex h-full flex-col">
      <main className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <PhoneFrame>
      <LanguageProvider>
        <ConversationProvider>
          <Routes>
          {/* Immersive full-screen route (no bottom nav) */}
          <Route path="/live" element={<LiveMode />} />

          {/* Tabbed screens */}
          <Route element={<TabbedLayout />}>
            <Route index element={<Home />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/instructions/:id" element={<InstructionDetail />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/map" element={<MapPage />} />
          </Route>
          </Routes>
        </ConversationProvider>
      </LanguageProvider>
    </PhoneFrame>
  )
}
