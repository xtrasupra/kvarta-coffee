import { act, fireEvent, render, screen } from "@testing-library/react";
import { sendLead } from "../api/leads";
import LeadForm from "./LeadForm";

jest.mock("../api/leads", () => ({ sendLead: jest.fn() }));

beforeEach(() => {
  sendLead.mockReset();
});

function fillContacts() {
  fireEvent.change(screen.getByLabelText("Ваше имя"), {
    target: { value: "Проверка формы" },
  });
  fireEvent.change(screen.getByLabelText("Телефон"), {
    target: { value: "+375291234567" },
  });
}

test("добавление кофе к длинному комментарию показывает ошибку без отправки", () => {
  const { container, rerender } = render(<LeadForm />);
  fillContacts();
  fireEvent.change(screen.getByLabelText("Комментарий"), {
    target: { value: "а".repeat(1000) },
  });

  rerender(
    <LeadForm
      orderRequest={{
        type: "coffee",
        product: {
          country: "Эфиопия",
          name: "Иргачеффе",
          badge: "250 г",
          price: 32,
        },
      }}
    />
  );
  fireEvent.submit(container.querySelector("form"));

  expect(screen.getByRole("alert").textContent).toMatch(/1000 символов/);
  expect(sendLead).not.toHaveBeenCalled();
});

test("двойная отправка вызывает API один раз и показывает успех после ответа", async () => {
  let resolveRequest;
  sendLead.mockImplementation(
    () => new Promise((resolve) => { resolveRequest = resolve; })
  );
  const { container } = render(<LeadForm />);
  fillContacts();
  const form = container.querySelector("form");
  fireEvent.submit(form);
  fireEvent.submit(form);

  expect(sendLead).toHaveBeenCalledTimes(1);
  expect(sendLead).toHaveBeenCalledWith({
    name: "Проверка формы",
    phone: "+375291234567",
    interest: "subscription",
    comment: "",
  });

  await act(async () => {
    resolveRequest({ ok: true, duplicate: false });
  });
  expect(screen.getByRole("heading", { name: /заявка у нас/ })).toBeTruthy();
});
