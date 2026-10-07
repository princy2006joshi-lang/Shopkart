import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function Home() {
  const { customer } = useAuth()
  const firstName = customer?.fullName?.split(' ')[0] || 'there'

  return <div className="app-shell"><Navbar /><main className="home-content"><section className="home-hero"><div><p className="eyebrow">Your ShopKart space</p><h1>Welcome home,<br /><em>{firstName}.</em></h1><p className="hero-copy">A good day to find something that fits your life beautifully.</p></div><div className="hero-stamp">SK<br /><span>01</span></div></section><section className="profile-section"><div><p className="eyebrow">Account details</p><h2>Your personal edit</h2></div><div className="profile-grid"><article className="profile-card profile-card-feature"><span className="card-label">Customer</span><strong>{customer?.fullName}</strong><span className="card-detail">Member since {customer?.createdAt ? new Date(customer.createdAt).getFullYear() : '2026'}</span></article><article className="profile-card"><span className="card-label">Email</span><strong>{customer?.email}</strong><span className="card-detail">Primary contact</span></article><article className="profile-card"><span className="card-label">Phone</span><strong>{customer?.phone}</strong><span className="card-detail">Shipping contact</span></article></div></section></main></div>
}
