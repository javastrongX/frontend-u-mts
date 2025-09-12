// Constants
const TECH_TYPES = [
  { value: "excavator", label: "Ekskavator" },
  { value: "bulldozer", label: "Buldozer" },
  { value: "crane", label: "Kran" },
  { value: "loader", label: "Yuklargich" },
  { value: "truck", label: "Yuk mashinasi" },
  { value: "forklift", label: "Avtopogruzchik" },
  { value: "roller", label: "Silindr (Road roller)" },
  { value: "grader", label: "Grader" },
  { value: "compactor", label: "Kompakter" },
  { value: "mixer", label: "Beton mikser" },
  { value: "dump-truck", label: "Samosvol" },
  { value: "generator", label: "Generator" },
];

const MARKA_BY_TECH_TYPES = {
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

const MODEL_BY_MARKA = {
  // Caterpillar excavator modellari
  caterpillar_excavator: [
    { value: "cat_320", label: "CAT 320" },
    { value: "cat_330", label: "CAT 330" },
    { value: "cat_349", label: "CAT 349" },
    { value: "cat_390", label: "CAT 390" },
  ],
  // Komatsu excavator modellari
  komatsu_excavator: [
    { value: "pc200", label: "PC200" },
    { value: "pc300", label: "PC300" },
    { value: "pc400", label: "PC400" },
    { value: "pc500", label: "PC500" },
  ],
  // Hitachi excavator modellari
  hitachi_excavator: [
    { value: "zx200", label: "ZX200" },
    { value: "zx300", label: "ZX300" },
    { value: "zx450", label: "ZX450" },
  ],
  // Volvo excavator modellari
  volvo_excavator: [
    { value: "ec200", label: "EC200" },
    { value: "ec300", label: "EC300" },
    { value: "ec480", label: "EC480" },
  ],
  // JCB excavator modellari
  jcb_excavator: [
    { value: "js200", label: "JS200" },
    { value: "js300", label: "JS300" },
    { value: "js400", label: "JS400" },
  ],
  // Bulldozer markalari
  caterpillar_bulldozer: [
    { value: "d6", label: "D6" },
    { value: "d7", label: "D7" },
    { value: "d8", label: "D8" },
    { value: "d9", label: "D9" },
  ],
  komatsu_bulldozer: [
    { value: "d61", label: "D61" },
    { value: "d85", label: "D85" },
    { value: "d155", label: "D155" },
  ],
  // Crane markalari
  liebherr_crane: [
    { value: "ltm1030", label: "LTM 1030" },
    { value: "ltm1070", label: "LTM 1070" },
    { value: "ltm1100", label: "LTM 1100" },
  ],
  tadano_crane: [
    { value: "gr250", label: "GR-250N" },
    { value: "gr300", label: "GR-300N" },
    { value: "gr500", label: "GR-500N" },
  ],
  // Loader markalari
  caterpillar_loader: [
    { value: "950", label: "950 GC" },
    { value: "962", label: "962M" },
    { value: "972", label: "972M" },
  ],
  volvo_loader: [
    { value: "l60", label: "L60H" },
    { value: "l90", label: "L90H" },
    { value: "l120", label: "L120H" },
  ],
};

const COUNTRIES = [
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

const CITIES_BY_COUNTRY = {
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
    { value: "saint-petersburg", label: "Sankt-Peterburg" },
    { value: "novosibirsk", label: "Novosibirsk" },
    { value: "yekaterinburg", label: "Yekaterinburg" },
    { value: "kazan", label: "Qozon" },
    { value: "nizhny-novgorod", label: "Nijniy Novgorod" },
    { value: "chelyabinsk", label: "Chelyabinsk" },
    { value: "omsk", label: "Omsk" },
    { value: "samara", label: "Samara" },
    { value: "rostov-on-don", label: "Rostov-na-Donu" },
  ],
  kazakhstan: [
    { value: "almaty", label: "Almati" },
    { value: "nur-sultan", label: "Nur-Sultan" },
    { value: "shymkent", label: "Shymkent" },
    { value: "aktau", label: "Aktau" },
    { value: "aktobe", label: "Aktobe" },
    { value: "karaganda", label: "Qaraganda" },
    { value: "pavlodar", label: "Pavlodar" },
    { value: "kostanay", label: "Qostanay" },
    { value: "taraz", label: "Taraz" },
  ],
  kyrgyzstan: [
    { value: "bishkek", label: "Bishkek" },
    { value: "osh", label: "Osh" },
    { value: "jalal-abad", label: "Jalal-Abad" },
    { value: "karakol", label: "Qarakol" },
    { value: "tokmok", label: "Toqmoq" },
    { value: "uzgen", label: "Uzgen" },
    { value: "naryn", label: "Naryn" },
  ],
  tajikistan: [
    { value: "dushanbe", label: "Dushanbe" },
    { value: "khujand", label: "Xujand" },
    { value: "kulob", label: "Kulyob" },
    { value: "qurghonteppa", label: "Qurg'onteppa" },
    { value: "istaravshan", label: "Istaravshan" },
    { value: "khorog", label: "Xorog" },
  ],
  turkmenistan: [
    { value: "ashgabat", label: "Ashgabat" },
    { value: "turkmenbashi", label: "Turkmenboshi" },
    { value: "mary", label: "Mary" },
    { value: "turkmenabat", label: "Turkmenabat" },
    { value: "dashoguz", label: "Dashog'uz" },
    { value: "balkanabat", label: "Balkanabat" },
  ],
  azerbaijan: [
    { value: "baku", label: "Boku" },
    { value: "ganja", label: "Ganja" },
    { value: "sumgayit", label: "Sumqayit" },
    { value: "mingachevir", label: "Mingachevir" },
    { value: "quba", label: "Quba" },
    { value: "lankaran", label: "Lankaran" },
  ],
  turkey: [
    { value: "istanbul", label: "Istanbul" },
    { value: "ankara", label: "Ankara" },
    { value: "izmir", label: "Izmir" },
    { value: "bursa", label: "Bursa" },
    { value: "antalya", label: "Antalya" },
    { value: "adana", label: "Adana" },
    { value: "konya", label: "Konya" },
    { value: "gaziantep", label: "Gaziantep" },
  ],
  afghanistan: [
    { value: "kabul", label: "Kobul" },
    { value: "herat", label: "Hirot" },
    { value: "kandahar", label: "Qandahor" },
    { value: "mazar-i-sharif", label: "Mazar-i-Sharif" },
    { value: "jalalabad", label: "Jalalabad" },
    { value: "kunduz", label: "Kunduz" },
  ],
  china: [
    { value: "beijing", label: "Pekin" },
    { value: "shanghai", label: "Shanxay" },
    { value: "guangzhou", label: "Guangjou" },
    { value: "shenzhen", label: "Shenjen" },
    { value: "tianjin", label: "Tianjin" },
    { value: "wuhan", label: "Vuxan" },
    { value: "xian", label: "Sian" },
    { value: "urumqi", label: "Urumchi" },
  ],
};

const FUEL_TYPES = [
  { value: "petrol", label: "Benzin" },
  { value: "diesel", label: "Dizel" },
  { value: "hybrid", label: "Hibrid" },
  { value: "electric", label: "Elektro" },
];
