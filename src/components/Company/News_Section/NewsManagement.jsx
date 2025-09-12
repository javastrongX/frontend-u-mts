import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Spinner,
  SimpleGrid,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { FiChevronLeft, FiPlus } from "react-icons/fi";
import NewsCard from "./NewsMobileCard/NewsCard";
import NewsTable from "./NewsMobileCard/NewsTable";
import UploadForm from "./UploadForm";
import { Pagination } from "./NewsPagination";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Mock data - 15 items for pagination demo
const MOCK_NEWS = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  title: `Новость ${index + 1}: ${
    [
      "Новая технология в спецтехнике",
      "Акция на спецтехнику",
      "Обзор рынка",
      "Новые модели",
      "Скидки",
    ][index % 5]
  }`,
  shortDescription: `Краткое описание новости ${index + 1}. ${
    [
      "Революционное решение для строительной индустрии",
      "Скидки до 30% на аренду экскаваторов",
      "Аналитический обзор текущего состояния",
      "Новые модели техники поступили в продажу",
      "Специальные предложения для клиентов",
    ][index % 5]
  }`,
  content: `Полное содержание новости ${index + 1}. Детальное описание...`,
  tags: [
    [
      "Технологии",
      "Новости",
      "Тест-драйвы и фоторепортажи",
      "Эксплуатация",
      "Лизинг",
    ],
    ["Акции", "Скидки"],
    ["Аналитика", "Рынок спецтехники"],
    ["Новости", "Обзоры"],
    ["Партнерские материалы", "Про аренду"],
  ][index % 5],
  image: "/Images/d-image.png",
  createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
  status: "published",
}));


// API Service Module (commented for mock usage)
/*
const newsAPI = {
  // Get paginated news
  async getNews(page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await fetch(`/api/news?${params}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      
      return await response.json();
      // Expected response: { data: [], total: number, page: number, totalPages: number }
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Create news
  async createNews(newsData, imageFile = null) {
    try {
      const formData = new FormData();
      formData.append('title', newsData.title);
      formData.append('shortDescription', newsData.shortDescription);
      formData.append('content', newsData.content);
      formData.append('tags', JSON.stringify(newsData.tags));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch('/api/news', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to create news');
      return await response.json();
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  },

  // Update news
  async updateNews(id, newsData, imageFile = null) {
    try {
      const formData = new FormData();
      formData.append('title', newsData.title);
      formData.append('shortDescription', newsData.shortDescription);
      formData.append('content', newsData.content);
      formData.append('tags', JSON.stringify(newsData.tags));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update news');
      return await response.json();
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  },

  // Delete news
  async deleteNews(id) {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete news');
      return await response.json();
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  }
};
*/

function FloatingButton({currentView, handleCreate}) {
  return (
    <Box
      position="fixed"
      bottom={"90px"}
      right="20px"
      zIndex="tooltip"
      display={{base: currentView === "list" ? "flex" : "none", custom570: "none"}}
    >
      <IconButton
        _focus={{
          transform: "rotate(180deg)",
        }}
        icon={<FiPlus color="#fff" size={34} />}
        colorScheme="yellow"
        bg={"#fed500"}
        borderRadius="50%"
        onClick={handleCreate}
        minH={"60px"}
        minW={"60px"}
      />
    </Box>
  );
}

// Main News Management Component
const NewsManagement = () => {
  const [news, setNews] = useState(MOCK_NEWS);
  const [currentView, setCurrentView] = useState("list");
  const [editingNews, setEditingNews] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    content: "",
    tags: [],
    image: [],
  });
  const navigate = useNavigate();
  const toast = useToast();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = React.useRef();
  const { t } = useTranslation();

  const NEWS_TAGS = [
    t("Business_mode.News_Section.categories.promotionsAndDiscounts", "Акции и скидки"),
    t("Business_mode.News_Section.categories.analytics", "Аналитика"),
    t("Business_mode.News_Section.categories.video", "Видео"),
    t("Business_mode.News_Section.categories.exhibitionsAndEvents", "Выставки и мероприятия"),
    t("Business_mode.News_Section.categories.legislation", "Законодательство"),
    t("Business_mode.News_Section.categories.greenTechnologies", "Зеленые технологии"),
    t("Business_mode.News_Section.categories.importSubstitutionAndLocalization", "Импортозамещение и локализация"),
    t("Business_mode.News_Section.categories.interestingFact", "Интересный факт"),
    t("Business_mode.News_Section.categories.infrastructure", "Инфраструктура"),
    t("Business_mode.News_Section.categories.careers", "Карьеры"),
    t("Business_mode.News_Section.categories.marketing", "Маркетинг"),
    t("Business_mode.News_Section.categories.specialEquipmentMarket", "Рынок спецтехники"),
    t("Business_mode.News_Section.categories.news", "Новости"),
    t("Business_mode.News_Section.categories.qserviceNews", "Новости Uzmat"),
    t("Business_mode.News_Section.categories.reviews", "Обзоры"),
    t("Business_mode.News_Section.categories.feedback", "Отзывы"),
    t("Business_mode.News_Section.categories.partnerMaterials", "Партнерские материалы"),
    t("Business_mode.News_Section.categories.aboutRent", "Про аренду"),
    t("Business_mode.News_Section.categories.serviceAndComponents", "Сервис и компоненты"),
    t("Business_mode.News_Section.categories.testDrivesAndPhotoReports", "Тест-драйвы и фоторепортажи"),
    t("Business_mode.News_Section.categories.operation", "Эксплуатация"),
    t("Business_mode.News_Section.categories.leasing", "Лизинг"),
  ];


  // Pagination logic
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = news.slice(startIndex, endIndex);

  // Memoized computed values
  const formattedNews = useMemo(() => {
    return currentNews.map((item) => ({
      ...item,
      formattedDate: new Date(item.createdAt).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  }, [currentNews]);

  // API Integration Functions (commented)
  /*
  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await newsAPI.getNews(currentPage, itemsPerPage);
      setNews(response.data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить новости',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [currentPage, itemsPerPage]);
  */

  // Form handlers
  const handleInputChange = useCallback(
    (field) => (e) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    },
    []
  );

  const handleTagToggle = useCallback((tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  // CRUD operations
  const handleCreate = useCallback(() => {
    setCurrentView("create");
    setFormData({
      title: "",
      shortDescription: "",
      content: "",
      tags: [],
      image: [],
    });
  }, []);

  const handleEdit = useCallback((newsItem) => {
    setEditingNews(newsItem);
    setCurrentView("edit");
    setFormData({
      title: newsItem.title,
      shortDescription: newsItem.shortDescription,
      content: newsItem.content,
      tags: newsItem.tags,
      image: [],
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.title.trim() || !formData.shortDescription.trim()) {
      toast({
        title: t("Business_mode.News_Section.error", "Ошибка"),
        description: t("Business_mode.News_Section.requiredFields", "Заполните обязательные поля"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      // API Integration (commented)
      /*
      if (editingNews) {
        await newsAPI.updateNews(editingNews.id, formData, formData.image[0]);
      } else {
        await newsAPI.createNews(formData, formData.image[0]);
      }
      await fetchNews();
      */

      // Mock implementation
      const newsData = {
        id: editingNews?.id || Date.now(),
        ...formData,
        createdAt: editingNews?.createdAt || new Date().toISOString(),
        status: "published",
        image:
          formData.image.length > 0
            ? URL.createObjectURL(formData.image[0])
            : "/Images/d-image/png",
      };

      setNews((prev) => {
        if (editingNews) {
          return prev.map((item) =>
            item.id === editingNews.id ? newsData : item
          );
        } else {
          return [newsData, ...prev];
        }
      });

      toast({
        title: t("Business_mode.News_Section.success", "Успешно"),
        description: editingNews ? t("Business_mode.News_Section.updated", "Новость обновлена") : t("Business_mode.News_Section.created", "Новость создана"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setCurrentView("list");
      setEditingNews(null);
    } catch (error) {
      toast({
        title: t("Business_mode.News_Section.error", "Ошибка"),
        description: editingNews ?  t("Business_mode.News_Section.failedToUpdate", "Не удалось обновить новость") : t("Business_mode.News_Section.failedToCreate", "Не удалось создать новость"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [formData, editingNews, toast]);

  const confirmDelete = useCallback(
    (id) => {
      setDeleteId(id);
      onDeleteOpen();
    },
    [onDeleteOpen]
  );

  const handleDelete = useCallback(async () => {
    setLoading(true);

    try {
      // API Integration (commented)
      /*
      await newsAPI.deleteNews(deleteId);
      await fetchNews();
      */

      // Mock implementation
      setNews((prev) => prev.filter((item) => item.id !== deleteId));

      toast({
        title: t("Business_mode.News_Section.success", "Успешно"),
        description: t("Business_mode.News_Section.deleted", "Новость успешно удалена"),
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("Business_mode.News_Section.error", "Ошибка"),
        description: t("Business_mode.News_Section.failedToDelete", "Не удалось удалить новость"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      onDeleteClose();
      setDeleteId(null);
    }
  }, [deleteId, toast, onDeleteClose]);

  // Render functions
  const renderListView = () => (
    <>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        mb={{base: 7, custom570: 12}}
        gap={7}
        borderBottom={{base: '1px solid', custom570: 'none'}}
        borderColor={'gray.300'}
      >
        <HStack 
          py={{base: 4, custom570: 0}}
          pt={{base: 0, custom570: 3}} 
          spacing={5} 
        >
          <IconButton
            icon={<FiChevronLeft size={30} />}
            colorScheme="yellow"
            variant={'ghost'}
            onClick={() => navigate(-1)}
            display={{ base: "flex", custom570: "none" }}
          />
          <Heading fontSize={{base: 'sm', sm: "18px", custom570: "20px", custom900: '22px'}} color="gray.800">
            {t("Business_mode.News_Section.saleAnnouncement", "Объявление о продаже спецтехники")}
          </Heading>
        </HStack>
        <Button
          leftIcon={<FiPlus />}
          display={{ base: "none", custom570: "flex" }}
          bg="#fed500"
          color="black"
          _hover={{ bg: "#e6c200" }}
          onClick={handleCreate}
          w={{ base: "full", md: "auto" }}
        >
          {t("Business_mode.News_Section.createNews", "Создать новость")}
        </Button>
      </Flex>

      {loading && (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" color="#fed500" />
        </Flex>
      )}

      {!loading && (
        <>
          {/* Desktop Table View */}
          <NewsTable
            formattedNews={formattedNews}
            handleEdit={handleEdit}
            confirmDelete={confirmDelete}
          />

          {/* Mobile/Tablet Card View */}
          <Box display={{ base: "block", lg: "none" }}>
            <SimpleGrid columns={{ base: 1, custom570: 2 }} spacing={4}>
              {formattedNews.map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={confirmDelete}
                />
              ))}
            </SimpleGrid>
          </Box>

          {/* Pagination */}
          <Box mt={8}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </Box>

          {/* Results info */}
          <Flex justify="center" mt={4}>
            <Text fontSize="sm" color="gray.600">
              {t("Business_mode.News_Section.shown", "Показано")} {startIndex + 1}-{Math.min(endIndex, news.length)} / {" "}
              {news.length} {t("Business_mode.News_Section.records", "записей")}
            </Text>
          </Flex>
        </>
      )}
    </>
  );

  const renderFormView = () => (
    <UploadForm
      setCurrentView={setCurrentView}
      currentView={currentView}
      formData={formData}
      handleInputChange={handleInputChange}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      handleTagToggle={handleTagToggle}
      NEWS_TAGS={NEWS_TAGS}
      loading={loading}
    />
  );

  return (
    <Box p={{ base: 4, md: 6 }} bg="#fff" minH="100vh" mx={2} borderRadius={'lg'} boxShadow={'lg'} mb={{base: '20px', custom570: 3}} mt={3}>
      <FloatingButton handleCreate={handleCreate} currentView={currentView} />
      <Box maxW="full" mx="auto">
        {currentView === "list" ? renderListView() : renderFormView()}
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent mx={4}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("Business_mode.News_Section.deleteNews", "Удалить новость")}
            </AlertDialogHeader>
            <AlertDialogBody>
              {t("Business_mode.News_Section.deleteConfirmation", "Вы уверены, что хотите удалить эту новость? Это действие нельзя отменить.")}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                {t("Business_mode.News_Section.cancel", "Отмена")}
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={loading}
                loadingText={t("Business_mode.News_Section.deleting", "Удаление...")}
              >
                {t("Business_mode.News_Section.delete", "Удалить")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default NewsManagement;
