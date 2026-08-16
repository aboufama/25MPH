import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="status">
      <h1>Page not found</h1>
      <p>This page does not exist.</p>
      <Link to="/">Back to shop</Link>
    </div>
  )
}
