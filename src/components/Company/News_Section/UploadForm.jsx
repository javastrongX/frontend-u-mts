import { Box, Button, Card, CardBody, Flex, FormControl, FormLabel, Heading, HStack, IconButton, Input, Spinner, Stack, Tag, TagLabel, Textarea, VStack, Wrap, WrapItem, Text, Badge, Image } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiDownload, FiUpload, FiX } from "react-icons/fi";


// File Upload Component
const FileUpload = ({ files = [], setFiles, maxFiles = 1 }) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const validateImageFile = useCallback((file) => {
    const allowedFormats = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
    
    if (!allowedFormats.includes(file.type)) {
      return {
        valid: false,
        error: `${file.name}: ${t("Business_mode.News_Section.uploadForm.supportedFormats", "Поддерживаются форматы SVG, PNG, JPG, JPEG")}`
      };
    }
    return { valid: true };
  }, []);

  const processFiles = useCallback(async (fileList) => {
    setUploading(true);
    const uploadedFiles = Array.from(fileList).slice(0, maxFiles);
    const validFiles = [];
    
    for (const file of uploadedFiles) {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      }
    }

    setTimeout(() => {
      if (validFiles.length > 0) {
        setFiles(validFiles.slice(0, maxFiles));
      }
      setUploading(false);
    }, 500);
  }, [validateImageFile, maxFiles, setFiles]);

  const handleFileUpload = useCallback(async (event) => {
    await processFiles(event.target.files);
  }, [processFiles]);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, [setFiles]);

  return (
    <VStack spacing={4} align="stretch">
      <Box
        border="3px dashed"
        borderColor={isDragging ? "blue.400" : "gray.300"}
        borderRadius="xl"
        p={8}
        textAlign="center"
        bg={isDragging ? "blue.50" : "gray.50"}
        position="relative"
        cursor="pointer"
        _hover={{ 
          bg: 'blue.50',
          borderColor: 'blue.400',
        }}
        transition="all 0.3s"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={maxFiles > 1}
          onChange={handleFileUpload}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer'
          }}
          accept=".jpg,.jpeg,.png,.svg"
        />
        
        <VStack spacing={4}>
          <Box
            p={4}
            bg="#fed500"
            borderRadius="full"
            h="60px"
            w="60px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {uploading ? (
              <Spinner color="black" size="lg" />
            ) : (
              isDragging ? (
                <FiDownload color="black" size={24} />
              ) : (
                <FiUpload color="black" size={24} />
              )
            )}
          </Box>
          <VStack spacing={2}>
            <Text color="gray.700" fontWeight="bold">
              {uploading ? t("Business_mode.Leeds.loading", "Загрузка...") : t("Business_mode.News_Section.uploadForm.clickToUpload", "Нажмите чтобы загрузить изображения")}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {t("Business_mode.News_Section.uploadForm.dragFiles", "или перетащите файлы сюда")}
            </Text>
            <Text fontSize="xs" color="gray.400">
              {t("Business_mode.News_Section.uploadForm.imageFormats", "SVG, PNG, JPG или JPEG (MAX. 800x600px)")}
            </Text>
          </VStack>
        </VStack>
      </Box>

      {Array.isArray(files) && files.length > 0 && (
        <HStack spacing={4}>
          {files.map((file, index) => (
            <Box key={index} position="relative">
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                w="100px"
                h="100px"
                objectFit="cover"
                borderRadius="md"
                border="2px solid"
                borderColor="gray.200"
              />
              <IconButton
                icon={<FiX />}
                size="xs"
                position="absolute"
                top={-2}
                right={-2}
                colorScheme="red"
                variant="solid"
                borderRadius="full"
                onClick={() => removeFile(index)}
              />
              <Badge
                position="absolute"
                bottom={2}
                left="50%"
                transform="translateX(-50%)"
                borderRadius={'5px'}
                bg="#fed500"
                color="black"
                fontSize="xs"
              >
                {t("Business_mode.News_Section.uploadForm.cover", "Обложка")}
              </Badge>
            </Box>
          ))}
        </HStack>
      )}
    </VStack>
  );
};

const UploadForm = ({
    setCurrentView,
    currentView,
    formData,
    handleInputChange,
    setFormData,
    handleSubmit,
    handleTagToggle,
    NEWS_TAGS,
    loading,
}) => {
  const { t } = useTranslation();
  return (
    <Box>
      <HStack mb={6}>
        <IconButton
          icon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => setCurrentView("list")}
        />
        <Heading size="lg" color="gray.800">
          {currentView === "create"
            ? t("Business_mode.News_Section.uploadForm.createNews", "Создание новости")
            : t("Business_mode.News_Section.uploadForm.editNews", "Редактирование новости")}
        </Heading>
      </HStack>

      <Card>
        <CardBody>
          <Stack spacing={6}>
            {/* Image Upload */}
            <FormControl>
              <FormLabel>{t("Business_mode.News_Section.uploadForm.newsCover", "Обложка новости")}</FormLabel>
              <FileUpload
                files={formData.image}
                setFiles={(files) =>
                  setFormData((prev) => ({ ...prev, image: files }))
                }
                maxFiles={1}
              />
            </FormControl>

            {/* Title */}
            <FormControl isRequired>
              <FormLabel>{t("Business_mode.News_Section.uploadForm.newsTitle", "Заголовок новости")}</FormLabel>
              <Input
                value={formData.title}
                onChange={handleInputChange("title")}
                placeholder={t("Business_mode.News_Section.uploadForm.enterTitle", "Введите заголовок")}
                size={{ base: "md", md: "lg" }}
              />
            </FormControl>

            {/* Short Description */}
            <FormControl isRequired>
              <FormLabel>{t("Business_mode.News_Section.uploadForm.shortDescription", "Короткое описание")}</FormLabel>
              <Textarea
                value={formData.shortDescription}
                onChange={handleInputChange("shortDescription")}
                placeholder={t("Business_mode.News_Section.uploadForm.maxChars", "Максимально 120 символов")}
                maxLength={120}
                resize="vertical"
                minH="100px"
                size={{ base: "md", md: "lg" }}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {formData.shortDescription.length}/120
              </Text>
            </FormControl>

            {/* Content */}
            <FormControl>
              <FormLabel>{t("Business_mode.News_Section.uploadForm.newsText", "Текст новости")}</FormLabel>
              <Textarea
                value={formData.content}
                onChange={handleInputChange("content")}
                placeholder={t("Business_mode.News_Section.uploadForm.fullText", "Полный текст новости")}
                resize="vertical"
                minH="150px"
                size={{ base: "md", md: "lg" }}
              />
            </FormControl>

            {/* Tags */}
            <FormControl isRequired>
              <FormLabel>{t("Business_mode.News_Section.uploadForm.enterTags", "Введите теги")}</FormLabel>
              <Wrap spacing={2}>
                {NEWS_TAGS.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag
                      size={{ base: "sm", md: "md" }}
                      bg={formData.tags.includes(tag) ? "#fed500" : "gray.100"}
                      color={formData.tags.includes(tag) ? "black" : "gray.600"}
                      cursor="pointer"
                      onClick={() => handleTagToggle(tag)}
                      _hover={{
                        bg: formData.tags.includes(tag)
                          ? "#e6c200"
                          : "gray.200",
                      }}
                    >
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              {formData.tags.length > 0 && (
                <Text fontSize="sm" color="gray.600" mt={2}>
                  {t("Business_mode.News_Section.uploadForm.selectedTags", "Выбрано тегов:")} {formData.tags.length}
                </Text>
              )}
            </FormControl>

            {/* Action Buttons */}
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              pt={4}
              gap={4}
            >
              <Button
                leftIcon={<FiArrowLeft />}
                variant="ghost"
                onClick={() => setCurrentView("list")}
                w={{ base: "full", md: "auto" }}
              >
                {t("Business_mode.News_Section.cancel", "Отмена")}
              </Button>
              <Button
                bg="#fed500"
                color="black"
                _hover={{ bg: "#e6c200" }}
                onClick={handleSubmit}
                isDisabled={
                  !formData.title.trim() || !formData.shortDescription.trim()
                }
                isLoading={loading}
                loadingText={
                  currentView === "create"
                    ? t("Business_mode.News_Section.uploadForm.creating", "Создание...")
                    : t("Business_mode.News_Section.uploadForm.saving", "Сохранение...")
                }
                w={{ base: "full", md: "auto" }}
              >
                {currentView === "create"
                  ? t("Business_mode.News_Section.uploadForm.publish", "Опубликовать")
                  : t("Business_mode.News_Section.uploadForm.saveChanges", "Сохранить изменения")}
              </Button>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default UploadForm;
