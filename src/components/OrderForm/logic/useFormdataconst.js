// Constants
export const TECH_TYPES = [
  { value: 'excavator', label: 'Ekskavator' },
  { value: 'bulldozer', label: 'Buldozer' },
  { value: 'crane', label: 'Kran' },
  { value: 'loader', label: 'Yuklargich' },
  { value: 'truck', label: 'Yuk mashinasi' },
  { value: 'forklift', label: 'Avtopogruzchik' },
  { value: 'roller', label: 'Silindr (Road roller)' },
  { value: 'grader', label: 'Grader' },
  { value: 'compactor', label: 'Kompakter' },
  { value: 'mixer', label: 'Beton mikser' },
  { value: 'dump-truck', label: 'Samosvol' },
  { value: 'generator', label: 'Generator' }
];

export const MARKA_BY_TECH_TYPES = {
  excavator: [
    { value: 'brand_excavator', label: 'brand_excavator' },
    { value: 'brand2_excavator', label: 'brand2_excavator' },
    { value: 'brand3_excavator', label: 'brand3_excavator' }
  ],
  bulldozer: [
    { value: 'brand_bulldozer', label: 'brand_bulldozer' },
    { value: 'brand2_bulldozer', label: 'brand2_bulldozer' },
    { value: 'brand3_bulldozer', label: 'brand3_bulldozer' }
  ],
  crane: [
    { value: 'brand_crane', label: 'brand_crane' },
    { value: 'brand2_crane', label: 'brand2_crane' },
    { value: 'brand3_crane', label: 'brand3_crane' }
  ],
  loader: [
    { value: 'brand_loader', label: 'brand_loader' },
    { value: 'brand2_loader', label: 'brand2_loader' },
    { value: 'brand3_loader', label: 'brand3_loader' }
  ]
};

export const MODEL_BY_MARKA = {
  brand_excavator: [
    { value: 'model_excavator', label: 'model_excavator' },
    { value: 'model2_excavator', label: 'model2_excavator' },
    { value: 'model3_excavator', label: 'model3_excavator' }
  ],
  brand_bulldozer: [
    { value: 'model_bulldozer', label: 'model_bulldozer' },
    { value: 'model2_bulldozer', label: 'model2_bulldozer' },
    { value: 'model3_bulldozer', label: 'model3_bulldozer' }
  ],
  brand_crane: [
    { value: 'model_crane', label: 'model_crane' },
    { value: 'model2_crane', label: 'model2_crane' },
    { value: 'model3_crane', label: 'model3_crane' }
  ],
  brand_loader: [
    { value: 'model_loader', label: 'model_loader' },
    { value: 'model2_loader', label: 'model2_loader' },
    { value: 'model3_loader', label: 'model3_loader' }
  ]
};

export const COUNTRIES = [
  { value: 'uzbekistan', label: "O'zbekiston" },
  { value: 'russia', label: 'Rossiya' },
  { value: 'kazakhstan', label: "Qozog'iston" },
  { value: 'kyrgyzstan', label: "Qirg'iziston" },
  { value: 'tajikistan', label: 'Tojikiston' },
  { value: 'turkmenistan', label: 'Turkmaniston' },
  { value: 'azerbaijan', label: 'Ozarbayjon' },
  { value: 'turkey', label: 'Turkiya' },
  { value: 'afghanistan', label: "Afg'oniston" },
  { value: 'china', label: 'Xitoy' }
];

export const CITIES_BY_COUNTRY = {
  uzbekistan: [
    { value: 'tashkent', label: 'Toshkent' },
    { value: 'samarkand', label: 'Samarqand' },
    { value: 'bukhara', label: 'Buxoro' },
    { value: 'andijan', label: 'Andijon' },
    { value: 'fergana', label: "Farg'ona" },
    { value: 'namangan', label: 'Namangan' },
    { value: 'qarshi', label: 'Qarshi' },
    { value: 'nukus', label: 'Nukus' },
    { value: 'jizzakh', label: 'Jizzax' },
    { value: 'urgench', label: 'Urganch' },
    { value: 'termez', label: 'Termiz' },
    { value: 'navoi', label: 'Navoiy' },
    { value: 'gulistan', label: 'Guliston' },
    { value: 'kokand', label: "Qo'qon" }
  ],
  russia: [
    { value: 'moscow', label: 'Moskva' },
    { value: 'saint-petersburg', label: 'Sankt-Peterburg' },
    { value: 'novosibirsk', label: 'Novosibirsk' },
    { value: 'yekaterinburg', label: 'Yekaterinburg' },
    { value: 'kazan', label: 'Qozon' },
    { value: 'nizhny-novgorod', label: 'Nijniy Novgorod' },
    { value: 'chelyabinsk', label: 'Chelyabinsk' },
    { value: 'omsk', label: 'Omsk' },
    { value: 'samara', label: 'Samara' },
    { value: 'rostov-on-don', label: 'Rostov-na-Donu' }
  ],
  kazakhstan: [
    { value: 'almaty', label: 'Almati' },
    { value: 'nur-sultan', label: 'Nur-Sultan' },
    { value: 'shymkent', label: 'Shymkent' },
    { value: 'aktau', label: 'Aktau' },
    { value: 'aktobe', label: 'Aktobe' },
    { value: 'karaganda', label: 'Qaraganda' },
    { value: 'pavlodar', label: 'Pavlodar' },
    { value: 'kostanay', label: 'Qostanay' },
    { value: 'taraz', label: 'Taraz' }
  ],
  kyrgyzstan: [
    { value: 'bishkek', label: 'Bishkek' },
    { value: 'osh', label: 'Osh' },
    { value: 'jalal-abad', label: 'Jalal-Abad' },
    { value: 'karakol', label: 'Qarakol' },
    { value: 'tokmok', label: 'Toqmoq' },
    { value: 'uzgen', label: 'Uzgen' },
    { value: 'naryn', label: 'Naryn' }
  ],
  tajikistan: [
    { value: 'dushanbe', label: 'Dushanbe' },
    { value: 'khujand', label: 'Xujand' },
    { value: 'kulob', label: 'Kulyob' },
    { value: 'qurghonteppa', label: "Qurg'onteppa" },
    { value: 'istaravshan', label: 'Istaravshan' },
    { value: 'khorog', label: 'Xorog' }
  ],
  turkmenistan: [
    { value: 'ashgabat', label: 'Ashgabat' },
    { value: 'turkmenbashi', label: 'Turkmenboshi' },
    { value: 'mary', label: 'Mary' },
    { value: 'turkmenabat', label: 'Turkmenabat' },
    { value: 'dashoguz', label: "Dashog'uz" },
    { value: 'balkanabat', label: 'Balkanabat' }
  ],
  azerbaijan: [
    { value: 'baku', label: 'Boku' },
    { value: 'ganja', label: 'Ganja' },
    { value: 'sumgayit', label: 'Sumqayit' },
    { value: 'mingachevir', label: 'Mingachevir' },
    { value: 'quba', label: 'Quba' },
    { value: 'lankaran', label: 'Lankaran' }
  ],
  turkey: [
    { value: 'istanbul', label: 'Istanbul' },
    { value: 'ankara', label: 'Ankara' },
    { value: 'izmir', label: 'Izmir' },
    { value: 'bursa', label: 'Bursa' },
    { value: 'antalya', label: 'Antalya' },
    { value: 'adana', label: 'Adana' },
    { value: 'konya', label: 'Konya' },
    { value: 'gaziantep', label: 'Gaziantep' }
  ],
  afghanistan: [
    { value: 'kabul', label: 'Kobul' },
    { value: 'herat', label: 'Hirot' },
    { value: 'kandahar', label: 'Qandahor' },
    { value: 'mazar-i-sharif', label: 'Mazar-i-Sharif' },
    { value: 'jalalabad', label: 'Jalalabad' },
    { value: 'kunduz', label: 'Kunduz' }
  ],
  china: [
    { value: 'beijing', label: 'Pekin' },
    { value: 'shanghai', label: 'Shanxay' },
    { value: 'guangzhou', label: 'Guangjou' },
    { value: 'shenzhen', label: 'Shenjen' },
    { value: 'tianjin', label: 'Tianjin' },
    { value: 'wuhan', label: 'Vuxan' },
    { value: 'xian', label: 'Sian' },
    { value: 'urumqi', label: 'Urumchi' }
  ]
};

export const RESET_MAP = {
  techType: ['marka', 'model'],
  marka: ['model'],
};

// Har bir order type uchun kerakli fieldlar
export const REQUIRED_FIELDS_MAP = {
  parts: ['title', 'techType', 'description', 'contact', 'phone', 'contact_location', 'marka', 'model'],
  repair: ['title', 'techType', 'description', 'contact', 'phone', 'contact_location', 'marka', 'model'],
  default: ['title', 'techType', 'description', 'contact', 'phone', 'contact_location']
};

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

// Har bir order type uchun submit qilinadigan fieldlar
export const BASE_SUBMIT_FIELDS = {
  parts: ['title', 'techType', 'description', 'contact', 'phone', 'contact_location', 'marka', 'model', "currency"],
  repair: ['title', 'techType', 'description', 'contact', 'phone', 'contact_location', 'marka', 'model', "currency"],
  default: ['title', 'techType', 'description', 'contact', 'phone', 'contact_location', "currency"]
};

export const INITIAL_FORM_DATA = {
  title: '',
  techType: '',
  description: '',
  price: '',
  isNegotiable: false,
  contact: '',
  phone: '',
  contact_location: '',
  marka: '',
  model: '',
  currency: "uzs"
};
