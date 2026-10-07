import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { customer, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/home"><span className="brand-mark">S</span>shopkart</Link>
      <nav className="nav-actions">
        <Link to="/products">Catalog</Link>
        <Link to="/profile">Profile</Link>
        <span className="nav-greeting">Hi, {customer?.fullName?.split(' ')[0]}</span>
        <button className="button button-quiet" onClick={handleLogout}>Log out <span aria-hidden="true">↗</span></button>
      </nav>
    </header>
  )
}
