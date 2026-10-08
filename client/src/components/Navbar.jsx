import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CartNavLink from './CartNavLink'
import WishlistNavLink from './WishlistNavLink'

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
    <header className="navbar-wrap">
      <div className="navbar">
        <Link className="brand" to="/home"><span className="brand-mark">S</span><span>shopkart</span></Link>
      <nav className="nav-actions">
        <Link className="nav-link" to="/products">Catalog</Link>
        <WishlistNavLink />
        <CartNavLink />
        <Link className="nav-link" to="/profile">Profile</Link>
        <span className="nav-greeting">Hi, {customer?.fullName?.split(' ')[0]}</span>
        <button className="button button-quiet logout-button" onClick={handleLogout}>Log out <span aria-hidden="true">↗</span></button>
      </nav>
      </div>
    </header>
  )
}
