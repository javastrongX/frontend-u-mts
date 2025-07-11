// mockData - Barcha mock ma'lumotlar

export const balanceData = {
  currentBalance: 125540,
  currentBonus: 0,
  currency: 'uzs',
  monthlyIncome: 45200,
  totalTransactions: 187,
  averageTime: '2.3 дня'
};

export const transactions = [
  { 
    id: 1,
    type: 'income', 
    amount: '+5,500 som', 
    desc: 'Оплата за веб-дизайн', 
    date: '15 июня' 
  },
  { 
    id: 2,
    type: 'income', 
    amount: '+3,200 som', 
    desc: 'Консультация по SEO', 
    date: '14 июня' 
  },
  { 
    id: 3,
    type: 'expense', 
    amount: '-500 som', 
    desc: 'Комиссия платформы', 
    date: '13 июня' 
  },
];

export const orders = [
  { 
    id: 1,
    title: 'Разработка лендинга для стоматологии', 
    status: 'active', 
    price: '45,000 som', 
    deadline: '20 июня',
    client: 'ТОО "Дент Клиник"'
  },
  { 
    id: 2,
    title: 'SEO оптимизация интернет-магазина', 
    status: 'completed', 
    price: '25,000 som', 
    deadline: '15 июня',
    client: 'Магазин "Техника+"'
  },
  { 
    id: 3,
    title: 'Дизайн мобильного приложения', 
    status: 'review', 
    price: '60,000 som', 
    deadline: '25 июня',
    client: 'Startup "FoodDelivery"'
  },
];

export const ads = [
  { 
    id: 1,
    title: 'Веб-дизайн и разработка', 
    category: 'IT услуги',
    price: 'от 15,000 som',
    views: 234,
    active: true,
    image: '/Images/d-image.png'
  },
  { 
    id: 2,
    title: 'SEO продвижение сайтов', 
    category: 'Маркетинг',
    price: 'от 25,000 som',
    views: 187,
    active: true,
    image: '/Images/d-image.png'
  },
  { 
    id: 3,
    title: 'Консультации по бизнесу', 
    category: 'Консалтинг',
    price: 'от 5,000 som',
    views: 98,
    active: false,
    image: '/Images/d-image.png'
  },
];

export const supportContacts = {
  phone: {
    number: '+7 (777) 777-77-77',
    workTime: 'Ежедневно 9:00 - 21:00'
  },
  email: {
    address: 'support@tservice.uz',
    responseTime: 'Ответ в течение 24 часов'
  }
};

export const faqData = [
  { 
    id: 1,
    question: 'Как изменить тариф?', 
    answer: 'Перейдите в настройки аккаунта и выберите подходящий тариф.' 
  },
  { 
    id: 2,
    question: 'Как вернуть деньги?', 
    answer: 'Обратитесь в службу поддержки с указанием номера транзакции.' 
  },
  { 
    id: 3,
    question: 'Как повысить рейтинг?', 
    answer: 'Качественно выполняйте заказы и получайте положительные отзывы.' 
  },
];

export const aboutFeatures = [
  { 
    id: 1,
    icon: 'FiZap', 
    title: 'Быстрый поиск', 
    desc: 'Найдите специалиста за несколько минут' 
  },
  { 
    id: 2,
    icon: 'FiAward', 
    title: 'Проверенные специалисты', 
    desc: 'Все исполнители проходят верификацию' 
  },
  { 
    id: 3,
    icon: 'FiCreditCard', 
    title: 'Безопасные сделки', 
    desc: 'Защищенные платежи через эскроу' 
  },
  { 
    id: 4,
    icon: 'FiHelpCircle', 
    title: 'Поддержка 24/7', 
    desc: 'Круглосуточная помощь пользователям' 
  },
];

export const statistics = {
  specialists: '15K+',
  orders: '50K+',
  satisfaction: '98%',
  rating: '4.8'
};

export const orderStatuses = {
  active: 'В работе',
  completed: 'Завершен',
  review: 'На проверке',
  cancelled: 'Отменен'
};

export const filterOptions = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'completed', label: 'Завершенные' },
  { value: 'cancelled', label: 'Отмененные' },
];

// Status color mapping
export const statusColors = {
  active: 'blue',
  completed: 'green',
  review: 'orange',
  cancelled: 'red'
};

// Transaction type mapping
export const transactionTypes = {
  income: 'green',
  expense: 'red'
};