import LeadForm from "./LeadForm";

function Contacts() {
  return (
    <section
      className="contacts"
      id="contacts"
      aria-labelledby="contacts-title"
    >
      <div className="contacts__copy">
        <div className="contacts__intro">
          <p className="contacts__eyebrow">
            Давайте знакомиться
          </p>

          <h2 className="contacts__title" id="contacts-title">
            <span>Ваша</span>
            <span>следующая</span>
            <span>чашка — ближе.</span>
          </h2>
        </div>

        <div className="contacts__info">
          <div className="contacts__item">
            <h3>Доставка по Минску</h3>

            <p>
              В пятницу. От 50 BYN — бесплатно.
              <br />
              Стоимость остальных заказов уточним по телефону.
            </p>
          </div>

          <div className="contacts__item">
            <h3>Самовывоз из мастерской</h3>

            <address>
              Минск, ул. Короля, 9
              <br />
              Пн–пт 8:00–20:00
              <span className="contacts__hours-divider"> · </span>
              <br className="contacts__mobile-break" />
              Сб–вс 10:00–18:00
            </address>
          </div>

          <p className="contacts__note">
            Оставьте номер — мы перезвоним.
            <br />
            Можно заказать кофе, подписку или просто задать вопрос.
          </p>
        </div>
      </div>

      <LeadForm />
    </section>
  );
}

export default Contacts;