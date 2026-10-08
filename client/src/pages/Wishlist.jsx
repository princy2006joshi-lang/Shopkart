import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { fetchWishlist, notifyWishlistUpdated, removeWishlistProduct } from '../axiosCalls/wishlistApi'

function formatPrice(price) {
  return `Rs.${Number(price).toLocaleString('en-IN')}`
}

export default function Wishlist() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState('')

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetchWishlist()
      setProducts(response.wishlist || [])
    } catch {
      setError('We could not load your wishlist. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  const handleRemove = async (productId) => {
    setRemovingId(productId)
    try {
      await removeWishlistProduct(productId)
      setProducts((currentProducts) => currentProducts.filter((product) => product._id !== productId))
      notifyWishlistUpdated()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to remove this product.')
    } finally {
      setRemovingId('')
    }
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="catalog-content">
        <div className="catalog-heading">
          <div><p className="eyebrow"><span className="eyebrow-dot" /> SAVED FOR LATER</p><h1>Your <em>wishlist.</em></h1></div>
          <p>{products.length} {products.length === 1 ? 'thoughtful find' : 'thoughtful finds'} saved for later.</p>
        </div>
        {loading && <p className="loading-note">Gathering your saved finds...</p>}
        {!loading && error && <div className="error-message" role="alert">{error}</div>}
        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">♡</span>
            <h2>A little space for things you love.</h2>
            <p>Tap the heart on anything you like and it’ll be waiting here.</p>
            <Link className="button button-primary" to="/products">Explore the collection <span aria-hidden="true">→</span></Link>
          </div>
        )}
        {!loading && !error && products.length > 0 && (
          <section className="catalog-grid">
            {products.map((product) => (
              <article key={product._id} className="catalog-product-card">
                <Link to={`/products/${product._id}`} className="catalog-product-image-wrap">
                  <img src={product.image} alt={product.name} className="catalog-product-image" />
                  <span className="product-image-tag">{product.category}</span>
                </Link>
                <div className="catalog-product-meta">
                  <div className="product-card-title-row">
                    <Link to={`/products/${product._id}`} className="product-card-title"><h2>{product.name}</h2></Link>
                    <strong className="product-card-price">{formatPrice(product.price)}</strong>
                  </div>
                  <p className="product-card-stock">{product.stock > 0 ? `${product.stock} available` : 'Currently out of stock'}</p>
                  <div className="wishlist-card-actions">
                    <Link className="button button-primary" to={`/products/${product._id}`}>View details <span aria-hidden="true">→</span></Link>
                    <button className="remove-button" type="button" onClick={() => handleRemove(product._id)} disabled={removingId === product._id}>{removingId === product._id ? 'Removing...' : 'Remove'}</button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
