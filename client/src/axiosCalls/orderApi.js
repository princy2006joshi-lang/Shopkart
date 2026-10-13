import { axiosInstance } from './axios'

export async function fetchMyOrders() {
  const response = await axiosInstance.get('/orders')
  return response.data
}

export async function fetchOrder(orderId) {
  const response = await axiosInstance.get(`/orders/${orderId}`)
  return response.data
}

export async function createOrder(orderPayload) {
  const response = await axiosInstance.post('/orders', orderPayload)
  return response.data
}

export async function createRazorpayOrder(orderPayload) {
  const response = await axiosInstance.post('/orders/razorpay', orderPayload)
  return response.data
}

export async function verifyRazorpayPayment(payload) {
  const response = await axiosInstance.post('/orders/verify-payment', payload)
  return response.data
}
