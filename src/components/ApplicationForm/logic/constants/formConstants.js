
export const PROFESSIONS = [
  { value: "mechanic", label: "Mexanik" },
  { value: "auto_electrician", label: "Avtoelektrik" },
  { value: "welder", label: "Payvandchi" },
  { value: "hydraulics_specialist", label: "Gidravlik mutaxassisi" },
  { value: "diagnostic_specialist", label: "Diagnostika mutaxassisi" },
  { value: "motor_repairman", label: "Dvigatel ustasi" },
  { value: "transmission_specialist", label: "Transmissiya ustasi" },
  { value: "air_conditioning_specialist", label: "Konditsioner ustasi" },
  { value: "chassis_specialist", label: "Shassi ustasi" },
  { value: "electrician", label: "Elektrik" },
  { value: "engineer", label: "Muhandis" },
  { value: "painter", label: "Bo'yovchi" },
  { value: "body_repair_specialist", label: "Kuzov ustasi" },
  { value: "field_technician", label: "Joyida xizmat ko'rsatuvchi texnik" },
  { value: "parts_specialist", label: "Ehtiyot qismlar mutaxassisi" },
  { value: "service_advisor", label: "Servis maslahatchisi" },
  { value: "loader_operator", label: "Yuk ko'taruvchi operatori" },
  { value: "crane_operator", label: "Kran operatori" },
  { value: "excavator_operator", label: "Ekskavatorchi" },
  { value: "bulldozer_operator", label: "Buldozerchi" },
];

export const WORK_LOCATIONS = [
  { value: "own_place", label: "O'z ustaxonasida" },
  { value: "on_site", label: "Mijoz manzilida" },
  { value: "both", label: "Ham ustaxonada, ham mijoz manzilida" },
];

export const MARKA_FOR_REPAIR = [
  { value: "man", label: "MAN" },
  { value: "talant", label: "TALANT" },
  { value: "caterpillar", label: "CATERPILLAR" },
  { value: "komatsu", label: "KOMATSU" },
  { value: "shantui", label: "SHANTUI" },
  { value: "shehwa_hbxg", label: "SHEHWA / HBXG" },
  { value: "volvo", label: "VOLVO" },
  { value: "hitachi", label: "HITACHI" },
  { value: "jcb", label: "JCB" },
  { value: "hyundai", label: "HYUNDAI" },
  { value: "doosan", label: "DOOSAN" },
  { value: "liebherr", label: "LIEBHERR" },
  { value: "xcmg", label: "XCMG" },
  { value: "case", label: "CASE" },
  { value: "new_holland", label: "NEW HOLLAND" },
  { value: "terex", label: "TEREX" },
  { value: "bobcat", label: "BOBCAT" },
  { value: "yanmar", label: "YANMAR" },
  { value: "sumitomo", label: "SUMITOMO" },
  { value: "kubota", label: "KUBOTA" },
];

export const PROFESSION_BY_MARKA = {
  man: [
    { value: "mechanic", label: "Mexanik" },
    { value: "motor_repairman", label: "Dvigatel ustasi" },
    { value: "transmission_specialist", label: "Transmissiya ustasi" },
    { value: "hydraulics_specialist", label: "Gidravlik mutaxassisi" },
    { value: "auto_electrician", label: "Avtoelektrik" },
  ],
  caterpillar: [
    { value: "mechanic", label: "Mexanik" },
    { value: "hydraulics_specialist", label: "Gidravlik mutaxassisi" },
    { value: "motor_repairman", label: "Dvigatel ustasi" },
    { value: "excavator_operator", label: "Ekskavatorchi" },
    { value: "bulldozer_operator", label: "Buldozerchi" },
  ],
  komatsu: [
    { value: "mechanic", label: "Mexanik" },
    { value: "hydraulics_specialist", label: "Gidravlik mutaxassisi" },
    { value: "motor_repairman", label: "Dvigatel ustasi" },
    { value: "excavator_operator", label: "Ekskavatorchi" },
  ],
  // Add more brands as needed
};

export const PART_MANUFACTURER_BY_PROFESSION = {
  mechanic: [
    { value: "bosch", label: "Bosch" },
    { value: "denso", label: "Denso" },
    { value: "delphi", label: "Delphi" },
    { value: "mahle", label: "Mahle" },
    { value: "mann_filter", label: "MANN-FILTER" },
  ],
  hydraulics_specialist: [
    { value: "bosch", label: "Bosch" },
    { value: "delphi", label: "Delphi" },
    { value: "continental", label: "Continental" },
  ],
  motor_repairman: [
    { value: "mahle", label: "Mahle" },
    { value: "bosch", label: "Bosch" },
    { value: "denso", label: "Denso" },
    { value: "mann_filter", label: "MANN-FILTER" },
  ],
  auto_electrician: [
    { value: "bosch", label: "Bosch" },
    { value: "denso", label: "Denso" },
    { value: "delphi", label: "Delphi" },
    { value: "ngk", label: "NGK" },
  ],
  // Add more professions as needed
};

export const TECH_TYPES = [
  { value: "excavator", label: "Экскаваторы-погрузчики" },
  { value: "water_truck", label: "Водовозы" },
  { value: "overburden_excavator", label: "Вскрышные экскаваторы" },
  { value: "roller", label: "Каток" },
  { value: "construction_cradle", label: "Люльки Cтроительные" },
  { value: "mine_loader", label: "Шахтные погрузчики" },
  { value: "kamaz", label: "камаз" },
  { value: "vacuum_machine", label: "Машина вакуумная" },
  { value: "road_machine", label: "Дорожная машины" },
  { value: "vacuum_cleaner", label: "Вакуумная машина-пылесос" },
  { value: "underground_loader", label: "Подземные погрузчики" },
  { value: "trailer_lift", label: "Прицепные подъемники" },
  { value: "excavator_bulldozer", label: "Экскаваторы-бульдозеры" },
  { value: "spider_crane", label: "Кран-паук" },
  { value: "bulldozer", label: "Бульдозеры" },
  { value: "tracked_excavator", label: "Гусеничные экскаваторы" },
  { value: "front_loader", label: "Фронтальные погрузчики" },
  { value: "mini_loader", label: "Мини-погрузчики" },
  { value: "mini_excavator", label: "Мини-экскаваторы" },
  { value: "mobile_crane", label: "Автокраны" },
  { value: "dump_truck", label: "Самосвалы" },
  { value: "tractor_trailer", label: "Тягачи седельные" },
  { value: "road_roller", label: "Дорожные катки" },
  { value: "crusher", label: "Дробилки" },
  { value: "forklift", label: "Вилочные автопогрузчики" },
  { value: "grader", label: "Грейдеры" },
  { value: "dredger", label: "Земснаряды" },
  { value: "wheel_excavator", label: "Колесные экскаваторы" },
  { value: "pile_driver", label: "Сваебойные установки" },
  { value: "scraper", label: "Скреперы" }
];

export const MARKA_BY_TECH_TYPES = {
  excavator: [
    { value: "caterpillar_excavator", label: "Caterpillar" },
    { value: "komatsu_excavator", label: "Komatsu" },
    { value: "hitachi_excavator", label: "Hitachi" },
    { value: "volvo_excavator", label: "Volvo" },
    { value: "jcb_excavator", label: "JCB" },
  ],
  bulldozer: [
    { value: "caterpillar_bulldozer", label: "Caterpillar" },
    { value: "komatsu_bulldozer", label: "Komatsu" },
    { value: "john_deere_bulldozer", label: "John Deere" },
    { value: "case_bulldozer", label: "Case" },
  ],
  crane: [
    { value: "liebherr_crane", label: "Liebherr" },
    { value: "tadano_crane", label: "Tadano" },
    { value: "grove_crane", label: "Grove" },
    { value: "terex_crane", label: "Terex" },
  ],
  loader: [
    { value: "caterpillar_loader", label: "Caterpillar" },
    { value: "volvo_loader", label: "Volvo" },
    { value: "komatsu_loader", label: "Komatsu" },
    { value: "jcb_loader", label: "JCB" },
  ],
};

export const CATEGORY_BY_MARKA = {
  liebherr_crane: [
    { value: "hydraulics", label: "Гидравлика, гидрооборудование" },
    { value: "engines", label: "Двигатели, детали двигателей" },
    { value: "fuel_system", label: "Топливная система" },
    { value: "filters", label: "Фильтры, фильтроэлементы" },
    { value: "chassis", label: "Ходовая часть" },
    { value: "tires_discs", label: "Шины, диски для спецтехники" },
  ],
  caterpillar_bulldozer: [
    { value: "hydraulics", label: "Гидравлика, гидрооборудование" },
    { value: "engines", label: "Двигатели, детали двигателей" },
    { value: "fuel_system", label: "Топливная система" },
    { value: "filters", label: "Фильтры, фильтроэлементы" },
    { value: "chassis", label: "Ходовая часть" },
    { value: "tires_discs", label: "Шины, диски для спецтехники" },
  ],
  caterpillar_loader: [
    { value: "hydraulics", label: "Гидравлика, гидрооборудование" },
    { value: "engines", label: "Двигатели, детали двигателей" },
    { value: "fuel_system", label: "Топливная система" },
  ],
  // Add more categories as needed
};

export const MODEL_BY_MARKA = {
  caterpillar_excavator: [{ value: "cat_320", label: "CAT 320" }],
  komatsu_excavator: [{ value: "pc200", label: "PC200" }],
  hitachi_excavator: [{ value: "zx200", label: "ZX200" }],
  volvo_excavator: [{ value: "ec200", label: "EC200" }],
  jcb_excavator: [{ value: "js200", label: "JS200" }],
  caterpillar_bulldozer: [{ value: "d6", label: "D6" }],
  komatsu_bulldozer: [{ value: "d61", label: "D61" }],
  liebherr_crane: [{ value: "ltm1030", label: "LTM 1030" }],
  tadano_crane: [{ value: "gr250", label: "GR-250N" }],
  caterpillar_loader: [{ value: "950", label: "950 GC" }],
  volvo_loader: [{ value: "l60", label: "L60H" }],
};

export const COUNTRIES = [
  { value: "uzbekistan", label: "O'zbekiston" },
  { value: "russia", label: "Rossiya" },
  { value: "kazakhstan", label: "Qozog'iston" },
  { value: "kyrgyzstan", label: "Qirg'iziston" },
  { value: "tajikistan", label: "Tojikiston" },
  { value: "turkmenistan", label: "Turkmaniston" },
  { value: "azerbaijan", label: "Ozarbayjon" },
  { value: "turkey", label: "Turkiya" },
  { value: "afghanistan", label: "Afg'oniston" },
  { value: "china", label: "Xitoy" },
];

export const CITIES_BY_COUNTRY = {
  uzbekistan: [
    { value: "tashkent", label: "Toshkent" },
    { value: "samarkand", label: "Samarqand" },
    { value: "bukhara", label: "Buxoro" },
    { value: "andijan", label: "Andijon" },
    { value: "fergana", label: "Farg'ona" },
    { value: "namangan", label: "Namangan" },
    { value: "qarshi", label: "Qarshi" },
    { value: "nukus", label: "Nukus" },
    { value: "jizzakh", label: "Jizzax" },
    { value: "urgench", label: "Urganch" },
    { value: "termez", label: "Termiz" },
    { value: "navoi", label: "Navoiy" },
    { value: "gulistan", label: "Guliston" },
    { value: "kokand", label: "Qo'qon" },
  ],
  russia: [
    { value: "moscow", label: "Moskva" },
    { value: "st_petersburg", label: "Sankt-Peterburg" },
    { value: "novosibirsk", label: "Novosibirsk" },
  ],
  kazakhstan: [
    { value: "almaty", label: "Almati" },
    { value: "nur-sultan", label: "Nur-Sultan" },
    { value: "shymkent", label: "Shymkent" },
  ],
  kyrgyzstan: [
    { value: "bishkek", label: "Bishkek" },
    { value: "osh", label: "Osh" },
  ],
  tajikistan: [
    { value: "dushanbe", label: "Dushanbe" },
    { value: "khujand", label: "Xujand" },
  ],
  turkmenistan: [
    { value: "ashgabat", label: "Ashgabat" },
    { value: "turkmenbashi", label: "Turkmenbashi" },
  ],
  azerbaijan: [
    { value: "baku", label: "Boku" },
    { value: "ganja", label: "Ganja" },
  ],
  turkey: [
    { value: "istanbul", label: "Istanbul" },
    { value: "ankara", label: "Ankara" },
    { value: "izmir", label: "Izmir" },
  ],
  afghanistan: [
    { value: "kabul", label: "Kobul" },
    { value: "herat", label: "Herat" },
  ],
  china: [
    { value: "beijing", label: "Pekin" },
    { value: "shanghai", label: "Shanxay" },
  ],
};

export const FUEL_TYPES = [
  { value: "petrol", label: "Benzin" },
  { value: "diesel", label: "Dizel" },
  { value: "gas", label: "Gaz" },
  { value: "electric", label: "Elektr" },
  { value: "petrol-gas", label: "Benzin-Gaz" },
  { value: "hybrid", label: "Gibrid" },
  { value: "not_specified", label: "Belgilanmagan" },
];

// Generate date options
export const DATE_OF_RELEASE = Array.from(
  { length: new Date().getFullYear() - 1970 + 1 },
  (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: String(year), label: String(year) };
  }
);

// Generate country mapping for categories - har bir category barcha countrylarni qo'llab-quvvatlaydi
export const COUNTRY_BY_CATEGORY = Object.values(CATEGORY_BY_MARKA)
  .flat()
  .reduce((acc, category) => {
    acc[category.value] = COUNTRIES;
    return acc;
  }, {});


// Valyuta ma'lumotlari
export const CURRENCIES = [
  {
    id: 'uzs',
    name: "O'zbek so'mi",
    code: 'UZS',
    symbol: "so'm",
    flag: '🇺🇿',
    color: 'blue'
  },
  {
    id: 'usd',
    name: 'US Dollar',
    code: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    color: 'green'
  },
  {
    id: 'eur',
    name: 'Euro',
    code: 'EUR',
    symbol: '€',
    flag: '🇪🇺',
    color: 'purple'
  },
  {
    id: 'rub',
    name: 'Russian Ruble',
    code: 'RUB',
    symbol: '₽',
    flag: '🇷🇺',
    color: 'red'
  }
];

// ALL fields have proper initial values (never undefined)
export const INITIAL_FORM_DATA = {
  title: "",
  techType: [],
  description: "",
  price: "",
  isNegotiable: false,
  contact: "",
  phone: "",
  contact_location: "",
  marka: [],
  model: [],
  fuelType: "",
  countriesbymodel: "",
  releaseDate: "",
  mileage: "",
  condition: "",
  cashPayment: "",
  minOrderTime: "",
  haveDriver: "",
  hourlyRate: "",
  partsCategory: "",
  countriesbycategory: "",
  partNumber: "",
  markaForRepair: "",
  profession: [],
  partmanifacturer: [],
  workLocation: "",
  experience: "",
  currency: "uzs"
};

// Required fields configuration - YANGI TARTIBDA
export const REQUIRED_FIELDS_CONFIG = {
  // Ehtiyot qismlar sotish
  parts: [
    "title",
    "techType",
    "marka",
    "partsCategory",
    "countriesbycategory",
    "partNumber",
    "condition",
    "description",
    "cashPayment",
    "contact",
    "phone",
    "contact_location",
  ],

  // Ta'mir xizmatlari
  repair: [
    "markaForRepair",
    "profession",
    "partmanifacturer",
    "workLocation",
    "description",
    "contact",
    "phone",
    "contact_location",
    "experience"
  ],

  // Texnika sotib olish
  purchase: [
    "techType",
    "marka",
    "model",
    "releaseDate",
    "countriesbymodel",
    "fuelType",
    "mileage",
    "condition",
    "description",
    "cashPayment",
    "contact",
    "phone",
    "contact_location",
  ],

  // Texnika ijarasi
  rent: [
    "techType",
    "marka",
    "model",
    "releaseDate",
    "minOrderTime",
    "haveDriver",
    "description",
    "contact",
    "phone",
    "contact_location",
  ],

  // Haydovchi xizmatlari
  driver: [
    "techType",
    "experience",
    "description",
    "contact",
    "phone",
    "contact_location",
  ],
};