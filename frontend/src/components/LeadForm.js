import { useEffect, useRef, useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";

import { sendLead } from "../api/leads";

const interests = [
  { value: "subscription", label: "Подписка" },
  { value: "order", label: "Разовый заказ" },
  { value: "question", label: "Вопрос" },
];

function parseBelarusPhone(value) {
  const phone = parsePhoneNumberFromString(value, {
    defaultCountry: "BY",
    extract: false,
  });

  if (phone?.country === "BY" && phone.isValid() && !phone.ext) {
    return phone;
  }

  return null;
}

const SUBSCRIPTION_TEMPLATE =
  "Хочу оформить подписку: 2 пачки по 250 г каждый месяц · " +
  "54 BYN/мес. Доставка бесплатно.";

function LeadForm({ orderRequest }) {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    interest: "subscription",
    comment: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const submitLock = useRef(false);

  const appliedRequestRef = useRef(null);

  const isSending = status === "sending";

useEffect(() => {
  if (
    !orderRequest ||
    isSending ||
    appliedRequestRef.current === orderRequest
  ) {
    return;
  }

  setValues((previous) => {
    if (orderRequest.type === "subscription") {
      return {
        ...previous,
        interest: "subscription",
        comment: SUBSCRIPTION_TEMPLATE,
      };
    }

    const product = orderRequest.product;

    const template =
      `Выбран кофе: ${product.country} ${product.name} · ` +
      `${product.badge} · ${product.price} BYN.`;

    let comment = previous.comment;

    // Убираем автоматический шаблон подписки,
    // если человек вернулся к разовому заказу.
    if (comment === SUBSCRIPTION_TEMPLATE) {
      comment = "";
    } else if (comment.startsWith(`${SUBSCRIPTION_TEMPLATE}\n`)) {
      comment = comment
        .slice(SUBSCRIPTION_TEMPLATE.length)
        .replace(/^\r?\n(?:\r?\n)?/, "");
    }

    const alreadyAdded = comment
      .split(/\r?\n/)
      .some((line) => line.trim() === template);

    return {
      ...previous,
      interest: "order",
      comment: alreadyAdded
        ? comment
        : [comment.trimEnd(), template]
            .filter(Boolean)
            .join("\n\n"),
    };
  });

  appliedRequestRef.current = orderRequest;

  setStatus("idle");
  setMessage("");

  setErrors((previous) => ({
    ...previous,
    comment: undefined,
  }));
}, [orderRequest, isSending]);

  const interestIndex = interests.findIndex(
    (interest) => interest.value === values.interest
  );

  function updateField(name, value) {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  }

  function formatPhone() {
    const phone = parseBelarusPhone(values.phone);

    if (phone) {
      setValues((previous) => ({
        ...previous,
        phone: phone.formatInternational(),
      }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitLock.current) return;

    const nextErrors = {};
    const phone = parseBelarusPhone(values.phone);

    if (values.comment.length > 1000) {
      nextErrors.comment =
        "Комментарий вместе с выбранным кофе превышает 1000 символов. Немного сократите его.";
    }

    if (!values.name.trim()) {
      nextErrors.name = "Укажите, как к вам обращаться.";
    }

    if (!phone) {
      nextErrors.phone =
        "Введите белорусский номер. Например: +375 29 123-45-67.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];

      document.getElementById(`lead-${firstField}`)?.focus();
      return;
    }

    submitLock.current = true;
    setStatus("sending");
    setMessage("");

    try {
      const result = await sendLead({
        name: values.name.trim(),
        phone: phone.number,
        interest: values.interest,
        comment: values.comment.trim(),
      });

      setMessage(
        result.duplicate
          ? "Заявка с этим номером уже у нас. Повторно отправлять её не нужно."
          : "Перезвоним, поможем выбрать кофе и уточним доставку."
      );

      setStatus("success");
    } catch (error) {
      setMessage(error.message);
      setStatus("error");
    } finally {
      submitLock.current = false;
    }
  }

  if (status === "success") {
    return (
      <div className="lead-form lead-form--success" role="status">
        <h3 className="lead-form__title">
          Спасибо,
          <br />
          заявка у нас.
        </h3>

        <p className="lead-form__success-text">
          {message}
        </p>
      </div>
    );
  }

  return (
    <form
      className="lead-form"
      aria-labelledby="lead-form-title"
      aria-busy={isSending}
      onSubmit={handleSubmit}
      noValidate
    >
      <h3 className="lead-form__title" id="lead-form-title">
        Какой кофе
        <br />
        вам хочется?
      </h3>

      <div className="lead-form__fields">
        <div className="lead-form__row">
          <div className="lead-form__field">
            <label
              className="lead-form__contact-label"
              htmlFor="lead-name"
            >
              Ваше имя
            </label>

            <input
              className="lead-form__input"
              id="lead-name"
              name="name"
              type="text"
              autoComplete="name"
              aria-label="Ваше имя"
              placeholder="Ваше имя"
              maxLength={80}
              value={values.name}
              onChange={(event) => {
                updateField("name", event.target.value);
              }}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? "lead-name-error" : undefined
              }
              disabled={isSending}
              required
            />

            {errors.name && (
              <p
                className="lead-form__error"
                id="lead-name-error"
                role="alert"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="lead-form__field">
            <label
              className="lead-form__contact-label"
              htmlFor="lead-phone"
            >
              Телефон
            </label>

            <input
              className="lead-form__input"
              id="lead-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-label="Телефон"
              placeholder="+375 (__) ___-__-__"
              maxLength={32}
              value={values.phone}
              onChange={(event) => {
                updateField("phone", event.target.value);
              }}
              onBlur={formatPhone}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={
                errors.phone
                  ? "lead-phone-help lead-phone-error"
                  : "lead-phone-help"
              }
              disabled={isSending}
              required
            />

            <p
              className="lead-form__phone-hint"
              id="lead-phone-help"
            >
              Белорусский номер. Например, +375 29 123-45-67.
            </p>

            {errors.phone && (
              <p
                className="lead-form__error"
                id="lead-phone-error"
                role="alert"
              >
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <fieldset
          className="lead-form__interest"
          disabled={isSending}
        >
          <legend>Что Вас интересует?</legend>

          <div
            className="lead-form__choices"
            style={{ "--choice-index": interestIndex }}
          >
            <span
              className="lead-form__choice-track"
              aria-hidden="true"
            />

            {interests.map((interest) => (
              <label
                className="lead-form__choice"
                key={interest.value}
              >
                <input
                  className="lead-form__radio"
                  type="radio"
                  name="interest"
                  value={interest.value}
                  checked={values.interest === interest.value}
                  onChange={(event) => {
                    updateField("interest", event.target.value);
                  }}
                />

                <span className="lead-form__choice-label">
                  {interest.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="lead-form__comment">
          <div className="lead-form__comment-heading">
            <label htmlFor="lead-comment">
              Комментарий
            </label>

            <span>Необязательно</span>
          </div>

          <textarea
            aria-invalid={Boolean(errors.comment)}
                aria-describedby={
                errors.comment ? "lead-comment-error" : undefined
            }
            className="lead-form__textarea"
            id="lead-comment"
            name="comment"
            placeholder="Какой кофе любите? Или просто оставьте вопрос."
            maxLength={1000}
            value={values.comment}
            onChange={(event) => {
              updateField("comment", event.target.value);
            }}
            disabled={isSending}
          />
          {errors.comment && (
            <p
                className="lead-form__error"
                id="lead-comment-error"
                role="alert"
            >
                {errors.comment}
            </p>
            )}
        </div>

        {status === "error" && (
          <p className="lead-form__error" role="alert">
            {message} Введённые данные сохранены в форме.
          </p>
        )}

        <button
          className="lead-form__submit"
          type="submit"
          disabled={isSending}
        >
          {isSending ? "Отправляем…" : "Оставить заявку"}
        </button>
      </div>

      <p className="lead-form__hint">
        Оставьте номер — мы перезвоним и всё оформим.
      </p>
    </form>
  );
}

export default LeadForm;
