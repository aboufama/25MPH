// Public-asset URL helper. Vite serves the app at a base path on GitHub
// Pages (/<repo>/), so absolute "/foo.png" paths would 404 there.
export function asset(p) {
  return import.meta.env.BASE_URL + p.replace(/^\//, '')
}
