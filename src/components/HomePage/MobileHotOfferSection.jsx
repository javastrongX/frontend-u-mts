import {
  Box, Text, Spinner, Center,
  useBreakpointValue,
  Image
} from "@chakra-ui/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import { SortProductsByRank as sortProductsByRank  } from "./SortProductByRank";

const LIMIT = 20;

const MobileHotOfferSection = ({ 
  title, 
  accept = false, 
  shuffleProducts = false,
  categoryid,
  totalProducts,
  setTotalProducts = () => {},
  refreshKey = 0 // Refresh trigger uchun
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // URL dan kategoriya va sahifa raqamini olish
  const getParamsFromUrl = () => {
    const urlParams = new URLSearchParams(location.search);
    return {
      page: parseInt(urlParams.get('page')) || 1,
      category: parseInt(urlParams.get('category_id')) || categoryid || 0
    };
  };

  // Kategoriya state'i - URL dan yoki prop dan
  const [activeCategory, setActiveCategory] = useState(() => {
    const { category } = getParamsFromUrl();
    return category;
  });
  
  const [currentPageState, setCurrentPageState] = useState(() => {
    const { page } = getParamsFromUrl();
    return page;
  });

  const { t } = useTranslation();
  const observer = useRef();

  // Aniqlaymiz: bu mobile qurilma yoki yo'q
  const isMobile = useBreakpointValue({ base: true, custom900: false });

  const currentPage = currentPageState;
  const totalPages = Math.ceil(totalProducts / LIMIT);

  // URL parametrlarini kuzatish
  useEffect(() => {
    const { page, category } = getParamsFromUrl();
    
    if (page !== currentPageState) {
      setCurrentPageState(page);
    }
    
    if (category !== activeCategory) {
      setActiveCategory(category);
    }
  }, [location.search]);

  // Browser back/forward button uchun
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const pageFromUrl = parseInt(urlParams.get('page')) || 1;
      const categoryFromUrl = parseInt(urlParams.get('category_id')) || 0;
      setCurrentPageState(pageFromUrl);
      setActiveCategory(categoryFromUrl);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // refreshKey o'zgarganda ma'lumotlarni qayta yuklash
  useEffect(() => {
    if (refreshKey > 0) {
      // Ma'lumotlarni reset qilish
      setProducts([]);
      setOffset(0);
      setHasMore(true);
      
      // Qayta yuklash
      if (accept && !isMobile) {
        fetchProducts(currentPage, activeCategory);
      } else {
        fetchProducts(0, activeCategory);
      }
    }
  }, [refreshKey]);

  const fetchProducts = async (pageOrOffset, categoryId = activeCategory) => {
    setLoading(true);

    const currentOffset = accept && !isMobile
      ? (pageOrOffset - 1) * LIMIT
      : pageOrOffset;

    try {
      // Kategoriya parametrini qo'shish
      const categoryParam = categoryId ? `&category_id=${categoryId}` : '';
      const res = await fetch(`https://backend-u-mts.onrender.com/api/products/paginated?limit=${LIMIT}&offset=${currentOffset}${categoryParam}`);
      const data = await res.json();

      let productsToSet = data.products;

      // Shuffleni faqat oddiy cardlarga ishlatish uchun sortProductsByRank ishlatamiz
      if (shuffleProducts) {
        productsToSet = sortProductsByRank(productsToSet, true); // true = shuffle oddiy cardlarni
      } else {
        productsToSet = sortProductsByRank(productsToSet, false); // false = shuffle qilmaslik
      }

      if (accept && !isMobile) {
        setProducts(productsToSet); // sahifalash rejimi
      } else {
        // Infinite scroll uchun takrorlanuvchi ID'larni oldini olish
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = productsToSet.filter(p => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
        setHasMore(currentOffset + LIMIT < data.total);
        setOffset(currentOffset);
      }

      setTotalProducts(data.total);
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll uchun observer
  const lastProductElementRef = useCallback(node => {
    if (loading || !hasMore || (accept && !isMobile)) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchProducts(offset + LIMIT, activeCategory);
      }
    }, { threshold: 0.5 });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, offset, accept, isMobile, activeCategory]);

  // Sahifa o'zgarganda URL ni yangilash
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('page', newPage.toString());
      if (activeCategory > 0) {
        urlParams.set('category_id', activeCategory.toString());
      } else {
        urlParams.delete('category_id');
      }
      
      navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
      setCurrentPageState(newPage);
    }
  };

  // URL parametrlarini yangilash funksiyasi
  const updateUrlParams = useCallback((page = currentPage, category = activeCategory) => {
    const urlParams = new URLSearchParams(location.search);
    
    if (page > 1) {
      urlParams.set('page', page.toString());
    } else {
      urlParams.delete('page');
    }
    
    if (category > 0 && category <= 5) {
      urlParams.set('category_id', category.toString());
    } else {
      urlParams.delete('category_id');
    }
    
    const newUrl = `${location.pathname}?${urlParams.toString()}`;
    navigate(newUrl, { replace: true });
  }, [currentPage, activeCategory, location, navigate]);

  // Dastlabki yuklash va kategoriya o'zgarganda
  useEffect(() => {
    // URL ni yangilash
    updateUrlParams(currentPage, activeCategory);
    
    if (accept && !isMobile) {
      fetchProducts(currentPage, activeCategory); // sahifalash rejimi
    } else {
      // Infinite scroll uchun sahifa o'zgarganda barcha mahsulotlarni tozalash
      setProducts([]);
      setOffset(0);
      setHasMore(true);
      fetchProducts(0, activeCategory); // infinite scroll
    }
  }, [currentPage, accept, isMobile, activeCategory]);

  // categoryid prop o'zgarganda activeCategory ni yangilash
  useEffect(() => {
    if (categoryid !== undefined && categoryid !== activeCategory) {
      setActiveCategory(categoryid);
      setCurrentPageState(1);
      setProducts([]);
      setOffset(0);
      setHasMore(true);
    }
  }, [categoryid]);

  // Component mount bo'lganda URL dan ma'lumotlarni olish
  useEffect(() => {
    const { page, category } = getParamsFromUrl();
    
    if (category !== activeCategory) {
      setActiveCategory(category);
    }
    
    if (page !== currentPageState) {
      setCurrentPageState(page);
    }
  }, []);

  return (
    <Box display="grid" mt={3} gap={3}>
      <Text fontSize="16px" fontWeight="bold" mb={2}>
        {totalProducts} {title}
      </Text>

      {/* CategoryFilter o'chirildi - tashqaridan boshqariladi */}

      {/* Hech narsa topilmadi xabari */}
      {!loading && products.length === 0 && totalProducts === 0 && (
        <Center py={8} flexDirection="column" alignItems="center">
          <Image src="/Images/searchnot.jpg" w={'220px'} h={'220px'} />
          <Text color="gray.500" fontSize="16px" textAlign="center">
            {t("mobile_hot_offers.no_products_found", "Afsuski, hech narsa topilmadi")}
          </Text>
        </Center>
      )}

      {products.map((product, index) => {
        const uniqueKey = `${product.id}-${index}-${currentPage}-${activeCategory}-${refreshKey}`;
        
        if (!accept && isMobile && products.length === index + 1 && hasMore) {
          return (
            <Box ref={lastProductElementRef} key={uniqueKey}>
              <ProductCard product={product} />
            </Box>
          );
        } else {
          return <ProductCard key={uniqueKey} product={product} />;
        }
      })}

      {loading && (
        <Center py={4}>
          <Spinner size="md" color="orange.500" />
        </Center>
      )}

      {/* Sahifalash (desktop uchun) */}
      {!loading && (accept && !isMobile) && totalProducts > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={changePage}
        />
      )}

      {/* Infinite scroll tugadi xabari */}
      {!loading && !hasMore && !accept && isMobile && products.length > 0 && (
        <Center py={4} mb={20}>
          <Text color="gray.500">
            {t("mobile_hot_offers.downloaded_all_resources", "Все продукции загружена")} ¯\_(ツ)_/¯
          </Text>
        </Center>
      )}
    </Box>
  );
};

export default MobileHotOfferSection;
