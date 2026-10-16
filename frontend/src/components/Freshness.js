const facts = [
  {
    value: "5 кг",
    lines: [
      "В одной партии.",
      "Уделяем внимание каждому зерну.",
    ],
  },
  {
    value: "1–3 дня",
    lines: [
      "От обжарки до Вас.",
      "Аромат не успевает потеряться.",
    ],
  },
  {
    value: "С 2019",
    lines: [
      "Обжариваем",
      "в Минске.",
    ],
  },
];

function Freshness() {
  return (
    <section className="freshness" aria-label="О свежести нашего кофе">
      <dl className="freshness__list">
        {facts.map((fact) => (
          <div className="freshness__item" key={fact.value}>
            <dt className="freshness__value">
              {fact.value}
            </dt>

            <dd className="freshness__description">
              {fact.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default Freshness;