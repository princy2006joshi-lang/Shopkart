import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import StatusMessage from '../components/StatusMessage'
import { fetchProduct } from '../axiosCalls/productApi'

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { fetchProduct(id).then(setProduct).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load product.')) }, [id])
  if (error) return <div className="app-shell"><Navbar /><main className="catalog-content"><StatusMessage message={error} /><Link to="/products">Back to catalog</Link></main></div>
  if (!product) return <div className="page-loader">Loading product...</div>
  return <div className="app-shell"><Navbar /><main className="product-detail"><img src={product.image} alt={product.name} /><div><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="product-price">Rs.{Number(product.price).toLocaleString('en-IN')}</p><p className="product-description">{product.description}</p><p>{product.stock > 0 ? `${product.stock} available` : 'Currently out of stock'}</p><button className="button button-primary" disabled={!product.stock}>Add to cart <span aria-hidden="true">+</span></button><br /><Link to="/products">Back to catalog</Link></div></main></div>
}
