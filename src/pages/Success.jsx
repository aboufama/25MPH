import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export default function Success() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (!sessionId) return
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/session/${sessionId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setOrder)
      .catch(() => {})
  }, [sessionId])

  return (
    <div className="status">
      <h1>Order confirmed</h1>
      <p>
        Your vest ships free.
        {order?.email ? ` Receipt sent to ${order.email}.` : ''}
      </p>
      <Link to="/">Back to shop</Link>
    </div>
  )
}
