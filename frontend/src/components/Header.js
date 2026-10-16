import { useLayoutEffect, useRef, useState } from "react";

import mark from "../assets/kvarta-mark.svg";
import arrow from "../assets/header-arrow.svg";

const navigation = [
  { label: "Кофе", href: "#coffee" },
  { label: "Подписка", href: "#subscription" },
  { label: "О нас", href: "#about" },
  { label: "Доставка", href: "#contacts" },
];

function moveMarker(nav, link) {
  if (!nav || !link) return;

  const navBox = nav.getBoundingClientRect();
  const linkBox = link.getBoundingClientRect();

  const position =
    linkBox.left - navBox.left + linkBox.width / 2 - 5;

  nav.style.setProperty("--marker-x", `${position}px`);
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef = useRef(null);
  const activeIndexRef = useRef(0);

  useLayoutEffect(() => {
    const nav = navRef.current;
    let cancelled = false;

    function updateMarker() {
      if (cancelled || !nav) return;

      const links = nav.querySelectorAll("a");

      moveMarker(nav, links[activeIndexRef.current]);
    }

    updateMarker();

    const observer = new ResizeObserver(updateMarker);
    observer.observe(nav);

    document.fonts.ready.then(updateMarker);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  function resetMarker() {
    const nav = navRef.current;
    if (!nav) return;

    const focusedLink = nav.querySelector("a:focus");
    const activeLink =
      nav.querySelectorAll("a")[activeIndexRef.current];

    moveMarker(nav, focusedLink || activeLink);
  }

  return (
    <header className="header">
      <div className="header__row">
        <a
          className="header__brand"
          href="#top"
          onClick={() => setMenuOpen(false)}
        >
          <span className="header__signature">
            <img src={mark} alt="" />
            <span className="header__name">kvarta.</span>
          </span>

          <span className="header__description">
            <span>Обжарочная</span>
            <span>Мастерская Минск</span>
          </span>
        </a>

        <nav
          ref={navRef}
          className={`header__nav${menuOpen ? " is-open" : ""}`}
          id="site-navigation"
          aria-label="Основная навигация"
          onMouseLeave={resetMarker}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              resetMarker();
            }
          }}
        >
          {navigation.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onMouseEnter={(event) => {
                moveMarker(navRef.current, event.currentTarget);
              }}
              onFocus={(event) => {
                moveMarker(navRef.current, event.currentTarget);
              }}
              onClick={() => {
                activeIndexRef.current = index;
                setMenuOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}

          <span className="header__marker" aria-hidden="true" />
        </nav>

        <a className="header__order" href="#contacts">
          <span>Хочу кофе</span>
          <img src={arrow} alt="" />
        </a>

        <button
          className="header__toggle"
          type="button"
          aria-controls="site-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export default Header;