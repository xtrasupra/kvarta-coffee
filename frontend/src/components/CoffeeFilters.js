import { useLayoutEffect, useRef, useState } from "react";

const filters = [
  { id: "all", label: "Весь кофе", shortLabel: "Весь кофе" },
  { id: "espresso", label: "Под эспрессо", shortLabel: "Эспрессо" },
  { id: "filter", label: "Для фильтра", shortLabel: "Фильтр" },
  { id: "drips", label: "Дрипы", shortLabel: "Дрипы" },
];

function CoffeeFilters({ value, onChange }) {
  const containerRef = useRef(null);

  const [hoveredValue, setHoveredValue] = useState(null);
  const [focusedValue, setFocusedValue] = useState(null);

  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
  });

  const previewValue = hoveredValue ?? focusedValue ?? value;

  useLayoutEffect(() => {
    const container = containerRef.current;
    let cancelled = false;

    function measureIndicator() {
      if (cancelled || !container) return;

      const button = container.querySelector(
        `[data-value="${previewValue}"]`
      );

      if (!button) return;

      const left = button.offsetLeft;
      const width = button.offsetWidth;

      setIndicator((previous) => {
        if (previous.left === left && previous.width === width) {
          return previous;
        }

        return { left, width };
      });
    }

    measureIndicator();

    const observer = new ResizeObserver(measureIndicator);
    observer.observe(container);

    document.fonts.ready.then(measureIndicator);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [previewValue]);

  return (
    <div
      className="catalog__filters"
      ref={containerRef}
      role="group"
      aria-label="Способ приготовления кофе"
      onMouseLeave={() => setHoveredValue(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusedValue(null);
        }
      }}
    >
      <span
        className="catalog__filter-indicator"
        aria-hidden="true"
        style={{
          width: indicator.width,
          opacity: indicator.width > 0 ? 1 : 0,
          transform: `translateX(${indicator.left}px)`,
        }}
      />

      {filters.map((filter) => (
        <button
          className="catalog__filter"
          key={filter.id}
          type="button"
          data-value={filter.id}
          data-preview={previewValue === filter.id}
          aria-pressed={value === filter.id}
          onMouseEnter={() => setHoveredValue(filter.id)}
          onFocus={() => setFocusedValue(filter.id)}
          onClick={() => onChange(filter.id)}
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
  );
}

export default CoffeeFilters;