import { useState } from "react";

import { products } from "../data/products";
import ProductCard from "./ProductCard";

const filters = [
  { id: "all", label: "Весь кофе", shortLabel: "Весь кофе" },
  { id: "espresso", label: "Под эспрессо", shortLabel: "Эспрессо" },
  { id: "filter", label: "Для фильтра", shortLabel: "Фильтр" },
  { id: "drips", label: "Дрипы", shortLabel: "Дрипы" },
];

function Catalog() {
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

      <div
        className="catalog__filters"
        role="group"
        aria-label="Способ приготовления кофе"
      >
        {filters.map((filter) => (
          <button
            className="catalog__filter"
            key={filter.id}
            type="button"
            aria-pressed={activeCategory === filter.id}
            onClick={() => setActiveCategory(filter.id)}
          >
            <span className="catalog__filter-desktop">
              {filter.label}
            </span>

            <span className="catalog__filter-mobile">
              {filter.shortLabel}
            </span>
          </button>
        ))}
      </div>

      <ul className="catalog__grid">
        {visibleProducts.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Catalog;