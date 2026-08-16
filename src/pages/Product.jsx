import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../catalog.js'
import NotFound from './NotFound.jsx'

export default function Product() {
  const { id } = useParams()
  const found = getProduct(id)
  // Coming-soon products have no buy page yet.
  const product = found && !found.comingSoon ? found : null

  const [img, setImg] = useState(0)
  const [size, setSize] = useState(product?.sizes[1]?.id ?? product?.sizes[0]?.id)
  const [option, setOption] = useState(product?.options[0]?.id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) document.title = `${product.name} — 25MPH`
    return () => {
      document.title = '25MPH'
    }
  }, [product])

  if (!product) return <NotFound />

  async function checkout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, option, size }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Checkout failed.')
      window.location.href = data.url
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const price = product.options.find((o) => o.id === option).priceLabel

  return (
    <main className="pp">
      <nav className="crumb" aria-label="Breadcrumb">
        <Link to="/">Shop</Link>
        <span aria-hidden="true"> / </span>
        <span>{product.name}</span>
      </nav>

      <div className="pp-grid">
        <div className="pp-media">
          <img
            className="pp-main"
            src={product.gallery[img]}
            alt={product.name}
          />
          {product.gallery.length > 1 && (
            <div className="thumbs" role="group" aria-label="Product photos">
              {product.gallery.map((src, i) => (
                <button
                  key={src}
                  aria-pressed={i === img}
                  onClick={() => setImg(i)}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h1>{product.name}</h1>
          <p className="price">{price}</p>
          <p className="blurb">{product.blurb}</p>

          <p className="lbl">Size</p>
          <div className="row" role="group" aria-label="Size">
            {product.sizes.map((s) => (
              <button
                key={s.id}
                aria-pressed={size === s.id}
                onClick={() => setSize(s.id)}
              >
                {s.label}
                <small>{s.note}</small>
              </button>
            ))}
          </div>

          <p className="lbl">Quantity</p>
          <div className="row" role="group" aria-label="Quantity">
            {product.options.map((o) => (
              <button
                key={o.id}
                aria-pressed={option === o.id}
                onClick={() => setOption(o.id)}
              >
                {o.label}
                <small>{o.priceLabel}</small>
              </button>
            ))}
          </div>

          <button className="checkout" onClick={checkout} disabled={loading}>
            {loading ? 'Redirecting' : 'Checkout'}
          </button>

          {error && <p className="error" role="alert">{error}</p>}

          <ul className="specs">
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
