import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Center, Fade, Box } from "@chakra-ui/react";
import PulsingDotsLoader from "./components/LazyComponent/PulsingDotsLoader";
import Coming from "./components/CompanyRegistration/Coming";

// Lazy load route components
const HomeLayout = lazy(() => import("./Pages/Home/HomeLayout"));
const Login = lazy(() => import("./Pages/Auth/Login"));
const Register = lazy(() => import("./Pages/Auth/Register"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const Business = lazy(() => import("./Pages/BusinessHome/BusinessLayout"));
const Ads = lazy(() => import("./Pages/Ads/AdvertiseLayout"));
const OrderList = lazy(() => import("./Pages/OrderPage/OrderListLayout"));
const Companies = lazy(() => import("./Pages/Companies/CompaniesLayout"));
const News = lazy(() => import("./Pages/NewsPage/NewsLayout"));
const SharedNews = lazy(() => import("./Pages/NewsPage/SharedNewsLayout"));
const HotOfferDetailLayout = lazy(() => import("./Pages/HotOfferDetail/HotOfferDetailLayout"));
const OrderDetailsPage = lazy(() => import("./Pages/OrderPage/OrderPageDetailLayout"));
const MobileHotOfferDetailsLayout = lazy(() => import("./Pages/MobileHotOfferDetail/MobileHotOfferDetailsLayout"));
const PartsMarketplace = lazy(() => import("./Pages/PartnersDetails/PartnerDetailsLayout"));
const OrderForm = lazy(() => import("./Pages/PostOrder/OrderFormLayout"));
const ProfileLayout = lazy(() => import("./Pages/Profile/ProfileLayout"));
const StatistikaLayout = lazy(() => import("./Pages/Statistika/StatistikaLayout"));
const PromotionPageLayout = lazy(() => import("./Pages/Promotion/PromotionPageLayout"));
const ApplicationFormLayout = lazy(() => import("./Pages/PostApplication/ApplicationFormLayout"));
const ForgotPasswordForm = lazy(() => import("./Pages/Auth/ForgotPasswordForm"));
const EmailVerification = lazy(() => import("./Pages/Auth/Verification/EmailVerification"));
const PasswordResetVerification = lazy(() => import("./Pages/Auth/Verification/PasswordResetVerification"));
const UserProfileCompletion = lazy(() => import("./Pages/Auth/UserProfileCompletion"));
const CompanyRegistration = lazy(() => import("./components/CompanyRegistration/CompanyRegistration"));
const CompanyActivity = lazy(() => import("./components/CompanyRegistration/CompanyActivityForm"));

  

// Define routes
const router = createBrowserRouter([
  { path: "/", element: <HomeLayout /> },
  { path: "/auth/register", element: <Register /> },
  { path: "/auth/login", element: <Login /> },
  { path: "/auth/profile-completion", element: <UserProfileCompletion /> },
  { path: "/auth/registration-performer", element: <CompanyRegistration /> },
  { path: "/auth/registration-performer/activity", element: <CompanyActivity /> },
  { path: "/forgot-password", element: <ForgotPasswordForm /> },
  { path: "/verify", element: <EmailVerification /> },
  { path: "/password-reset-verification", element: <PasswordResetVerification /> },
  { path: "/profile", element: <ProfileLayout /> },
  { path: "/profile/settings", element: <ProfileLayout /> },
  { path: "/business", element: <Business /> },
  { path: "/ads", element: <Ads /> },
  { path: "/applications", element: <OrderList /> },
  { path: "/companies", element: <Companies /> },
  { path: "/news", element: <News /> },
  { path: "/news/:id", element: <SharedNews /> },
  { path: "/hot-offers/product/:slug", element: <HotOfferDetailLayout /> },
  { path: "/order-details/product/:slug", element: <OrderDetailsPage /> },
  { path: "/ads/:slug", element: <MobileHotOfferDetailsLayout /> },
  { path: "/about-company/:slug", element: <PartsMarketplace /> },
  { path: "/applications/create", element: <OrderForm /> },
  { path: "/create-ads", element: <ApplicationFormLayout /> },
  { path: "/profile/my-applications/statistic/:id", element: <StatistikaLayout /> },
  { path: "/profile/my-products/statistic/:id", element: <StatistikaLayout /> },
  { path: "/product/promotion/:id", element: <PromotionPageLayout /> },
  { path: "/edit/:id", element: <ApplicationFormLayout /> },


  { path: "/profile/messages", element: <ProfileLayout /> },
  { path: "/profile/balance", element: <ProfileLayout /> },
  { path: "/profile/orders", element: <ProfileLayout /> },
  { path: "/profile/ads", element: <ProfileLayout /> },
  { path: "/profile/favorites", element: <ProfileLayout />},
  { path: "/profile/support", element: <ProfileLayout /> },
  { path: "/profile/about", element: <ProfileLayout /> },

  { path: "/company", element: <Coming /> },
  { path: "*", element: <NotFound /> }
]);

const LoadingFallback = () => (
  <Center
    h="100vh"
    w="100vw"
    position="fixed"
    top={0}
    left={0}
    zIndex={9999}
    flexDirection="column"
    bg="rgba(255, 255, 255, 0.4)"
    sx={{
      backdropFilter: "blur(8px)", 
      WebkitBackdropFilter: "blur(8px)",
    }}
  >
    <Fade in={true} transition={{ enter: { duration: 0.5 } }}>
      <Box textAlign="center">
        <PulsingDotsLoader />
      </Box>
    </Fade>
  </Center>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;