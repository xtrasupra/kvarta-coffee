function ProductCard({ product, onSelectCoffee }) {
  return (
    <article className="product-card">
      <a
        className="product-card__link"
        href="#contacts"
        onClick={() => onSelectCoffee(product)}
        aria-label={`Выбрать ${product.country} ${product.name} и перейти к заявке`}
      >
        <div className="product-card__media">
          <img
            className="product-card__image"
            src={product.image}
            alt={`${product.country} ${product.name}, упаковка кофе`}
            loading="lazy"
            decoding="async"
          />

          <span className="product-card__badge">
            {product.badge}
          </span>
        </div>

        <div className="product-card__body">
          <h3 className="product-card__title">
            <span>{product.country}</span>
            <span>{product.name}</span>
          </h3>

          <div className="product-card__notes">
            <span>{product.notes}</span>
            <span>{product.details}</span>
          </div>

          <p className="product-card__price">
            {product.price} BYN
          </p>
        </div>
      </a>
    </article>
  );
}

export default ProductCard;