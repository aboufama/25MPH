# 25MPH Vest — React storefront

A React rebuild of [25mphvest.com](https://www.25mphvest.com/) using the original
photos, with a working **Stripe Checkout** payment flow.

- **Frontend:** Vite + React + React Router
- **Backend:** Express server that creates Stripe Checkout Sessions
- **Payment:** Stripe Checkout (hosted, PCI-compliant) with free US shipping

## Getting started

```bash
npm install
```

### 1. Add your Stripe keys (to accept real payments)

```bash
cp .env.example .env
```

Then open `.env` and paste your **Stripe secret key** from
<https://dashboard.stripe.com/apikeys> (start with the `sk_test_...` key):

```
STRIPE_SECRET_KEY=sk_test_...
```

> Without a key the site still runs — the storefront works, but pressing
> **Checkout** shows a "payments not configured" message instead of charging.

### 2. Run it

```bash
npm run dev
```

This starts both processes:

| Process | URL                     | Purpose                     |
| ------- | ----------------------- | --------------------------- |
| web     | http://localhost:5173   | React frontend (Vite)       |
| api     | http://localhost:4242   | Express + Stripe backend    |

Open **http://localhost:5173**.

## How checkout works

1. On the **Buy** section the shopper picks a size (S/M/L) and quantity
   (1 vest = $19.99, 2 vests = $38.99).
2. **Checkout** POSTs to `/api/checkout`, which creates a Stripe Checkout
   Session and returns its URL.
3. The browser redirects to Stripe's hosted, secure payment page.
4. Stripe redirects back to `/success` (paid) or `/cancel`.

Test with Stripe's card `4242 4242 4242 4242`, any future expiry, any CVC.

## Build for production

```bash
npm run build      # outputs static site to dist/
npm start          # runs the Express/Stripe API (serve dist/ with any host)
```

Set `PUBLIC_URL` in `.env` to your deployed domain so Stripe redirects work.

## Project structure

```
public/            original photos (singlevest, pic1, pic2, 3sizes)
src/
  components/      Navbar, Hero, Features, Buy, Gallery, Sizes, Contact, Footer
  pages/           Success, Cancel (Stripe redirect targets)
  App.jsx, main.jsx, index.css
server/index.js    Express + Stripe Checkout backend
```

All copy and imagery are from the original 25mphvest.com site.
Site by KJCreatives LLC.
