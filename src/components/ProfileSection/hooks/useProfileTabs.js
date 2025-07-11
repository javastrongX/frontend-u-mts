import { useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Tab mapping - URL pathlar va tab nomlari o'rtasidagi bog'lanish
const TAB_ROUTES = {
  'profile': '/profile',
  'messages': '/profile/messages',
  'balance': '/profile/balance',
  'orders': '/profile/orders',
  'ads': '/profile/ads',
  'favorites': '/profile/favorites',
  'support': '/profile/support',
  'about': '/profile/about'
};

// Reverse mapping - URL dan tab nomini olish uchun
const ROUTE_TO_TAB = Object.fromEntries(
  Object.entries(TAB_ROUTES).map(([tab, route]) => [route, tab])
);

export const useProfileTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL dan boshlang'ich tab ni olish
  const initialTab = ROUTE_TO_TAB[location.pathname] || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Tab o'zgarganda faqat URL ni yangilash - state ni emas!
  const handleTabChange = useCallback((newTab) => {
    const targetRoute = TAB_ROUTES[newTab] || '/profile';
    
    // Agar current route bilan bir xil bo'lsa, navigate qilmaslik
    if (location.pathname !== targetRoute) {
      navigate(targetRoute, { replace: false });
    }
    // setActiveTab ni olib tashladik - URL o'zgarishi useEffect orqali handle qilinadi
  }, [navigate, location.pathname]);

  // Faqat URL o'zgarganda tab ni sinxronlashtirish
  useEffect(() => {
    const currentTab = ROUTE_TO_TAB[location.pathname] || 'profile';
    setActiveTab(currentTab);
  }, [location.pathname]); // activeTab ni dependency dan olib tashladik

  return {
    activeTab,
    handleTabChange,
    tabRoutes: TAB_ROUTES,
    currentRoute: location.pathname
  };
};