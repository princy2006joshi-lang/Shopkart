import express from 'express'
import { createOrder, createRazorpayOrder, getMyOrders, getOrderById, verifyRazorpayPayment } from '../controllers/order.controllers.js'
import isAuthenticated from '../middlewares/authMiddleware.js'

const orderRoutes = express.Router()

orderRoutes.use(isAuthenticated)
orderRoutes.get('/', getMyOrders)
orderRoutes.post('/', createOrder)
orderRoutes.post('/razorpay', createRazorpayOrder)
orderRoutes.post('/verify-payment', verifyRazorpayPayment)
orderRoutes.get('/:id', getOrderById)

export default orderRoutes
