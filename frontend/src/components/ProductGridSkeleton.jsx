import './ProductGridSkeleton.css'

function ProductGridSkeleton({ count = 8, variant = 'default' }) {
  const items = Array.from({ length: count })
  const gridClassName = variant === 'category'
    ? 'products-grid-category product-skeleton-grid'
    : 'products-grid product-skeleton-grid'

  return (
    <div className={gridClassName} aria-label="Cargando productos">
      {items.map((_, index) => (
        <article key={index} className={`product-skeleton-card product-skeleton-card--${variant}`}>
          <div className="product-skeleton-media product-skeleton-shimmer" />
          <div className="product-skeleton-body">
            <div className="product-skeleton-line product-skeleton-line--eyebrow product-skeleton-shimmer" />
            <div className="product-skeleton-line product-skeleton-line--title product-skeleton-shimmer" />
            <div className="product-skeleton-line product-skeleton-line--title-short product-skeleton-shimmer" />
            <div className="product-skeleton-line product-skeleton-line--text product-skeleton-shimmer" />
            <div className="product-skeleton-footer">
              <div className="product-skeleton-line product-skeleton-line--price product-skeleton-shimmer" />
              <div className="product-skeleton-line product-skeleton-line--stock product-skeleton-shimmer" />
            </div>
          </div>
          <div className="product-skeleton-button product-skeleton-shimmer" />
        </article>
      ))}
    </div>
  )
}

export default ProductGridSkeleton
