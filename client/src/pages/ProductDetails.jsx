import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import StatusMessage from '../components/StatusMessage'
import { addWishlistProduct, notifyWishlistUpdated } from '../axiosCalls/wishlistApi'
import { fetchProduct } from '../axiosCalls/productApi'
import { useCart } from '../context/CartContext'

export default function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchProduct(id).then(setProduct).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load product.')) }, [id])

  const handleAddToCart = async () => {
    setError('')
    setMessage('')
    setSaving(true)
    try {
      const response = await addToCart(product._id)
      setMessage(response.message || 'Added to your bag.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to add this product to your bag.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddToWishlist = async () => {
    setError('')
    setMessage('')
    setSaving(true)
    try {
      const response = await addWishlistProduct(product._id)
      notifyWishlistUpdated()
      setMessage(response.message || 'Saved to your wishlist.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save this product.')
    } finally {
      setSaving(false)
    }
  }

  if (error && !product) return <div className="app-shell"><Navbar /><main className="catalog-content"><StatusMessage message={error} /><Link to="/products">Back to catalog</Link></main></div>
  if (!product) return <div className="page-loader">Loading product...</div>
  return <div className="app-shell"><Navbar /><main className="product-detail"><img src={product.image} alt={product.name} /><div><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="product-price">Rs.{Number(product.price).toLocaleString('en-IN')}</p><p className="product-description">{product.description}</p><p>{product.stock > 0 ? `${product.stock} available` : 'Currently out of stock'}</p><StatusMessage message={error} /><StatusMessage message={message} type="success" /><button className="button button-primary" onClick={handleAddToCart} disabled={!product.stock || saving}>Add to bag <span aria-hidden="true">+</span></button><button className="button button-secondary" onClick={handleAddToWishlist} disabled={saving}>Save to wishlist <span aria-hidden="true">♡</span></button><p><Link to="/products">Back to catalog</Link></p></div></main></div>
}
