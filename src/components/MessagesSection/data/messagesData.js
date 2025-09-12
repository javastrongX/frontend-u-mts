import { useTranslation } from 'react-i18next';
import { 
  FiMessageSquare, 
  FiShoppingCart, 
  FiCreditCard, 
  FiSettings, 
  FiTrendingUp, 
  FiStar,
  FiBell
} from 'react-icons/fi';

export const ordersData = {
  "16.06.2025": [
    {
      id: 1,
      title: "Hyundai R 305LC-7",
      category: "Гусеничные экскаваторы",
      priority: "high",
      imageUrl: ""
    },
    {
      id: 2,
      title: "Автокраны",
      category: "DONGFENG",
      isNew: false,
      priority: "medium"
    },
    {
      id: 3,
      title: "Втулка в переднюю стрелу (крепление ковша) [54205111] для MST 542, MST 544",
      category: "MST",
      priority: "high",
      imageUrl: ""
    },
    {
      id: 10,
      title: "Втулка в переднюю стрелу (крепление ковша) [54205111] для MST 542, MST 544",
      category: "MST",
      priority: "high",
      imageUrl: ""
    }
  ],
  "15.06.2025": [
    {
      id: 4,
      title: "Втулка в переднюю стрелу (крепление ковша) [54205111] для MST 542, MST 544",
      category: "MST",
      isNew: false,
      priority: "medium",
      imageUrl: ""
    },
    {
      id: 5,
      title: "Гусеничные экскаваторы",
      category: "HITACHI",
      priority: "high",
      imageUrl: ""
    },
    {
      id: 6,
      title: "Экскаваторы-погрузчики",
      category: "VOLVO",
      isNew: false,
      priority: "low",
      imageUrl: ""
    }
  ],
  "14.06.2025": [
    {
      id: 7,
      title: "Гусеничные экскаваторы",
      category: "HITACHI",
      priority: "high",
      imageUrl: ""
    },
    {
      id: 8,
      title: "Экскаваторы-погрузчики",
      category: "VOLVO",
      isNew: false,
      priority: "medium",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 9,
      title: "Поршень STD 3957797(3957795/39578020) - ДВС Cummins",
      category: "HITACHI, KOMATSU, SDLG, HYUNDAI, LIUGONG",
      priority: "high",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80"
    }
  ]
};

export const getTabsConfig = () => {
  const { t } = useTranslation();
  return [
    { label: t("MessageData.notifications.announcements", "Объявления"), icon: FiMessageSquare, key: "announcements" },
    { label: t("MessageData.notifications.orders", "Заказы"), icon: FiShoppingCart, key: "orders" },
    { label: t("MessageData.notifications.payments", "Платежи"), icon: FiCreditCard, key: "payments" },
    { label: t("MessageData.notifications.system", "Системные"), icon: FiSettings, key: "system" },
    { label: t("MessageData.notifications.promotions", "Акции"), icon: FiStar, key: "promotions" },
    { label: t("MessageData.notifications.news", "Новости"), icon: FiTrendingUp, key: "news" },
    { label: t("MessageData.notifications.draws", "Розыгрыши"), icon: FiBell, key: "contests" }
  ];
};

