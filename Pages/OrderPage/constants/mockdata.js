// Mock data 
export const orderData = {
  id: 605,
  title: "40тонна селитра",
  description:
    "Талдыкорған до Косагаш (Жансугуров)\nГруз 40 Т селитра апаруға\n2 машина керек",
  author: {
    id: 28124,
    name: "Қапез Ерсін",
    avatar: "https://dev.gservice-co.kz/api-assets/no_avatar.png",
    is_company: true,
    orders_count: 23,
  },
  category: {
    id: 8,
    title: "Арендовать спецтехнику",
  },
  city: {
    id: 258,
    title: "Талдыкорган",
  },
  prices: [
  {
    id: 8729,
    type: "price",
    price: 100000,
    original_price: 0,
    currency: "rub"
  }],
  transport_type: {
    id: 151,
    title: "Бортовые грузовики",
  },
  phone: "200059890",
  images: [
    {
      id: 34037,
      url: "https://dev.gservice-co.kz/storage/application-images/05-06-2025/01JWY5WHKE22KC9AVV3MEGY2ZC.webp",
    },
  ],
  statistics: {
    viewed: 10,
  },
  created_at: "2025-06-04T19:15:18.000000Z",
  status: "confirmed",
};

export const relatedOrders = [
  {
    id: 1,
    title: "Бортовые грузовики IVECO",
    location: "г. Алматы",
    price: "Договорная",
    image: "https://via.placeholder.com/60x45",
  },
  {
    id: 2,
    title: "Бортовые грузовики ГАЗ",
    location: "г. Астана",
    price: "Договорная",
    image: "https://via.placeholder.com/60x45",
  },
  {
    id: 3,
    title: "Бортовые грузовики ГАЗ",
    location: "г. Усть-Каменогорск",
    price: "Договорная",
    image: "https://via.placeholder.com/60x45",
  },
  {
    id: 4,
    title: "Бортовые грузовики УРАЛ",
    location: "г. Актау",
    price: "Договорная",
    image: "https://via.placeholder.com/60x45",
  },
  {
    id: 5,
    title: "Бортовые грузовики ГАЗ",
    location: "г. Караганда",
    price: "Договорная",
    image: "https://via.placeholder.com/60x45",
  },
  {
    id: 6,
    title: "Бортовые грузовики КАМАЗ",
    location: "г. Астана",
    price: "Договорная",
    image: "https://via.placeholder.com/60x45",
  },
  {
    id: 7,
    title: "Бортовые грузовики MERCEDES",
    location: "г. Астана",
    price: "Договорная",
    image: "https://via.placeholder.com/60x45",
  },
];
