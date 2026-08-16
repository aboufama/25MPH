import { Link } from 'react-router-dom'

export default function Cancel() {
  return (
    <div className="status">
      <h1>Checkout canceled</h1>
      <p>No charge was made.</p>
      <Link to="/">Back to shop</Link>
    </div>
  )
}
