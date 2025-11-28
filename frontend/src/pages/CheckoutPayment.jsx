import React from 'react'
import Checkout from '../components/Checkout'

export default function CheckoutPayment() {
  // Placeholder: reuse Checkout component (payment step is inside)
  return (
    <div style={{ padding: '1.5rem' }}>
      <Checkout initialStep={2} />
    </div>
  )
}
