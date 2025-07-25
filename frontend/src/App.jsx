import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import ChatInterface from './components/Chat/ChatInterface'
import Home from './pages/Home/Home'
import SignupPage from './pages/Signup/SignupPage'
import LoginPage from './pages/Login/LoginPage'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './utils/PrivateRoute'
import Documents from './components/Documents/Documents'
import RegularBailForm from './components/Documents/BailApplication/RegularBailForm'
import './App.css'
import AnticipatorybailForm from './components/Documents/AnticipatoryBailApplication/AnticipatorybailForm.jsx'
import Section138ComplaintForm from './components/Documents/Section138Complaint/Section138ComplaintForm.jsx'
import Section125MaintenanceForm from './components/Documents/Section125Maintenance/Section125MaintenanceForm.jsx'
import OrderXXXVIIComplaintForm from './components/Documents/OrderXXXVII/OrderXXXVIIComplaintForm.jsx'
import PermanentInjunctionForm from './components/Documents/PermanentInjunction/PermanentInjunctionForm.jsx'
import TemporaryInjunctionForm from './components/Documents/TemporaryInjunction/TemporaryInjunctionForm.jsx'
import EjectmentDamagesForm from './components/Documents/EjectmentDamages/EjectmentDamagesForm.jsx'
import IndigentPersonForm from './components/Documents/IndigentPersonApplication/IndigentPersonForm.jsx'
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <ChatInterface />
                  </PrivateRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <PrivateRoute>
                    <Documents />
                  </PrivateRoute>
                }
              />
              <Route
                path="/documents/regular-bail-form"
                element={
                  <PrivateRoute>
                    <RegularBailForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/documents/anticipatory-bail-form"
                element={
                  <PrivateRoute>
                    <AnticipatorybailForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/documents/section-138-complaint-form"
                element={
                  <PrivateRoute>
                    <Section138ComplaintForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/documents/section-125-maintenance-form"
                element={
                  <PrivateRoute>
                    <Section125MaintenanceForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/documents/order-37-suit-form"
                element={
                  <PrivateRoute>
                    <OrderXXXVIIComplaintForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/documents/permanent-injunction-form"
                element={
                  <PrivateRoute>
                    <PermanentInjunctionForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/documents/temporary-injunction-form"
                element={
                  <PrivateRoute>
                    <TemporaryInjunctionForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/documents/ejectment-damages-form"
                element={
                  <PrivateRoute>
                    <EjectmentDamagesForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/documents/indigent-person-application"
                element={
                  <PrivateRoute>
                    <IndigentPersonForm />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App