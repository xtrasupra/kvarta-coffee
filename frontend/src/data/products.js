import ethiopia from "../assets/ethiopia.png";
import colombia from "../assets/colombia.png";
import brazil from "../assets/brazil.png";
import drips from "../assets/drips.png";

export const products = [
  {
    id: "ethiopia",
    country: "Эфиопия",
    name: "Иргачеффе",
    notes: "Цветочный, бергамот",
    details: "Светлая обжарка · 250 г",
    badge: "250 г",
    price: 32,
    category: "filter",
    image: ethiopia,
  },
  {
    id: "colombia",
    country: "Колумбия",
    name: "Уила",
    notes: "Карамель, красное яблоко",
    details: "Зерно · 250 г",
    badge: "250 г",
    price: 29,
    category: "filter",
    image: colombia,
    tone: "dark",
  },
  {
    id: "brazil",
    country: "Бразилия",
    name: "Серрадо",
    notes: "Орех, шоколад",
    details: "Под эспрессо · 250 г",
    badge: "250 г",
    price: 26,
    category: "espresso",
    image: brazil,
  },
  {
    id: "drips",
    country: "Дрипы",
    name: "Ассорти",
    notes: "Ваш кофе — где угодно",
    details: "10 дрип-пакетов",
    badge: "10 шт",
    price: 18,
    category: "drips",
    image: drips,
  },
];