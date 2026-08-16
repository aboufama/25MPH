import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PRODUCTS } from '../catalog.js'
import { asset } from '../asset.js'

export default function Catalog() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#catalog') {
      document.getElementById('catalog')?.scrollIntoView({ block: 'start' })
    }
  }, [location])

  return (
    <main>
      <section className="banner">
        <img src={asset('banner.jpeg')} alt="25MPH vests on the road" />
      </section>

      <section id="catalog">
        <h2 className="shop-title">Shop</h2>
        <div className="grid">
          {PRODUCTS.map((p) =>
            p.comingSoon ? (
              <div className="card soon" key={p.id}>
                <img src={p.card} alt={p.name} loading="lazy" />
                <span className="nm">{p.name}</span>
                <span className="pr">Coming soon</span>
              </div>
            ) : (
              <Link to={`/product/${p.id}`} className="card" key={p.id}>
                <img src={p.card} alt={p.name} loading="lazy" />
                <span className="nm">{p.name}</span>
                <span className="pr">{p.priceLabel}</span>
              </Link>
            ),
          )}
        </div>
      </section>
    </main>
  )
}
