import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import StatusMessage from '../components/StatusMessage'
import { fetchMyOrders } from '../axiosCalls/orderApi'

function formatPrice(price) {
  return `Rs.${Number(price).toLocaleString('en-IN')}`
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetchMyOrders()
      setOrders(response.orders || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load orders.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  return (
    <div className="app-shell">
      <Navbar />
      <main className="catalog-content">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">Orders</p>
            <h1>Your <em>orders.</em></h1>
          </div>
          <p>{orders.length} {orders.length === 1 ? 'order placed' : 'orders placed'}</p>
        </div>

        {loading && <p className="loading-note">Loading your order history...</p>}
        {!loading && error && <StatusMessage message={error} />}

        {!loading && !error && orders.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">◌</span>
            <h2>No orders yet</h2>
            <p>Your recent purchases will appear here after checkout.</p>
            <Link className="button button-primary" to="/products">Shop the collection <span aria-hidden="true">→</span></Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <section className="orders-list">
            {orders.map((order) => (
              <article key={order._id} className="profile-card order-card">
                <div className="order-card-header">
                  <div>
                    <p className="catalog-product-category">Order #{String(order._id).slice(-6).toUpperCase()}</p>
                    <h2>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</h2>
                  </div>
                  <span className="order-status status-pill">{order.status}</span>
                </div>
                <div className="order-summary-row">
                  <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                  <strong>{formatPrice(order.totalAmount)}</strong>
                </div>
                <div className="order-card-actions">
                  <Link className="button button-secondary" to={`/orders/${order._id}`}>View details <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
