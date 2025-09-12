import { Box, Button, FormControl, FormLabel, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, Textarea, useToast, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFlag } from "react-icons/fa";



// Report Modal Component
export const ReportModal = ({ isOpen, onClose }) => {
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const toast = useToast();
  const { t } = useTranslation();
  
  const reportReasons = [
    t("report.reportReasons.scam", "Мошенничество, обман, ложное объявление"),
    t("report.reportReasons.spam", "Спам"),
    t("report.reportReasons.inappropriate", "Неподходящее содержимое"),
    t("report.reportReasons.breaking_rules", "Нарушение правил"),
    t("report.reportReasons.cloned_order", "Дублирование объявления"),
    t("report.reportReasons.error_price", "Ошибка в цене"),
    t("report.reportReasons.error_region_city", "Ошибка в регионе или городе"),
    t("report.reportReasons.inappropriate_photo", "Фото не соответствует"),
    t("report.reportReasons.others_content_photo", "Использованы чужие фотографии"),
    t("report.reportReasons.phone_not_work", "Телефон не отвечает или отключен"),
    t("report.reportReasons.someone_else_number", "Чужой номер"),
    t("report.reportReasons.sold_or_rented", "Продан или отдан в аренду"),
    t("report.reportReasons.other", "Другое")
  ];

  const handleSubmit = () => {
    if (!reportReason) {
      toast({
        title: t("report.select_reason", "Выберите причину жалобы"),
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: t("report.sent_report", "Жалоба отправлена"),
      description: t("report.sent_report_desc", "Мы рассмотрим вашу жалобу в ближайшее время"),
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setReportReason('');
    setReportDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent borderRadius="2xl" mx={4}>
        <ModalHeader pb={2}>
          <HStack spacing={3}>
            <Box p={2} bg="red.50" borderRadius="lg">
              <FaFlag color="#E53E3E" />
            </Box>
            <Text>{t("report.title", "Пожаловаться")}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">{t("report.reason_report", "Причина жалобы")}</FormLabel>
              <Select
                placeholder={t("report.select_reason", "Выберите причину")}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                borderRadius="xl"
              >
                {reportReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">{t("report.additional_inform", "Дополнительная информация")}</FormLabel>
              <Textarea
                placeholder={t("report.textarea_placeholder", "Опишите подробнее проблему...")}
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows={4}
                borderRadius="xl"
                resize="none"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button onClick={onClose} variant="ghost" color={"p.black"} borderRadius="xl">
            {t("report.cancel", "Отмена")}
          </Button>
          <Button
            onClick={handleSubmit}
            colorScheme="red"
            borderRadius="xl"
            px={6}
          >
            {t("report.sent_btn", "Отправить жалобу")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};