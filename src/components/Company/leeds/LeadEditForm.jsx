import { Box, Button, Divider, FormControl, FormLabel, HStack, Select, Stack, Text, Textarea, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMessageCircle } from "react-icons/fi";

export const LeadEditForm = ({ lead, onUpdate, onCancel, isMobile, statusConfig }) => {
  const [formData, setFormData] = useState({
    name: lead.name,
    phoneNumber: lead.phoneNumber,
    comment: lead.comment,
    status: lead.status
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onUpdate({
        ...lead,
        ...formData
      });
    } catch (error) {
      console.error('Error updating lead:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const statusInfo = statusConfig[formData.status];
  const StatusIcon = statusInfo.icon;
  const { t } = useTranslation();
  return (
    <Box py={4}>
      <VStack spacing={6} align="stretch">
        <FormControl>
          <FormLabel>
            <HStack>
              <Box as={StatusIcon} />
              <Text>{t("Business_mode.Leeds.status", "Статус")}</Text>
            </HStack>
          </FormLabel>
          <Select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            focusBorderColor="#fed500"
          >
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>
            <HStack>
              <Box as={FiMessageCircle} />
              <Text>{t("Business_mode.Leeds.note", "Комментарий")}</Text>
            </HStack>
          </FormLabel>
          <Textarea
            placeholder={t("Business_mode.Leeds.comment_placeholder", "Введите комментарий...")}
            onChange={(e) => handleChange('comment', e.target.value)}
            focusBorderColor="#fed500"
            rows={4}
            minH={"100px"}
            maxH={'150px'}
          />
        </FormControl>

        <Divider />

        <Stack
          direction={isMobile ? "column" : "row"} 
          justify="flex-end" 
          spacing={3}
        >
          <Button
            variant="ghost" 
            onClick={onCancel}
            isDisabled={saving}
          >
            {t("Business_mode.document_section.cancel", "Отмена")}
          </Button>
          <Button
            onClick={handleSubmit}
            bg="#fed500"
            color="black"
            _hover={{ bg: "#e5bf00" }}
            _active={{ bg: "#d4aa00" }}
            isLoading={saving}
            loadingText={t("Business_mode.invoice_section.saving", "Сохранение")}
          >
            {t("Business_mode.invoice_section.save", "Сохранение")}
          </Button>
        </Stack>
      </VStack>
    </Box>
  );
};
