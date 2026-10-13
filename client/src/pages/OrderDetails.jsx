import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import StatusMessage from '../components/StatusMessage'
import { fetchOrder } from '../axiosCalls/orderApi'

function formatPrice(price) {
  return `Rs.${Number(price).toLocaleString('en-IN')}`
}

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetchOrder(id)
        setOrder(response.order)
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load the order.')
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [id])

  if (loading) {
    return <div className="app-shell"><Navbar /><main className="catalog-content"><p className="loading-note">Loading your order...</p></main></div>
  }

  if (error) {
    return <div className="app-shell"><Navbar /><main className="catalog-content"><StatusMessage message={error} /><Link to="/orders">Back to orders</Link></main></div>
  }

  if (!order) {
    return <div className="app-shell"><Navbar /><main className="catalog-content"><StatusMessage message="Order not found." /><Link to="/orders">Back to orders</Link></main></div>
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="checkout-page">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">Order details</p>
            <h1>Order <em>#{String(order._id).slice(-6).toUpperCase()}</em></h1>
          </div>
          <p>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>

        <div className="checkout-layout">
          <section className="profile-form">
            <h2>Order summary</h2>
            <div className="order-detail-block">
              <span>Status</span>
              <strong className="order-status status-pill">{order.status}</strong>
            </div>
            <div className="order-detail-block">
              <span>Payment</span>
              <strong>{order.paymentMethod}</strong>
            </div>
            <div className="order-detail-block">
              <span>Shipping to</span>
              <strong>{order.shippingAddress}</strong>
            </div>
            <div className="order-detail-block">
              <span>Contact</span>
              <strong>{order.phone}</strong>
            </div>

            <div className="checkout-items-list">
              {order.items.map((item) => (
                <div key={`${order._id}-${item.product}`} className="checkout-item-row order-item-row">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.quantity} x {formatPrice(item.price)}</span>
                  </div>
                  <span>{formatPrice(Number(item.price) * Number(item.quantity))}</span>
                </div>
              ))}
            </div>
          </section>

          <aside className="profile-card cart-summary">
            <h2>Total paid</h2>
            <div className="catalog-product-footer summary-total">
              <span>Amount</span>
              <strong>{formatPrice(order.totalAmount)}</strong>
            </div>
            <Link className="button button-primary" to="/orders">Back to orders <span aria-hidden="true">→</span></Link>
          </aside>
        </div>
      </main>
    </div>
  )
}
