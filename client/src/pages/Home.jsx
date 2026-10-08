import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

export default function Home() {
  const { customer } = useAuth()
  const firstName = customer?.fullName?.split(' ')[0] || 'there'

  return (
    <div className="app-shell">
      <Navbar />
      <main className="home-content">
        <section className="home-hero">
          <div className="home-hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> YOUR SHOPKART SPACE</p>
            <h1>Hi {firstName},<br />let’s find <em>good.</em></h1>
            <p className="hero-copy">A fresh little find can make an ordinary day feel special. See what catches your eye.</p>
            <Link className="button button-primary" to="/products">Browse the collection <span aria-hidden="true">→</span></Link>
          </div>
          <div className="home-hero-art" aria-hidden="true">
            <div className="home-art-circle" />
            <div className="home-art-card"><span>THE GOOD<br />FINDS CLUB</span><strong>01<span>/</span>26</strong></div>
            <span className="home-art-spark">✳</span>
          </div>
        </section>
        <section className="profile-section">
          <div className="section-heading">
            <div><p className="eyebrow">Your details</p><h2>Your personal edit</h2></div>
            <Link className="section-link" to="/profile">Edit profile <span aria-hidden="true">→</span></Link>
          </div>
          <div className="profile-grid">
            <article className="profile-card profile-card-feature"><span className="card-label">CUSTOMER</span><strong>{customer?.fullName}</strong><span className="card-detail">Member since {customer?.createdAt ? new Date(customer.createdAt).getFullYear() : '2026'}</span></article>
            <article className="profile-card"><span className="card-label">EMAIL ADDRESS</span><strong>{customer?.email}</strong><span className="card-detail">Your primary contact</span></article>
            <article className="profile-card"><span className="card-label">PHONE NUMBER</span><strong>{customer?.phone}</strong><span className="card-detail">Your shipping contact</span></article>
          </div>
        </section>
      </main>
    </div>
  )
}
