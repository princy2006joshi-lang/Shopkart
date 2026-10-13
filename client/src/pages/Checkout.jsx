import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import StatusMessage from '../components/StatusMessage'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from '../axiosCalls/orderApi'

function formatPrice(price) {
  return `Rs.${Number(price).toLocaleString('en-IN')}`
}

export default function Checkout() {
  const navigate = useNavigate()
  const { customer } = useAuth()
  const { cartItems, subtotal, refreshCart } = useCart()
  const [form, setForm] = useState({
    shippingAddress: customer?.shippingAddress || '',
    phone: customer?.phone || ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Razorpay')

  const itemCount = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const openRazorpayCheckout = async () => {
    const razorpayResponse = await createRazorpayOrder({
      shippingAddress: form.shippingAddress,
      phone: form.phone
    })

    const { razorpay } = razorpayResponse

    if (!window.Razorpay) {
      throw new Error('Razorpay checkout could not be loaded. Check your internet connection and try again.')
    }

    const options = {
      key: razorpayResponse.keyId,
      amount: razorpay.amount,
      currency: razorpay.currency,
      name: 'Shopkart',
      description: 'Order payment',
      order_id: razorpay.id,
      handler: async function (response) {
        try {
          const verifyResponse = await verifyRazorpayPayment({
            orderId: razorpayResponse.order._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })

          await refreshCart()
          navigate(`/orders/${verifyResponse.order._id}`)
        } catch (verifyError) {
          setError(verifyError.response?.data?.message || 'Payment verification failed. Please contact support.')
        }
      },
      prefill: {
        name: customer?.fullName || '',
        email: customer?.email || '',
        contact: form.phone
      },
      notes: {
        shippingAddress: form.shippingAddress
      },
      theme: {
        color: '#6941d9'
      }
    }

    const razorpayInstance = new window.Razorpay(options)
    razorpayInstance.open()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!form.shippingAddress.trim() || !form.phone.trim()) {
      setError('Please add a shipping address and phone number before placing the order.')
      return
    }

    setSubmitting(true)

    try {
      if (paymentMethod === 'Razorpay') {
        await openRazorpayCheckout()
        setMessage('Redirecting to Razorpay...')
        return
      }

      const response = await createOrder({
        shippingAddress: form.shippingAddress,
        phone: form.phone,
        paymentMethod: 'COD'
      })

      setMessage(response.message || 'Order placed successfully.')
      await refreshCart()
      navigate(`/orders/${response.order._id}`)
    } catch (requestError) {
      const backendMessage = requestError.response?.data?.message || requestError.response?.data?.error
      setError(backendMessage || requestError.message || 'Unable to place your order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!cartItems.length) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="catalog-content">
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">▣</span>
            <h2>Your bag is empty</h2>
            <p>Add a few favorites before you proceed to checkout.</p>
            <Link className="button button-primary" to="/products">Browse products <span aria-hidden="true">→</span></Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="checkout-page">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">Checkout</p>
            <h1>Place your <em>order.</em></h1>
          </div>
          <p>{itemCount} {itemCount === 1 ? 'item' : 'items'} ready to ship.</p>
        </div>

        <div className="checkout-layout">
          <section className="profile-form checkout-form">
            <h2>Delivery details</h2>
            <StatusMessage message={error} />
            <StatusMessage message={message} type="success" />

            <form onSubmit={handleSubmit}>
              <label>
                Shipping address
                <textarea name="shippingAddress" value={form.shippingAddress} onChange={handleChange} placeholder="House number, street, city, state, pin code" />
              </label>
              <label>
                Phone number
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your contact number" />
              </label>

              <div className="payment-method-group">
                <button
                  type="button"
                  className={`payment-method-option ${paymentMethod === 'Razorpay' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('Razorpay')}
                >
                  Razorpay
                </button>
                <button
                  type="button"
                  className={`payment-method-option ${paymentMethod === 'COD' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  Cash on delivery
                </button>
              </div>

              <button className="button button-primary" type="submit" disabled={submitting}>
                {submitting ? 'Processing...' : `Pay ${formatPrice(subtotal)}`} <span aria-hidden="true">→</span>
              </button>
            </form>
          </section>

          <aside className="profile-card cart-summary">
            <h2>Your order</h2>

            {cartItems.map((item) => {
              const product = item.product
              if (!product) return null

              return (
                <div key={product._id} className="checkout-item-row">
                  <div>
                    <strong>{product.name}</strong>
                    <span>{item.quantity} x {formatPrice(product.price)}</span>
                  </div>
                  <span>{formatPrice(Number(product.price) * Number(item.quantity))}</span>
                </div>
              )
            })}

            <div className="catalog-product-footer summary-total">
              <span>Total</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <Link className="button button-secondary" to="/cart">Edit bag <span aria-hidden="true">←</span></Link>
          </aside>
        </div>
      </main>
    </div>
  )
}
