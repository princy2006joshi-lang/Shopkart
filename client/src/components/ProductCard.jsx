import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addWishlistProduct, notifyWishlistUpdated } from '../axiosCalls/wishlistApi'
import { useCart } from '../context/CartContext'

function formatPrice(price) {
  return `Rs.${Number(price).toLocaleString('en-IN')}`
}

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart()
  const [busyAction, setBusyAction] = useState('')
  const [feedback, setFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState('success')
  const isInCart = cartItems.some((item) => item.product?._id === product._id)

  const runAction = async (action) => {
    setBusyAction(action)
    setFeedback('')
    try {
      if (action === 'cart') {
        await addToCart(product._id)
        setFeedback('Added to your bag.')
      } else {
        const response = await addWishlistProduct(product._id)
        notifyWishlistUpdated()
        setFeedback(response.message || 'Saved to your wishlist.')
      }
      setFeedbackType('success')
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to complete that action.')
      setFeedbackType('error')
    } finally {
      setBusyAction('')
    }
  }

  return <article className="catalog-product-card">
    <Link to={`/products/${product._id}`} className="catalog-product-image-wrap">
      <img src={product.image} alt={product.name} className="catalog-product-image" />
      <span className="product-image-tag">{product.category}</span>
    </Link>
    <div className="catalog-product-meta">
      <div className="product-card-title-row">
        <Link to={`/products/${product._id}`} className="product-card-title"><h2>{product.name}</h2></Link>
        <strong className="product-card-price">{formatPrice(product.price)}</strong>
      </div>
      <p className="catalog-product-description">{product.description}</p>
      <div className="product-card-stock">{product.stock > 0 ? `${product.stock} available` : 'Currently out of stock'}</div>
      <div className="product-card-actions">
        <button className="button button-primary" type="button" onClick={() => runAction('cart')} disabled={!product.stock || Boolean(busyAction)}>{busyAction === 'cart' ? 'Adding...' : isInCart ? 'Added to bag' : 'Add to bag'} <span aria-hidden="true">{isInCart ? '✓' : '→'}</span></button>
        <button className="button button-icon" aria-label="Save to wishlist" type="button" onClick={() => runAction('wishlist')} disabled={Boolean(busyAction)}>{busyAction === 'wishlist' ? '…' : '♡'}</button>
      </div>
      {feedback && <p className={`action-feedback ${feedbackType}`}>{feedback}</p>}
    </div>
  </article>
}
