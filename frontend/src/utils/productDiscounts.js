// Función utilitaria para calcular descuentos de productos
// Esta función asigna descuentos de forma consistente en toda la plataforma

export const getProductDiscount = (product) => {
  // Solo los primeros 15 productos tienen descuento
  const discountPercentages = [15, 20, 25, 30, 20, 15, 10, 25, 20, 15, 30, 20, 15, 25, 20]
  
  // Si el producto está dentro de los 15 primeros, aplicar descuento
  if (product.id > 15) {
    return {
      discountPercentage: 0,
      originalPrice: product.price,
      discountedPrice: product.price,
      hasDiscount: false
    }
  }
  
  // Usar el ID del producto para determinar el descuento de forma consistente
  const discountPercentage = discountPercentages[product.id - 1]
  
  const originalPrice = product.price
  const discountedPrice = Math.round(product.price * (1 - discountPercentage / 100))
  
  return {
    discountPercentage,
    originalPrice,
    discountedPrice,
    hasDiscount: true
  }
}

// Función para aplicar descuento a un producto
export const applyDiscountToProduct = (product) => {
  const discount = getProductDiscount(product)
  return {
    ...product,
    ...discount
  }
}

// Función para aplicar descuentos a un array de productos
export const applyDiscountsToProducts = (products) => {
  return products.map(product => applyDiscountToProduct(product))
}

// Función para aplicar descuento adicional Premium (10% extra)
export const applyPremiumDiscount = (product, isPremium = false) => {
  const baseDiscount = applyDiscountToProduct(product)
  
  if (!isPremium) {
    return baseDiscount
  }
  
  // Aplicar 10% adicional sobre el precio ya descontado
  const premiumDiscountedPrice = Math.round(baseDiscount.discountedPrice * 0.9)
  const totalDiscountPercentage = Math.round((1 - premiumDiscountedPrice / baseDiscount.originalPrice) * 100)
  
  return {
    ...baseDiscount,
    discountedPrice: premiumDiscountedPrice,
    premiumDiscountApplied: true,
    premiumSavings: baseDiscount.discountedPrice - premiumDiscountedPrice,
    totalDiscountPercentage
  }
}
