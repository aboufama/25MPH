import { asset } from './asset.js'

// Display catalog for the storefront. The server (server/index.js) holds the
// authoritative prices — everything here is presentation only. To add a
// product, add an entry here and a matching entry in the server's PRODUCTS.
export const PRODUCTS = [
  {
    id: 'vest',
    name: '25MPH Vest',
    priceLabel: '$19.99',
    card: asset('mph.png'),
    gallery: [
      asset('mph.png'),
      asset('pic2.jpg'),
      asset('pic1.jpg'),
      asset('sizing-chart.jpeg'),
    ],
    blurb: 'Neon green safety vest. Silkscreen printed front and back.',
    details: [
      'Lightweight',
      'Printed front and back',
      'Free shipping — continental US',
    ],
    sizes: [
      { id: 'S', label: 'S', note: 'Kids' },
      { id: 'M', label: 'M', note: 'Teen' },
      { id: 'L', label: 'L', note: 'Adult' },
    ],
    options: [
      { id: 'single', label: '1', priceLabel: '$19.99' },
      { id: 'double', label: '2', priceLabel: '$38.99' },
    ],
  },
  {
    id: 'hat',
    name: '25MPH Hat',
    card: asset('hat.png'),
    comingSoon: true,
  },
]

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null
}
