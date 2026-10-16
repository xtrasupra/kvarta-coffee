import mark from "../assets/kvarta-mark.svg";

function Footer() {
  return (
    <footer className="footer">
      <a className="header__brand" href="#top">
        <span className="header__signature">
          <img src={mark} alt="" />
          <span className="header__name">kvarta.</span>
        </span>

        <span className="header__description">
          <span>Обжарочная</span>
          <span>Мастерская Минск</span>
        </span>
      </a>

      <p className="footer__caption">
        Обжарено в Минске. С любовью к Вашей чашке.
      </p>
    </footer>
  );
}

export default Footer;