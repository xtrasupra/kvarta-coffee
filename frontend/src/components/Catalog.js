import { useState } from "react";

import { products } from "../data/products";
import ProductCard from "./ProductCard";
import CoffeeFilters from "./CoffeeFilters";

function Catalog({ onSelectCoffee }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const visibleProducts =
    activeCategory === "all"
      ? products
      : products.filter(
          (product) => product.category === activeCategory
        );

  return (
    <section
      className="catalog"
      id="coffee"
      aria-labelledby="catalog-title"
    >
      <div className="catalog__heading">
        <h2 className="catalog__title" id="catalog-title">
          Найдём Ваш вкус.
        </h2>

        <p className="catalog__description">
          <span>Кофе для Ваших обычных</span>
          <span>и очень хороших дней.</span>
        </p>
      </div>

      <CoffeeFilters
        value={activeCategory}
        onChange={setActiveCategory}
      />

      <ul className="catalog__grid">
        {visibleProducts.map((product) => (
          <li key={product.id}>
            <ProductCard
            product={product}
            onSelectCoffee={onSelectCoffee}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Catalog;