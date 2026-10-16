const API_BASE_URL = (
  process.env.REACT_APP_API_URL || ""
).replace(/\/+$/, "");

const SOURCE_KEY = "kvarta:source:v1";

const TAGS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "gclid",
  "yclid",
  "fbclid",
  "ad_id",
];

function captureSource() {
  const params = new URLSearchParams(window.location.search);

  const source = {
    landing_url: window.location.href.slice(0, 2048),
    referrer: document.referrer.slice(0, 2048),

    tags: Object.fromEntries(
      TAGS
        .map((key) => [key, params.get(key)])
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => [key, value.slice(0, 200)])
    ),
  };

  try {
    const saved = JSON.parse(
      sessionStorage.getItem(SOURCE_KEY) || "null"
    );

    if (
      saved &&
      typeof saved.landing_url === "string" &&
      typeof saved.referrer === "string" &&
      saved.tags &&
      typeof saved.tags === "object"
    ) {
      return saved;
    }

    sessionStorage.setItem(SOURCE_KEY, JSON.stringify(source));
  } catch {
    // При недоступном sessionStorage сохраняем источник
    // в памяти текущей страницы.
  }

  return source;
}

const firstSource = captureSource();

export async function sendLead(lead) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 20000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/lead`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        ...lead,

        source: {
          ...firstSource,
          page_url: window.location.href.slice(0, 2048),
        },
      }),

      signal: controller.signal,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || result?.ok !== true) {
      throw new Error(
        result?.message ||
          "Не удалось отправить заявку. Попробуйте ещё раз."
      );
    }

    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "Сервер долго не отвечает. Попробуйте отправить ещё раз."
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Не удалось связаться с сервером. Проверьте интернет и попробуйте ещё раз."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}