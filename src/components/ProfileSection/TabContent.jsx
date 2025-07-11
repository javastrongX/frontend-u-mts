import { 
  Box, 
  Card, 
  CardBody, 
  VStack, 
  Skeleton, 
  SkeletonCircle 
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { 
  FiCreditCard, 
  FiHelpCircle, 
  FiHeart, 
  FiShoppingCart,
  FiInfo,
  FiEdit
} from "react-icons/fi";

import { ProfileForm } from "./ProfileForm";
import MessagesMobile from "../MessagesSection/MessagesMobile";

import HeaderForTabs from "./HeaderForTabs";
import BalanceTopup from "./BalanceTopup";
import MyOrder from "./MyOrder";
import FavoritesPage from "./FavoritesPage";
import SupportForm from "./SupportForm";
import Oservices from "./Oservices";

export const TabContent = ({ activeTab }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Loading simulation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);


  if (isLoading && activeTab === "profile") {
    return (
      <Card boxShadow="2xl" borderRadius="2xl">
        <CardBody p={{base: 5, custom570: 8}}>
          <VStack spacing={4}>
            <SkeletonCircle size="20" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </VStack>
        </CardBody>
      </Card>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileForm />;
        
      case 'messages':
        return <MessagesMobile />

      case 'balance':
        return (
          <Box>
            <HeaderForTabs title={'Wallet'} subtitle={'Your wallet balance'} MainIcon={FiCreditCard}/>
            <BalanceTopup />
          </Box>
        );
        
      case 'orders':
        return (
          <Box>
            <HeaderForTabs title={'Mening buyurtmalarim'} subtitle={'Buyurtmalaringizni boshqaring'} MainIcon={FiShoppingCart}/>
            <MyOrder/>
         </Box>
        );
        
      case 'ads':
        return (
          <Box>
            <HeaderForTabs title={'Ads'} subtitle={'Your ads'} MainIcon={FiEdit}/>
            <MyOrder/>
          </Box>
        );
      case 'favorites':
        return (
          <Box>
            <HeaderForTabs title={'Favorites'} subtitle={'Your favorite ads'} MainIcon={FiHeart}/>
            <FavoritesPage />
          </Box>
        )
        
      case 'support':
        return (
          <Box>
            <HeaderForTabs title={'Support'} subtitle={'Contact us'} MainIcon={FiHelpCircle}/>
            <SupportForm />
          </Box>
        );
        
      case 'about':
        return (
          <Box>
            <HeaderForTabs title={'About'} subtitle={'About tservice'} MainIcon={FiInfo}/>
            <Oservices />
          </Box>
        );
        
      default:
        return <ProfileForm />;
    }
  };

  return <Box>{renderContent()}</Box>;
};