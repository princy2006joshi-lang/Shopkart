# ShopKart

ShopKart is a MERN e-commerce application with a React/Vite storefront and an Express/MongoDB API. Customers can browse products, manage a cart and wishlist, update their profile, place cash-on-delivery orders, and pay through Razorpay.

## Features

- Customer registration, login, and profile management
- Product catalog and product details
- Shopping cart and wishlist
- Checkout with cash on delivery or Razorpay
- Order history and order details
- Product stock validation and updates when an order is completed

## Technology

- Frontend: React, React Router, Vite, Axios
- Backend: Node.js, Express, Mongoose, JWT, Razorpay
- Database: MongoDB

## Requirements

- Node.js 22.12 or newer (Node.js 22 LTS recommended)
- npm
- A MongoDB database, either local or hosted (for example, MongoDB Atlas)
- Razorpay test API keys to exercise online payments; cash on delivery does not require Razorpay keys

## Setup

### 1. Get the code and install dependencies

From the repository root, install the client and server dependencies in their respective folders:

```bash
cd client
npm install
cd ../server
npm install
```

### 2. Configure the backend

Create `server/.env` and add:

```dotenv
dbURL=mongodb://127.0.0.1:27017/shopkart
JWT_SECRET=replace-with-a-long-random-secret
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_secret
```

- Set `dbURL` to the connection string for your MongoDB database. For Atlas, use the connection string supplied by Atlas.
- Set `JWT_SECRET` to a long, randomly generated secret.
- Razorpay variables are needed only for Razorpay checkout. Use test-mode credentials while developing.
- Keep `server/.env` private; do not commit it or share its values.

The API connects to MongoDB using `dbURL` and listens on port `9001`. Its local CORS configuration allows the Vite development origin `http://localhost:5173`.

### 3. Start the API

In one terminal, run:

```bash
cd server
npm run dev
```

The API should report that the server started and MongoDB connected. You can check the server at [http://localhost:9001/](http://localhost:9001/).

### 4. Start the frontend

In a second terminal, run:

```bash
cd client
npm run dev
```

Open the URL printed by Vite, normally [http://localhost:5173/](http://localhost:5173/). The Vite development server proxies API requests to `http://localhost:9001`.

## Sample products

To load the sample catalog, make sure `server/.env` points to the database you intend to use, then run:

```bash
cd server
npm run seed
```

**Warning:** the seed script deletes all existing product records in the configured database before inserting its sample catalog. Do not run it against a database whose product data you need to preserve.

## Production build

To build the frontend:

```bash
cd client
npm run build
```

Vite writes the production files to `client/dist`. To preview that build locally:

```bash
npm run preview
```

The backend currently uses a fixed port and a localhost-only CORS origin for development. Before deploying, configure it to use the hosting provider's port and the deployed frontend origin, and configure cross-site secure cookies if the frontend and API use different domains. Set `VITE_API_URL` to the deployed API URL when building the frontend for an API hosted separately; the Vite proxy is for local development only.

## Project layout

```text
client/
  src/
    axiosCalls/     API client functions
    components/     Shared React components
    context/        Authentication and cart state
    pages/          Storefront, checkout, and order screens
server/
  controllers/      Request handlers and business logic
  middlewares/      Authentication middleware
  model/            Mongoose models
  routes/            Express routes
  utils/             Shared server utilities
  index.js           API entry point
  seed.js            Sample product data loader
```

## Main API endpoints

Customer endpoints are mounted under `/customer`, products under `/products`, cart under `/cart`, wishlist under `/wishlist`, and orders under `/orders`. Customer-specific cart, wishlist, and order actions require login and use the authentication cookie.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/customer/register` | Register a customer |
| `POST` | `/customer/login` | Log in |
| `GET` | `/products` | List products |
| `GET` | `/products/:id` | Get product details |
| `GET` | `/cart` | Get the signed-in customer's cart |
| `GET` | `/wishlist` | Get the signed-in customer's wishlist |
| `GET` | `/orders` | List the signed-in customer's orders |
| `POST` | `/orders` | Place a cash-on-delivery order |
| `POST` | `/orders/razorpay` | Create a Razorpay payment order |
| `POST` | `/orders/verify-payment` | Verify a Razorpay payment |
| `GET` | `/orders/:id` | Get an order's details |
