import photo from "../assets/hero.png";
import arrow from "../assets/hero-arrow.svg";
import cup from "../assets/header-arrow.svg";

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero__image" src={photo} alt="" />

      <div className="hero__content">
        <p className="hero__eyebrow">
          Свежая обжарка. Маленькие партии.
        </p>

        <h1 className="hero__title" id="hero-title">
          <span>Кофе ещё</span>{" "}
          <span>помнит обжарку</span>
        </h1>

        <p className="hero__question">
          А Вы уже выбрали любимую чашку?
        </p>

        <p className="hero__description">
          <span>Обжариваем по 5 кг. Привозим зерно</span>{" "}
          <span>на 1–3 день после обжарки домой или в офис.</span>
        </p>

        <a className="hero__link" href="#coffee">
          <span className="hero__label">
            Выбрать свой кофе
          </span>

          <span className="hero__icon" aria-hidden="true">
            <span className="hero__icon-layer hero__icon-bean">
              <img src={arrow} alt="" />
            </span>

            <span className="hero__icon-layer hero__icon-cup">
              <img src={cup} alt="" />
            </span>
          </span>
        </a>
      </div>

      <p className="hero__caption">
        С 2019 года · Аня и Дмитрий · Минск
      </p>
    </section>
  );
}

export default Hero;