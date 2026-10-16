const API_BASE_URL = (
  process.env.REACT_APP_API_URL || ""
).replace(/\/+$/, "");

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

      body: JSON.stringify(lead),
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