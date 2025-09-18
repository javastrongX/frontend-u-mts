import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  HStack,
  Icon,
  Circle,
  ModalHeader,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiPhone } from "react-icons/fi";
import { IoLogoWhatsapp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";

function ContactBottomModal({ text = "Not Available", type = 'phone', onClose, isOpen }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Memoize domain calculation
  const domain = useMemo(() => {
    return window.location.origin
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '');
  }, []);

  // Memoize shaped text function
  const shapedText = useCallback((text) => {
    return `${t('contactBottomModal.text', "Здравствуйте! Пишу вам через")} ${text} ${domain}`;
  }, [t, domain]);

  // Memoize trigger configuration
  const triggerConfig = useMemo(() => {
    if (type === 'phone') {
      return {
        label: t('contactBottomModal.phone', "Контакты"),
        icon: FiPhone,
        bgColor: "#fed500",
        iconColor: "black",
        iconSize: 5
      };
    }
    return {
      label: 'WhatsApp',
      icon: IoLogoWhatsapp,
      bgColor: "transparent",
      iconColor: "green.500",
      iconSize: 7
    };
  }, [type]);

  // Memoize click handler
  const handleClick = useCallback(() => {
    if (type === 'phone') {
      navigate(`tel:${text}`);
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shapedText(text))}`, "_blank");
    }
  }, [type, text, navigate, shapedText]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent
        borderRadius="15px 15px 0 0"
        position="absolute"
        bottom="0"
        width="100%"
        maxWidth="500px"
        mx="auto"
        p={4}
      >
        <ModalHeader>{triggerConfig.label}</ModalHeader>
        <ModalCloseButton size="lg" mt={2} mr={2} />
        <ModalBody mt={6}>
          <HStack spacing={4} onClick={handleClick} cursor="pointer">
            <Circle bg={triggerConfig.bgColor} size="40px">
              <Icon 
                as={triggerConfig.icon} 
                color={triggerConfig.iconColor} 
                boxSize={triggerConfig.iconSize} 
              />
            </Circle>
            <Text fontSize="lg" fontWeight="medium">
              {text}
            </Text>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button
            w="100%"
            bg="#fed500"
            color="black"
            _hover={{ bg: "#fcd000" }}
            onClick={onClose}
            borderRadius="md"
            fontWeight="semibold"
          >
            {t('contactBottomModal.cancel', "Отмена")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ContactBottomModal;