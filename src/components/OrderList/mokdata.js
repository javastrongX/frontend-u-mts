
export const mockData = {
  data: [
    {
      id: 12452,
      author: {
        id: 28079,
        name: "Юра юркевичич",
        avatar: "https://dev.gservice-co.kz/api-assets/no_avatar.png",
        is_company: false,
        is_official: false
      },
      is_premium: true,
      category: {
        id: 2,
        title: "Аренда спецтехники",
        icon: "https://dev.gservice-co.kz/api-assets/category_icon/rent.svg"
      },
      title: "Нужен водитель на вахту на автокран Урал 3 х мостовый",
      sub_title: "u hdweugfwefgygwefuywgu",
      city: {
        id: 8,
        title: "Батькен",
        is_popular: true
      },
      prices: [
        {
          id: 8729,
          type: "negotiable",
          price: 0,
          original_price: 0,
          currency: {
            id: 1,
            title: "KZT",
            in_tenge: 1,
            symbol: "₸"
          }
        }
      ],
      images: [],
      slug: "12452-ekskavatory-pogruzciki",
      phones: ["+7 707"],
      description: "Договорная",
      statistics: {
        viewed: 4,
        write: 0,
        called: 0,
        favorite: 0,
        share: 0,
        clicked: 2
      },
      created_at: "2025-05-31T01:50:00.000000Z"
    },
    {
      id: 12453,
      author: {
        id: 28080,
        name: "Алымбек",
        avatar: "https://dev.gservice-co.kz/api-assets/no_avatar.png",
        is_company: true,
        is_official: true
      },
      title: "Кыран",
      sub_title: "XCMG QY25K-I",
      city: {
        id: 9,
        title: "Шымкент",
        is_popular: true
      },
      prices: [
        {
          id: 8730,
          type: "negotiable",
          price: 0
        }
      ],
      phones: ["+7 771"],
      statistics: {
        viewed: 5
      },
      created_at: "2025-05-30T08:18:00.000000Z"
    },
    {
      id: 12454,
      author: {
        id: 28081,
        name: "Канат",
        is_company: true,
        is_official: true
      },
      title: "Фронтальной погрузчик",
      sub_title: "XCMG LW300FN",
      city: {
        id: 10,
        title: "Алматы"
      },
      phones: ["+7 701"],
      statistics: {
        viewed: 7
      },
      created_at: "2025-05-30T03:55:00.000000Z"
    },
    {
      id: 12455,
      author: {
        name: "Санзу",
        is_company: false
      },
      title: "вахта",
      city: {
        title: "Кызылорда"
      },
      phones: ["+7 707"],
      statistics: {
        viewed: 26
      },
      created_at: "2025-05-28T10:22:00.000000Z"
    },
    {
      id: 12456,
      author: {
        name: "Бауыржан",
        is_company: true
      },
      title: "Нужен Бульдозеры",
      sub_title: "Разравнивание грунта. Уборка снега. Планировка площадок. Рытье канав. Расчистка территорий. Снос построек. Засыпка ям.",
      city: {
        title: "Ангол"
      },
      phones: ["+7 778"],
      statistics: {
        viewed: 30
      },
      created_at: "2025-05-26T17:07:00.000000Z"
    },
    {
      id: 12457,
      author: {
        name: "Эльдос",
        is_company: true,
        is_official: true
      },
      title: "Куплю Колесные экскаваторы",
      sub_title: "Jingong JGM 756K",
      city: {
        title: "Астана"
      },
      phones: ["+7 775"],
      statistics: {
        viewed: 25
      },
      created_at: "2025-05-24T21:06:00.000000Z"
    },
    {
      id: 12458,
      author: {
        name: "Test User",
        is_company: false
      },
      title: "Куплю Мини-экскаваторы",
      city: {
        title: "Алматы"
      },
      phones: ["+7 775"],
      statistics: {
        viewed: 12
      },
      created_at: "2025-05-24T15:30:00.000000Z"
    }
  ]
};


export const tabLabels = [
  "Все",
  "Покупка спецтехники", 
  "Арендовать спецтехнику",
  "Покупка запчастей",
  "Нужен ремонт техники",
  "Ищу водителя",
];

export const filtersData = {
  "Все": {
    cities: {
      visible: ["Алматы", "Астана", "Шымкент", "Актау", "Актобе", "Кызылорда", "Мангистау", "Павлодар"],
      hidden: [
        "Ганюшкино", "Георгиевка", "Глубокое", "Гранитогорск", "Гульшад", "Гульдала", "Габидена Мустафина",
        "Джалтыр", "Дарьинское", "Достык", "Другое", "Дарьинский", "Державинск", "Доссор", "Денисовка", "Деркул",
        "Егиндыколь", "Егиндыбулак", "Ерейментау", "Есиль", "Ескене", "Есик"
      ]
    },
    types: {
      visible: ["Экскаваторы-погрузчики", "Бульдозеры", "Гусеничные экскаваторы"],
      hidden: ["Автокраны", "Асфальтоукладчики", "Автобетоносмесители", "Виброкатки", "Грейдеры"]
    }
  },
  "Покупка спецтехники": {
    cities: {
      visible: ["Алматы", "Актобе", "Астана"],
      hidden: ["Караганда", "Шымкент", "Тараз"]
    },
    types: {
      visible: ["Продажа Тип 1", "Продажа Тип 2"],
      hidden: ["Продажа Тип 3", "Продажа Тип 4"]
    }
  },
  "Арендовать спецтехнику": {
    cities: {
      visible: ["Астана", "Шымкент"],
      hidden: ["Актобе", "Тараз"]
    },
    types: {
      visible: ["Аренда Тип 1", "Аренда Тип 2"],
      hidden: ["Аренда Тип 3"]
    }
  },
  "Покупка запчастей": {
    cities: {
      visible: ["Кызылорда"],
      hidden: ["Шымкент", "Тараз"]
    },
    types: {
      visible: ["Запчасти Тип 1"],
      hidden: ["Запчасти Тип 2"]
    },
    brands: {
      visible: ["Запчасти Бренд А"],
      hidden: ["Запчасти Бренд Б"]
    }
  },
  "Нужен ремонт техники": {
    cities: {
      visible: ["Павлодар"],
      hidden: ["Караганда"]
    },
    types: {
      visible: ["Ремонт Тип 1"],
      hidden: ["Ремонт Тип 2"]
    },
    brands: {
      visible: ["Ремонт Бренд А"],
      hidden: ["Ремонт Бренд Б"]
    },
    profession: {
      visible: ["Ремонт Тип 1"],
      hidden: ["Ремонт Тип 2"]
    }
  },
  "Ищу водителя": {
    cities: {
      visible: ["Мангистау"],
      hidden: ["Актау"]
    },
    types: {
      visible: ["Водители Тип 1"],
      hidden: ["Водители Тип 2"]
    }
  }
};