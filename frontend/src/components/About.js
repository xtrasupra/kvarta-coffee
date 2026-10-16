const schedule = [
  {
    day: "Четверг",
    title: "Обжариваем",
    description: "Всего по 5 кг небольшими партиями.",
  },
  {
    day: "Пятница",
    title: "Привозим",
    description: "Развозим свежий кофе по Минску.",
  },
  {
    day: "Каждый день",
    title: "Ваша чашка",
    description: "Вы готовите кофе так, как любите.",
  },
];

function About() {
  return (
    <section
      className="about"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="about__intro">
        <p className="about__eyebrow">
          Люди, которые любят кофе
        </p>

        <h2 className="about__title" id="about-title">
          <span>Мы — Аня и</span>{" "}
          <span>Дмитрий.</span>
        </h2>

        <p className="about__description">
          Раньше мы работали бариста. Теперь обжариваем кофе
          в своей маленькой мастерской на Короля, 9.
          С 2019 года делаем простую вещь: помогаем вам пить
          дома такой кофе, какой любим сами.
        </p>
      </div>

      <ol className="about__schedule">
        {schedule.map((item) => (
          <li className="about__step" key={item.day}>
            <p className="about__day">{item.day}</p>

            <div className="about__step-content">
              <h3 className="about__step-title">
                {item.title}
              </h3>

              <p className="about__step-description">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="about__caption">
        Маленькая мастерская. Свой ритм.
      </p>
    </section>
  );
}

export default About;