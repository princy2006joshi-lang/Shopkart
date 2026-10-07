import { useState } from 'react'
import Navbar from '../components/Navbar'
import StatusMessage from '../components/StatusMessage'
import { authApi } from '../axiosCalls/axios'
import { useAuth } from '../context/AuthContext'

export default function CustomerProfile() {
  const { customer, setCustomer } = useAuth()
  const [form, setForm] = useState({ fullName: customer?.fullName || '', email: customer?.email || '', phone: customer?.phone || '', shippingAddress: customer?.shippingAddress || '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const submit = async (event) => { event.preventDefault(); setError(''); setMessage(''); try { const response = await authApi.updateProfile(form); setCustomer?.(response.data.customer); setMessage('Profile updated successfully.') } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update profile.') } }
  return <div className="app-shell"><Navbar /><main className="profile-page"><p className="eyebrow">Your account</p><h1>Personal <em>details.</em></h1><StatusMessage message={error} /><StatusMessage message={message} type="success" /><form onSubmit={submit} className="profile-form"><label>Full name<input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} /></label><label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Phone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label><label>Shipping address<textarea value={form.shippingAddress} onChange={(event) => setForm({ ...form, shippingAddress: event.target.value })} /></label><button className="button button-primary">Save changes <span aria-hidden="true">{'->'}</span></button></form></main></div>
}
