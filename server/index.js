import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Stripe from 'stripe'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4242
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:5173`

const secretKey = process.env.STRIPE_SECRET_KEY
const stripe = secretKey ? new Stripe(secretKey) : null

// Authoritative catalog. Prices are in cents; the client never sends an
// amount. Each option is one Stripe line item (a bundle), so bundle pricing
// like "2 for $38.99" is preserved. To add a product, add an entry here and a
// matching display entry in src/catalog.js.
const PRODUCTS = {
  vest: {
    name: '25MPH Vest',
    description: 'Neon green safety vest — silkscreen printed front & back.',
    sizes: { S: 'Small', M: 'Medium', L: 'Large' },
    options: {
      single: { label: '1 vest', amount: 1999, units: 1 },
      double: { label: '2 vests', amount: 3899, units: 2 },
    },
  },
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, stripe: Boolean(stripe) })
})

// Public catalog with authoritative prices, for clients that want to verify.
app.get('/api/products', (_req, res) => {
  const list = Object.entries(PRODUCTS).map(([id, p]) => ({
    id,
    name: p.name,
    description: p.description,
    sizes: p.sizes,
    options: Object.entries(p.options).map(([oid, o]) => ({
      id: oid,
      label: o.label,
      amount: o.amount,
    })),
  }))
  res.json(list)
})

app.post('/api/checkout', async (req, res) => {
  try {
    const { productId, option, size } = req.body || {}
    const product = PRODUCTS[productId]

    if (!product) {
      return res.status(400).json({ error: 'Unknown product.' })
    }
    const item = product.options[option]
    if (!item) {
      return res.status(400).json({ error: 'Unknown product option.' })
    }
    if (!product.sizes[size]) {
      return res.status(400).json({ error: 'Please choose a size.' })
    }
    if (!stripe) {
      return res.status(503).json({
        error:
          'Payments are not configured yet. Add STRIPE_SECRET_KEY to a .env file to enable checkout.',
      })
    }

    const label = `${product.name} — ${item.label}, Size ${product.sizes[size]}`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: item.amount,
            product_data: {
              name: label,
              description: product.description,
            },
          },
        },
      ],
      // Free shipping within the continental United States.
      shipping_address_collection: { allowed_countries: ['US'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: 'Free shipping (continental US)',
            fixed_amount: { amount: 0, currency: 'usd' },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
      metadata: { productId, option, size, units: String(item.units) },
      success_url: `${PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${PUBLIC_URL}/product/${productId}`,
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err.message)
    res.status(500).json({ error: 'Could not start checkout. Please try again.' })
  }
})

// Look up a completed session so the success page can confirm the order.
app.get('/api/session/:id', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Payments not configured.' })
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id)
    res.json({
      status: session.payment_status,
      email: session.customer_details?.email || null,
      amount_total: session.amount_total,
    })
  } catch {
    res.status(404).json({ error: 'Order not found.' })
  }
})

// In production, serve the built frontend from this same server so one
// process (`npm run build && npm start`) is the whole deployment.
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '..', 'dist')
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  app.use(express.static(distDir))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found.' })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
  if (!stripe) {
    console.log('⚠️  STRIPE_SECRET_KEY not set — checkout runs in demo mode.')
  }
})
