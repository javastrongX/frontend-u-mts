import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Tooltip,
  Progress,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiTrash2,
  FiDownload,
  FiUpload,
  FiFile,
  FiArrowLeft,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiInfo,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// File and storage limits
const FILE_LIMITS = {
  MAX_FILE_SIZE_MB: 100, // Maximum single file size in MB
  MAX_TOTAL_SIZE_GB: 5, // Maximum total storage per user in GB
  MAX_FILES_COUNT: 100, // Maximum number of files per user
};

// Mock data
const initialDocuments = [
  { id: 1, name: "nimadir", size: 0.02, unit: "MB", uploadDate: new Date() },
  {
    id: 2,
    name: "contract.pdf",
    size: 2.5,
    unit: "MB",
    uploadDate: new Date(),
  },
  { id: 3, name: "report.docx", size: 1.8, unit: "MB", uploadDate: new Date() },
  {
    id: 4,
    name: "presentation.pptx",
    size: 5.2,
    unit: "MB",
    uploadDate: new Date(),
  },
  { id: 5, name: "budget.xlsx", size: 0.8, unit: "MB", uploadDate: new Date() },
//   { id: 6, name: "budget.xlsx", size: 0.8, unit: "MB", uploadDate: new Date() },
//   { id: 7, name: "budget.xlsx", size: 0.8, unit: "MB", uploadDate: new Date() },
//   { id: 8, name: "budget.xlsx", size: 0.8, unit: "MB", uploadDate: new Date() },
//   { id: 9, name: "budget.xlsx", size: 0.8, unit: "MB", uploadDate: new Date() },
//   { id: 10, name: "budget.xlsx", size: 0.8, unit: "MB", uploadDate: new Date() },
//   { id: 11, name: "budget.xlsx", size: 0.8, unit: "MB", uploadDate: new Date() },
];

const calculateTotalSize = (documents) => {
  return documents.reduce((total, doc) => total + doc.size, 0);
};

// Components
const StorageInfo = ({ documents }) => {
  const totalSizeMB = calculateTotalSize(documents);
  const totalSizeGB = totalSizeMB / 1024;
  const usagePercentage = (totalSizeGB / FILE_LIMITS.MAX_TOTAL_SIZE_GB) * 100;
  const filesCount = documents.length;
  const filesPercentage = (filesCount / FILE_LIMITS.MAX_FILES_COUNT) * 100;

  const { t } = useTranslation();

  return (
    <Box p={4} bg="gray.50" borderRadius="8px" border="1px solid #E2E8F0">
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            {t("Business_mode.document_section.memory", "Хранилище")}
          </Text>
          <Tooltip label={t("Business_mode.document_section.info", "Информация о лимитах")}>
            <Box color="gray.500">
              <FiInfo />
            </Box>
          </Tooltip>
        </HStack>
        
        <VStack spacing={2} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="xs" color="gray.600">
              {t("Business_mode.document_section.size", "Объем:")} {totalSizeGB.toFixed(2)} GB / {FILE_LIMITS.MAX_TOTAL_SIZE_GB} GB
            </Text>
            <Text fontSize="xs" color={usagePercentage > 90 ? "red.500" : "gray.600"}>
              {usagePercentage.toFixed(1)}%
            </Text>
          </HStack>
          <Progress 
            value={usagePercentage} 
            size="sm" 
            colorScheme={usagePercentage > 90 ? "red" : usagePercentage > 70 ? "yellow" : "green"}
            bg="gray.200"
          />
        </VStack>

        <VStack spacing={2} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="xs" color="gray.600">
              {t("Business_mode.document_section.files", "Файлов:")} {filesCount} / {FILE_LIMITS.MAX_FILES_COUNT}
            </Text>
            <Text fontSize="xs" color={filesPercentage > 90 ? "red.500" : "gray.600"}>
              {filesPercentage.toFixed(1)}%
            </Text>
          </HStack>
          <Progress 
            value={filesPercentage} 
            size="sm" 
            colorScheme={filesPercentage > 90 ? "red" : filesPercentage > 70 ? "yellow" : "green"}
            bg="gray.200"
          />
        </VStack>

        <VStack spacing={1} align="start">
          <Text fontSize="xs" color="gray.500">
            {t("Business_mode.document_section.limit", "Лимиты:")}
          </Text>
          <Text fontSize="xs" color="gray.500">
            • {t("Business_mode.document_section.max_size", "Максимальный размер файла:")} {FILE_LIMITS.MAX_FILE_SIZE_MB} MB
          </Text>
          <Text fontSize="xs" color="gray.500">
            • {t("Business_mode.document_section.total_size", "Общий объем:")} {FILE_LIMITS.MAX_TOTAL_SIZE_GB} GB
          </Text>
          <Text fontSize="xs" color="gray.500">
            • {t("Business_mode.document_section.quantity_files", "Количество файлов:")} {FILE_LIMITS.MAX_FILES_COUNT}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

const SearchInput = ({ value, onChange, placeholder }) => (
  <InputGroup maxW="400px">
    <InputLeftElement pointerEvents="none">
      <FiSearch color="#9CA3AF" />
    </InputLeftElement>
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      bg="white"
      border="1px solid #E2E8F0"
      _hover={{ borderColor: "#fed500" }}
      _focus={{ borderColor: "#fed500", boxShadow: "0 0 0 1px #fed500" }}
    />
  </InputGroup>
);

const DocumentIcon = () => (
  <Box
    w="48px"
    h="48px"
    bg="#fed500"
    borderRadius="8px"
    display="flex"
    alignItems="center"
    justifyContent="center"
    color="white"
    fontSize="24px"
  >
    <FiFile />
  </Box>
);

const DocumentItem = ({ document, onDelete, onDownload, t }) => (
  <Flex
    align="center"
    justify="space-between"
    p={4}
    bg="white"
    borderRadius="8px"
    border="1px solid #E2E8F0"
    _hover={{ borderColor: "#fed500", shadow: "sm" }}
    transition="all 0.2s"
  >
    <HStack spacing={3} flex={1}>
      <DocumentIcon />
      <VStack align="start" spacing={0} flex={1}>
        <Text fontWeight="medium" fontSize="sm" color="gray.800">
          {document.name}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {document.size} {document.unit}
        </Text>
      </VStack>
    </HStack>

    <HStack spacing={2}>
      <Tooltip label={t("Business_mode.document_section.download", "Скачать")}>
        <IconButton
          icon={<FiDownload />}
          size="sm"
          variant="ghost"
          colorScheme="blue"
          color={"blue.400"}
          onClick={() => onDownload(document)}
        />
      </Tooltip>
      <Tooltip label={t("Business_mode.document_section.delete", "Удалить")}>
        <IconButton
          icon={<FiTrash2 />}
          size="sm"
          variant="ghost"
          colorScheme="red"
          onClick={() => onDelete(document)}
        />
      </Tooltip>
    </HStack>
  </Flex>
);

const EmptyState = ({ onUpload, t }) => (
  <VStack spacing={6} py={16} textAlign="center">
    <Box
      w="80px"
      h="80px"
      bg="#fed500"
      borderRadius="16px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="white"
      fontSize="32px"
    >
      <FiFile />
    </Box>
    <VStack spacing={2}>
      <Heading size="md" color="gray.700">
        {t("Business_mode.document_section.doc_notAvailable", "Документы компании пока отсутствуют")}
      </Heading>
      <Text color="gray.500" maxW="400px">
        {t("Business_mode.document_section.doc_notAvailable_desc", `На данный момент у вас нет загруженных документов компании. Добавьте
        сюда сертификаты, лицензии и другие важные документы, чтобы всегда иметь
        к ним быстрый доступ и сохранить их в безопасности.`)}
      </Text>
    </VStack>
  </VStack>
);

const DeleteModal = ({ isOpen, onClose, document, onConfirm, t }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent mx={2}>
      <ModalHeader>{t("Business_mode.document_section.delete_doc", "Удалить документ")}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>
          {t("Business_mode.document_section.delete_doc_desc", "Вы действительно хотите удалить файл? Это действие невозможно отменить.")} <strong>{document?.name}</strong> 
        </Text>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" mr={3} onClick={onClose}>
          {t("Business_mode.document_section.cancel", "Отмена")}
        </Button>
        <Button colorScheme="red" onClick={onConfirm}>
          {t("Business_mode.document_section.delete", "Удалить")}
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

const UploadModal = ({ isOpen, onClose, onUpload, documents, t }) => {
  const [documentName, setDocumentName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  const totalSizeMB = calculateTotalSize(documents);
  const totalSizeGB = totalSizeMB / 1024;
  const filesCount = documents.length;
  const validateFile = (file) => {
    setError("");

    // Check file count limit
    if (filesCount >= FILE_LIMITS.MAX_FILES_COUNT) {
      setError(`${t("Business_mode.document_section.upload_limit_1", "Максимальное количество файлов")} (${FILE_LIMITS.MAX_FILES_COUNT}) ${t("Business_mode.document_section.upload_limit_2", "превышено")}`);
      return false;
    }

    // Check file size limit
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > FILE_LIMITS.MAX_FILE_SIZE_MB) {
      setError(`${t("Business_mode.document_section.upload_limit_3", "Размер файла превышает")} ${FILE_LIMITS.MAX_FILE_SIZE_MB} ${t("Business_mode.document_section.upload_limit_4", "MB.")} ${t("Business_mode.document_section.upload_limit_5", "Текущий размер:")} ${fileSizeMB.toFixed(2)} MB`);
      return false;
    }

    // Check total storage limit
    const newTotalSizeGB = (totalSizeMB + fileSizeMB) / 1024;
    if (newTotalSizeGB > FILE_LIMITS.MAX_TOTAL_SIZE_GB) {
      const remainingSpaceGB = FILE_LIMITS.MAX_TOTAL_SIZE_GB - totalSizeGB;
      setError(`${t("Business_mode.document_section.no_freeSpace_1", "Недостаточно места. Доступно:")} ${remainingSpaceGB.toFixed(2)} GB, {t("Business_mode.document_section.no_freeSpace_2", "требуется:")} ${(fileSizeMB / 1024).toFixed(2)} GB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
        if (!documentName) {
          setDocumentName(file.name);
        }
      } else {
        event.target.value = "";
      }
    }
  };

  const handleSubmit = () => {
    if (documentName && selectedFile) {
      if (validateFile(selectedFile)) {
        onUpload({
          name: documentName,
          file: selectedFile,
          size: (selectedFile.size / 1024 / 1024).toFixed(3),
          unit: "MB",
        });
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setDocumentName("");
    setSelectedFile(null);
    setError("");
    onClose();
  };

  const canUpload = filesCount < FILE_LIMITS.MAX_FILES_COUNT && 
                   totalSizeGB < FILE_LIMITS.MAX_TOTAL_SIZE_GB;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent mx={2}>
        <ModalHeader>{t("Business_mode.document_section.add_doc", "Добавить документ")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {!canUpload && (
              <Alert status="warning">
                <AlertIcon />
                <Box>
                  <AlertTitle>{t("Business_mode.document_section.up_limit", "Лимит превышен!")}</AlertTitle>
                  <AlertDescription>
                    {filesCount >= FILE_LIMITS.MAX_FILES_COUNT 
                      ? t("Business_mode.document_section.max_files_amout", "Достигнуто максимальное количество файлов")
                      : t("Business_mode.document_section.no_space", "Недостаточно места в хранилище")}
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            <Box w="full" p={3} bg="gray.50" borderRadius="md" fontSize="sm">
              <VStack spacing={1} align="start" color="gray.600">
                <Text fontWeight="medium">{t("Business_mode.document_section.apply_limit", "Текущие лимиты:")}</Text>
                <Text>• {t("Business_mode.document_section.files", "Файлов:")} {filesCount}/{FILE_LIMITS.MAX_FILES_COUNT}</Text>
                <Text>• {t("Business_mode.document_section.memory", "Хранилище:")} {totalSizeGB.toFixed(2)}/{FILE_LIMITS.MAX_TOTAL_SIZE_GB} GB</Text>
                <Text>• {t("Business_mode.document_section.max_size", "Макс. размер файла:")} {FILE_LIMITS.MAX_FILE_SIZE_MB} MB</Text>
              </VStack>
            </Box>

            <FormControl>
              <FormLabel>{t("Business_mode.document_section.doc_name", "Название документа")}</FormLabel>
              <Input
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder={t("Business_mode.document_section.enter_doc_name", "Введите название документа")}
                _focus={{
                  borderColor: "#fed500",
                  boxShadow: "0 0 0 1px #fed500",
                }}
                isDisabled={!canUpload}
              />
            </FormControl>

            <FormControl>
              <FormLabel>{t("Business_mode.document_section.select_file", "Выберите файл")}</FormLabel>
              <Button
                leftIcon={<FiUpload />}
                onClick={() => canUpload && fileInputRef.current?.click()}
                bg={canUpload ? "blue.400" : "gray.400"}
                color="white"
                _hover={{ bg: canUpload ? "blue.300" : "gray.400" }}
                width="full"
                isDisabled={!canUpload}
                cursor={canUpload ? "pointer" : "not-allowed"}
              >
                {selectedFile ? selectedFile.name : t("Business_mode.document_section.select", "Выберите файл")}
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                display="none"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.png"
              />
              {selectedFile && (
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {t("Business_mode.document_section.size", "Объем:")} {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              )}
            </FormControl>

            {error && (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription fontSize="sm">{error}</AlertDescription>
              </Alert>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            {t("Business_mode.document_section.cancel", "Отмена")}
          </Button>
          <Button
            bg="#fed500"
            color="white"
            _hover={{ bg: "#e6c200" }}
            onClick={handleSubmit}
            isDisabled={!documentName || !selectedFile || !canUpload || error}
          >
            {t("Business_mode.document_section.add", "Добавить")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <Flex justify="center" align="center" mt={6} gap={2}>
      <IconButton
        icon={<FiChevronLeft />}
        size="sm"
        isDisabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        variant="outline"
      />

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          size="sm"
          variant={currentPage === page ? "solid" : "outline"}
          bg={currentPage === page ? "#fed500" : "white"}
          color={currentPage === page ? "white" : "gray.700"}
          _hover={{
            bg: currentPage === page ? "#e6c200" : "gray.50",
          }}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <IconButton
        icon={<FiChevronRight />}
        size="sm"
        isDisabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        variant="outline"
      />
    </Flex>
  );
};

// Main Component
const DocumentManager = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const { t } = useTranslation();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();

  const toast = useToast();
  const documentsPerPage = 10;

  // Filter documents based on search
  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigate = useNavigate();

  // Pagination logic
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + documentsPerPage
  );

  // Check limits before opening upload modal
  const handleUploadClick = () => {
    const totalSizeMB = calculateTotalSize(documents);
    const totalSizeGB = totalSizeMB / 1024;
    const filesCount = documents.length;

    if (filesCount >= FILE_LIMITS.MAX_FILES_COUNT) {
      toast({
        title: t("Business_mode.document_section.main.limitExceeded", "Лимит превышен"),
        description: `${t("Business_mode.document_section.main.maxFilesReached", "Достигнуто максимальное количество файлов")}(${FILE_LIMITS.MAX_FILES_COUNT})`,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (totalSizeGB >= FILE_LIMITS.MAX_TOTAL_SIZE_GB) {
      toast({
        title: t("Business_mode.document_section.main.storageFull", "Хранилище заполнено"),
        description: `${t("Business_mode.document_section.main.storageLimitReached_1", "Достигнут лимит хранилища")} (${FILE_LIMITS.MAX_TOTAL_SIZE_GB} ${t("Business_mode.document_section.main.storageLimitReached_2", "GB")})`,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    onUploadOpen();
  };

  // API Integration placeholders (commented for future use)
  const handleUpload = async (documentData) => {
    // try {
    //   const formData = new FormData();
    //   formData.append('file', documentData.file);
    //   formData.append('name', documentData.name);
    //
    //   const response = await fetch('/api/documents', {
    //     method: 'POST',
    //     body: formData
    //   });
    //
    //   if (response.ok) {
    //     const newDocument = await response.json();
    //     setDocuments(prev => [...prev, newDocument]);
    //   }
    // } catch (error) {
    //   console.error('Upload error:', error);
    // }

    // Mock implementation
    const newDocument = {
      id: Date.now(),
      name: documentData.name,
      size: parseFloat(documentData.size),
      unit: documentData.unit,
      uploadDate: new Date(),
    };

    setDocuments((prev) => [...prev, newDocument]);
    toast({
      title: t("Business_mode.document_section.main.uploadedSuccessfully", "Успешно загружено"),
      description: `${documentData.name} ${t("Business_mode.document_section.main.fileAdded", "успешно добавлен")}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = async (document) => {
    // try {
    //   await fetch(`/api/documents/${document.id}`, {
    //     method: 'DELETE'
    //   });
    //   setDocuments(prev => prev.filter(doc => doc.id !== document.id));
    // } catch (error) {
    //   console.error('Delete error:', error);
    // }

    // Mock implementation
    setDocuments((prev) => prev.filter((doc) => doc.id !== document.id));
    toast({
      title: t("Business_mode.document_section.main.deletedSuccessfully", "Успешно удалено"),
      description: `${document.name} ${t("Business_mode.document_section.main.fileDeleted", "успешно удален")}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    onDeleteClose();
  };

  const handleDownload = (document) => {
    // try {
    //   const response = await fetch(`/api/documents/${document.id}/download`);
    //   const blob = await response.blob();
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = document.name;
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    // } catch (error) {
    //   console.error('Download error:', error);
    // }

    // Mock implementation
    toast({
      title: t("Business_mode.document_section.main.downloading", "Загрузка"),
      description: `${document.name} ${t("Business_mode.document_section.main.fileDownloading", "успешно загружается...")}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const openDeleteModal = (document) => {
    setSelectedDocument(document);
    onDeleteOpen();
  };

  return (
    <>
      <Flex align="center" justify="space-between" flexWrap="wrap" gap={4} mb={4}>
        <HStack spacing={3}>
          <IconButton
            icon={<FiArrowLeft />}
            variant="ghost"
            colorScheme="yellow"
            border={'1px solid transparent'}
            _hover={{borderColor: "#fed500"}}
            fontSize={'20px'}
            onClick={() => navigate(-1)}
          />
          <Heading fontSize={'20px'} color="gray.800">
            {t("Business_mode.document_section.main.documents", "Документы")}
          </Heading>
        </HStack>
      </Flex>
      <Box
        maxW="full"
        minH="100vh"
        bg="#fff"
        p={3}
        borderRadius={"lg"}
        boxShadow="md"
        border={"1px solid #fed500"}
      >
        {/* Header */}
        <VStack spacing={6} align="stretch">
          {/* Storage Info */}
          <StorageInfo documents={documents} />

          {/* Search and Upload */}
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("Business_mode.document_section.main.searchPlaceholder", "Поиск...")}
            />
            <Button
              leftIcon={<FiPlus />}
              bg="blue.400"
              color="white"
              _hover={{ bg: "blue.300" }}
              onClick={handleUploadClick}
            >
              {t("Business_mode.document_section.main.uploadFile", "Загрузить файл")}
            </Button>
          </Flex>

          {/* Content */}
          {paginatedDocuments.length === 0 ? (
            searchQuery ? (
              <Alert status="info" bg="white" border="1px solid #E2E8F0">
                <AlertIcon color="#fed500" />
                <Box>
                  <AlertTitle>{t("Business_mode.document_section.main.nothingFound", "Ничего не найдено!")}</AlertTitle>
                  <AlertDescription>
                    "{searchQuery}" {t("Business_mode.document_section.main.noDocumentsFound", "Нет документов по данному запросу.")}
                  </AlertDescription>
                </Box>
              </Alert>
            ) : (
              <EmptyState onUpload={handleUploadClick} t={t} />
            )
          ) : (
            <>
              <VStack spacing={3} align="stretch">
                {paginatedDocuments.map((document) => (
                  <DocumentItem
                    key={document.id}
                    document={document}
                    onDelete={openDeleteModal}
                    onDownload={handleDownload}
                    t={t}
                  />
                ))}
              </VStack>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </VStack>

        {/* Modals */}
        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          document={selectedDocument}
          onConfirm={() => handleDelete(selectedDocument)}
          t={t}
        />

        <UploadModal
          isOpen={isUploadOpen}
          onClose={onUploadClose}
          onUpload={handleUpload}
          documents={documents}
          t={t}
        />
      </Box>
    </>
  );
};

export default DocumentManager;