import photo from "../assets/subscription.png";
import bean from "../assets/hero-arrow.svg";
import cup from "../assets/header-arrow.svg";

function Subscription({ onSelectSubscription }) {
  return (
    <section
      className="subscription"
      id="subscription"
      aria-labelledby="subscription-title"
    >
      <div className="subscription__content">
        <p className="subscription__eyebrow">
          Кофейная <strong>подписка</strong>
        </p>

        <h2
          className="subscription__title"
          id="subscription-title"
        >
          <span>Пусть кофе</span>{" "}
          <span>
            не{" "}
            <br className="subscription__mobile-break" />
            заканчивается.
          </span>
        </h2>

        <p className="subscription__description">
          <span>Две пачки по 250 г каждый месяц.</span>{" "}
          <span>
            Доставка бесплатно. Ваш ритуал — без лишних забот.
          </span>
        </p>

        <div className="subscription__offer">
          <p className="subscription__price">
            <span>54 BYN</span>
            <span className="subscription__period">/ месяц</span>
          </p>

          <a
  className="subscription__link"
  href="#contacts"
  onClick={onSelectSubscription}
>
            <span className="subscription__label">
              Хочу подписку
            </span>

            <span className="hero__icon" aria-hidden="true">
              <span className="hero__icon-layer hero__icon-bean">
                <img src={bean} alt="" />
              </span>

              <span className="hero__icon-layer hero__icon-cup">
                <img src={cup} alt="" />
              </span>
            </span>
          </a>
        </div>
      </div>

      <img
        className="subscription__image"
        src={photo}
        alt="Две упаковки кофе Кварта"
        loading="lazy"
        decoding="async"
      />
    </section>
  );
}

export default Subscription;