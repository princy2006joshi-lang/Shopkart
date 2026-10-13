import crypto from 'crypto'
import mongoose from 'mongoose'
import Razorpay from 'razorpay'
import Customer from '../model/customer.model.js'
import Order from '../model/order.model.js'
import Product from '../model/product.model.js'

const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the server environment.')
  }

  return {
    keyId,
    client: new Razorpay({ key_id: keyId, key_secret: keySecret })
  }
}

const normalizeOrder = (order) => ({
  ...order.toObject ? order.toObject() : order,
  items: (order.items || []).filter(Boolean)
})

const getValidCartItems = async (customer) => {
  if (!customer || !customer.cart || customer.cart.length === 0) {
    throw new Error('Your cart is empty')
  }

  const validItems = []
  let subtotal = 0

  for (const cartItem of customer.cart) {
    const product = cartItem.product

    if (!product || !product._id) {
      throw new Error('One or more products are no longer available')
    }

    if (Number(cartItem.quantity) > Number(product.stock)) {
      throw new Error(`Only ${product.stock} unit${product.stock === 1 ? '' : 's'} available for ${product.name}.`)
    }

    const itemTotal = Number(product.price) * Number(cartItem.quantity)
    subtotal += itemTotal

    validItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: Number(product.price),
      quantity: Number(cartItem.quantity)
    })
  }

  return { validItems, subtotal }
}

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, phone, paymentMethod = 'COD' } = req.body

    if (!shippingAddress || !phone) {
      return res.status(400).json({ message: 'Shipping address and phone are required' })
    }

    const customer = await Customer.findById(req.customer._id).populate({
      path: 'cart.product',
      select: 'name price image stock'
    })

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const { validItems, subtotal } = await getValidCartItems(customer)

    const order = await Order.create({
      customer: req.customer._id,
      items: validItems,
      shippingAddress,
      phone,
      paymentMethod,
      paymentStatus: 'pending',
      totalAmount: subtotal,
      status: 'pending'
    })

    for (const item of validItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -Number(item.quantity) }
      })
    }

    customer.cart = []
    await customer.save()

    const createdOrder = await Order.findById(order._id).populate({
      path: 'customer',
      select: 'fullName email phone shippingAddress'
    })

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: normalizeOrder(createdOrder)
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to place order', error: error.message })
  }
}

export const createRazorpayOrder = async (req, res) => {
  try {
    const { shippingAddress, phone } = req.body

    if (!shippingAddress || !phone) {
      return res.status(400).json({ message: 'Shipping address and phone are required' })
    }

    const { keyId, client } = getRazorpayClient()
    const customer = await Customer.findById(req.customer._id).populate({
      path: 'cart.product',
      select: 'name price image stock'
    })

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const { validItems, subtotal } = await getValidCartItems(customer)

    const order = await Order.create({
      customer: req.customer._id,
      items: validItems,
      shippingAddress,
      phone,
      paymentMethod: 'Razorpay',
      paymentStatus: 'pending',
      totalAmount: subtotal,
      status: 'pending'
    })

    const razorpayOrder = await client.orders.create({
      amount: Math.round(subtotal * 100),
      currency: 'INR',
      receipt: order._id.toString(),
      notes: {
        customerId: req.customer._id.toString(),
        shippingAddress
      }
    })

    order.razorpayOrderId = razorpayOrder.id
    await order.save()

    return res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully',
      order: normalizeOrder(order),
      razorpay: razorpayOrder,
      keyId
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to initialize Razorpay payment', error: error.message })
  }
}

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification details are missing' })
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return res.status(500).json({ message: 'Razorpay is not configured on the server' })
    }

    const order = await Order.findOne({ _id: orderId, customer: req.customer._id })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (!order.razorpayOrderId || order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ message: 'Payment does not match this order' })
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    if (order.paymentStatus === 'paid') {
      return res.status(200).json({ success: true, message: 'Payment already verified', order: normalizeOrder(order) })
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -Number(item.quantity) }
      })
    }

    order.paymentStatus = 'paid'
    order.status = 'processing'
    await order.save()

    const customer = await Customer.findById(req.customer._id)
    if (customer) {
      customer.cart = []
      await customer.save()
    }

    return res.status(200).json({
      success: true,
      message: 'Payment successful',
      order: normalizeOrder(order)
    })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to verify payment', error: error.message })
  }
}

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.customer._id }).sort({ createdAt: -1 })
    return res.status(200).json({ success: true, orders })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch your orders', error: error.message })
  }
}

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' })
    }

    const order = await Order.findOne({ _id: id, customer: req.customer._id })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    return res.status(200).json({ success: true, order: normalizeOrder(order) })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch order', error: error.message })
  }
}
