import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { customer, loading } = useAuth()
  if (loading) return <div className="page-loader">Checking your session...</div>
  return customer ? children : <Navigate to="/login" replace />
}
