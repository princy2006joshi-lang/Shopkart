import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../axiosCalls/axios'

const initialForm = { fullName: '', email: '', password: '', phone: '' }

export default function Signup() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const handleChange = ({ target }) => setForm({ ...form, [target.name]: target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (Object.values(form).some((value) => !value.trim())) return setError('Please complete every field.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setBusy(true)
    setError('')
    try {
      await authApi.register(form)
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create your account.')
    } finally {
      setBusy(false)
    }
  }

  return <main className="auth-shell"><section className="auth-aside register-aside"><Link className="brand brand-light" to="/login"><span className="brand-mark">S</span>shopkart</Link><div className="aside-copy"><p className="eyebrow">A better starting point</p><h1>Make room for<br /><em>what matters.</em></h1><p>Join a calmer way to discover useful, beautiful things for every day.</p></div><span className="aside-note">CURATED / CONSCIOUS / CURRENT</span></section><section className="auth-panel"><div className="form-wrap"><p className="eyebrow">Create your account</p><h2>Start shopping better</h2><p className="form-intro">A few details, then you are in.</p>{error && <div className="error-message" role="alert">{error}</div>}<form onSubmit={handleSubmit} noValidate><label>Full name<input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Alex Morgan" autoComplete="name" /></label><label>Email address<input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" /></label><div className="field-row"><label>Password<input name="password" type="password" value={form.password} onChange={handleChange} placeholder="6+ characters" autoComplete="new-password" /></label><label>Phone number<input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Your phone" autoComplete="tel" /></label></div><button className="button button-primary" disabled={busy}>{busy ? 'Creating account...' : 'Create account'} <span aria-hidden="true">→</span></button></form><p className="form-footer">Already have an account? <Link to="/login">Sign in</Link></p></div></section></main>
}
