import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'

function formatPrice(price) {
  return `Rs.${Number(price).toLocaleString('en-IN')}`
}

export default function Cart() {
  const { cartItems, cartLoading, cartError, subtotal, updateQuantity, removeFromCart, refreshCart } = useCart()
  const [updatingId, setUpdatingId] = useState('')

  const handleQuantityChange = async (productId, nextQuantity) => {
    if (!productId || nextQuantity < 1) return
    setUpdatingId(productId)
    try {
      await updateQuantity(productId, nextQuantity)
    } finally {
      setUpdatingId('')
    }
  }

  const handleRemove = async (productId) => {
    setUpdatingId(productId)
    try {
      await removeFromCart(productId)
    } finally {
      setUpdatingId('')
    }
  }

  const itemCount = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0)

  if (cartLoading) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="catalog-content"><p>Loading your cart...</p></main>
      </div>
    )
  }

  if (cartError) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="catalog-content">
          <div className="error-message">{cartError}</div>
          <button className="button button-primary" type="button" onClick={refreshCart}>Try again</button>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="catalog-content">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">Your cart</p>
            <h1>Your <em>bag.</em></h1>
          </div>
          <p>
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">▱</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven’t found your next favorite yet.</p>
            <Link className="button button-primary" to="/products">Explore the collection <span aria-hidden="true">→</span></Link>
          </div>
        ) : (
          <div className="cart-layout">
            <section className="cart-items">
              {cartItems.map((item) => {
                const product = item.product
                if (!product) return null

                const isUpdating = updatingId === product._id
                const lineTotal = Number(product.price || 0) * Number(item.quantity || 0)

                return (
                  <article key={product._id} className="cart-item-card">
                    <Link to={`/products/${product._id}`} className="cart-item-image">
                      <img src={product.image} alt={product.name} className="catalog-product-image" />
                    </Link>
                    <div className="cart-item-meta">
                      <p className="catalog-product-category">{product.category}</p>
                      <div className="cart-item-title-row">
                        <Link to={`/products/${product._id}`}><h2>{product.name}</h2></Link>
                        <strong>{formatPrice(lineTotal)}</strong>
                      </div>
                      <div className="cart-item-bottom">
                        <div className="quantity-control" aria-label={`Quantity ${item.quantity}`}>
                          <button
                            className="quantity-button"
                            type="button"
                            onClick={() => handleQuantityChange(product._id, Number(item.quantity) - 1)}
                            disabled={item.quantity <= 1 || isUpdating}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            className="quantity-button"
                            type="button"
                            onClick={() => handleQuantityChange(product._id, Number(item.quantity) + 1)}
                            disabled={isUpdating || item.quantity >= (product.stock || 0)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="cart-item-unit-price">{formatPrice(product.price)} each</span>
                        <button className="remove-button" type="button" onClick={() => handleRemove(product._id)} disabled={isUpdating}>
                          {isUpdating ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>

            <aside className="profile-card cart-summary">
              <h2>Order summary</h2>
              <div className="catalog-product-footer">
                <span>Items</span>
                <strong>{itemCount}</strong>
              </div>
              <div className="catalog-product-footer summary-total">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p className="cart-checkout-note">Checkout and payment are not part of this cart feature.</p>
              <Link className="button button-primary" to="/products">Continue shopping <span aria-hidden="true">→</span></Link>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
