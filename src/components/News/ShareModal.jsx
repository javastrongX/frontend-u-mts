import { useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Tooltip,
  Divider,
  useToast
} from '@chakra-ui/react';
import { 
  FaShare, 
  FaTelegram, 
  FaWhatsapp, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaCopy, 
  FaLink 
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ShareModal = ({ isOpen, onClose, newsItem }) => {
  const toast = useToast();
  const newsUrl = newsItem ? `${window.location.origin}/news/${newsItem.id}` : '';
  const shareText = newsItem ? `${newsItem.title}\n\n${newsItem.short_description}` : '';

  const { t } = useTranslation();

  const shareOptions = useMemo(() => [
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: '#0088cc',
      url: `https://t.me/share/url?url=${encodeURIComponent(newsUrl)}&text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + newsUrl)}`
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(newsUrl)}`
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(newsUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(newsUrl)}`
    }
  ], [newsUrl, shareText]);

  const handleShare = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: type === 'url' ? t("hotOfferDetail.share_msg", 'Ссылка скопирована!') : t("newscards.share_txt", 'Текст скопирован!'),
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
    } catch (err) {
      toast({
        title: t("newscards.error_share", 'Ошибка копирования'),
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsItem?.title,
          text: newsItem?.short_description,
          url: newsUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent mx={4} borderRadius="xl" overflow="hidden">
        <ModalHeader bg="gradient.100" py={4}>
          <HStack spacing={3}>
            <Box p={2} bg="blue.400" borderRadius="full" color="white">
              <FaShare size={16} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="bold" color="gray.800">
                {t("newscards.share_news", "Поделиться новостью")}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {t("newscards.share_link", "Выберите платформу для публикации")}
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody p={6}>
          <VStack spacing={6} align="stretch">
            {/* News Preview */}
            <Box
              p={4}
              bg="gray.50"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
            >
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.800" noOfLines={2}>
                  {newsItem?.title}
                </Text>
                <Text fontSize="xs" color="gray.600" noOfLines={2}>
                  {newsItem?.short_description}
                </Text>
              </VStack>
            </Box>

            {/* Share Options */}
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                {t("newscards.share_social", "Поделиться в социальных сетях:")}
              </Text>
              
              <SimpleGrid columns={3} spacing={3}>
                {shareOptions.map((option) => (
                  <Tooltip key={option.name} label={`${t("newscards.by_social", "Поделиться в")} ${option.name}`}>
                    <Button
                      onClick={() => handleShare(option.url)}
                      bg={option.color}
                      color="white"
                      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                      _active={{ transform: 'translateY(0)' }}
                      transition="all 0.2s"
                      borderRadius="xl"
                      height="60px"
                      flexDirection="column"
                      fontSize="xs"
                      fontWeight="medium"
                    >
                      <option.icon size={20} />
                      <Text mt={1}>{option.name}</Text>
                    </Button>
                  </Tooltip>
                ))}
              </SimpleGrid>
            </VStack>

            <Divider />

            {/* Copy Options */}
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                {t("newscards.copy", "Копировать:")}
              </Text>
              
              <HStack spacing={3}>
                <Button
                  leftIcon={<FaLink />}
                  onClick={() => copyToClipboard(newsUrl, 'url')}
                  variant="outline"
                  borderColor="blue.200"
                  color="blue.400"
                  _hover={{ bg: 'blue.50' }}
                  flex={1}
                  borderRadius="lg"
                >
                  {t("newscards.link", "Ссылку")}
                </Button>
                
                <Button
                  leftIcon={<FaCopy />}
                  onClick={() => copyToClipboard(shareText, 'text')}
                  variant="outline"
                  borderColor="green.200"
                  color="green.600"
                  _hover={{ bg: 'green.50' }}
                  flex={1}
                  borderRadius="lg"
                >
                  {t("newscards.text", "Текст")}
                </Button>
              </HStack>
            </VStack>

            {/* Native Share (if available) */}
            {navigator.share && (
              <>
                <Divider />
                <Button
                  onClick={handleNativeShare}
                  colorScheme="purple"
                  variant="solid"
                  borderRadius="lg"
                  size="lg"
                  leftIcon={<FaShare />}
                >
                  {t("newscards.share_by_device", "Поделиться через устройство")}
                </Button>
              </>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShareModal;