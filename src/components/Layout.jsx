import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { asset } from '../asset.js'

export default function Layout() {
  const { pathname, hash } = useLocation()

  // Start each page at the top; hash links (e.g. /#catalog) scroll themselves.
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return (
    <>
      <header className="hd">
        <Link to="/" className="brand">
          <img src={asset('logo.png')} alt="25MPH" />
        </Link>
        <nav>
          <Link to="/#catalog">Shop</Link>
          <a href="mailto:25mphvest@gmail.com">Contact</a>
        </nav>
      </header>

      <Outlet />

      <footer className="ft">
        <a href="mailto:25mphvest@gmail.com">25mphvest@gmail.com</a>
        <span>62 Calef Highway #240 Lee NH USA</span>
        <span>25mphvest.com — KJCreatives LLC</span>
      </footer>
    </>
  )
}
