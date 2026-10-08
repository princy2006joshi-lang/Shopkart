import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fetchWishlistCount } from '../axiosCalls/wishlistApi'

export default function WishlistNavLink() {
  const [count, setCount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    let active = true

    const loadCount = async () => {
      try {
        const nextCount = await fetchWishlistCount()
        if (active) setCount(Number.isFinite(Number(nextCount)) ? Number(nextCount) : 0)
      } catch {
        if (active) setCount(0)
      }
    }

    loadCount()
    window.addEventListener('wishlist-updated', loadCount)

    return () => {
      active = false
      window.removeEventListener('wishlist-updated', loadCount)
    }
  }, [location.pathname])

  return (
    <Link className="nav-link nav-badge-link" to="/wishlist" aria-label={`Wishlist, ${count} items`}>
      <span>Wishlist</span>
      <span className="nav-count" aria-hidden="true">{String(count ?? 0)}</span>
    </Link>
  )
}
