import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/store/authContext'

type PrivateRouteProps = {
  children: React.ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If user is not approved and not on profile page, redirect to profile
  if (user && !user.isApproved && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />
  }

  // Allow approved users to access profile page (no redirect)

  return <>{children}</>
}

