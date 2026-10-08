import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartNavLink() {
  const { cartCount } = useCart()

  return (
    <Link className="nav-link nav-badge-link" to="/cart" aria-label={`Cart, ${cartCount} items`}>
      <span>Cart</span>
      <span className="nav-count">{cartCount}</span>
    </Link>
  )
}
