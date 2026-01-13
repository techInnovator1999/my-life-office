import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { setTheme, getInitialTheme } from './utils/theme'
import { AuthProvider } from './store/authContext'
import { PrivateRoute } from './routes/PrivateRoute'
import { MainLayout } from './components/layout/MainLayout'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { Dashboard } from './pages/dashboard/Dashboard'
import { Contacts } from './pages/contacts/Contacts'
import { Pipeline } from './pages/pipeline/Pipeline'
import { Settings } from './pages/settings/Settings'
import { Users } from './pages/admin/users/Users'
import { Individuals } from './pages/opportunities/Individuals'
import { Businesses } from './pages/opportunities/Businesses'
import { Employees } from './pages/opportunities/Employees'
import { Profile } from './pages/profile/Profile'

function App() {
  useEffect(() => {
    const theme = getInitialTheme()
    setTheme(theme)
  }, [])

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Profile Route (for unapproved users) */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </PrivateRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Contacts />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/pipeline"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Pipeline />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Users />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/opportunities/individuals"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Individuals />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/opportunities/businesses"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Businesses />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/opportunities/employees"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Employees />
                </MainLayout>
              </PrivateRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
