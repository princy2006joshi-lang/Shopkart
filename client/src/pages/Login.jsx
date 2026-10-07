import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const registered = location.state?.registered

  const handleChange = ({ target }) => setForm({ ...form, [target.name]: target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.email || !form.password) return setError('Enter your email and password to continue.')
    setBusy(true)
    setError('')
    try {
      await login(form)
      navigate('/home', { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Invalid Credentials')
    } finally {
      setBusy(false)
    }
  }

  return <main className="auth-shell"><section className="auth-aside"><Link className="brand brand-light" to="/login"><span className="brand-mark">S</span>shopkart</Link><div className="aside-copy"><p className="eyebrow">The everyday edit</p><h1>Good things,<br /><em>well chosen.</em></h1><p>Find the pieces that make ordinary days feel a little more considered.</p></div><span className="aside-note">EST. 2026 / ONLINE GOODS</span></section><section className="auth-panel"><div className="form-wrap"><p className="eyebrow">Welcome back</p><h2>Sign in to ShopKart</h2><p className="form-intro">Your next favorite thing is waiting.</p>{registered && <div className="success-message">Account created. You can sign in now.</div>}{error && <div className="error-message" role="alert">{error}</div>}<form onSubmit={handleSubmit} noValidate><label>Email address<input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" /></label><label>Password<input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" autoComplete="current-password" /></label><button className="button button-primary" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'} <span aria-hidden="true">→</span></button></form><p className="form-footer">New to ShopKart? <Link to="/register">Create an account</Link></p></div></section></main>
}
