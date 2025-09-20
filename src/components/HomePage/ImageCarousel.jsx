import { Box, Image, Spinner } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCube } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-cube";
import { useState, useEffect, useMemo } from "react";

// Mock data
const mockImages = [
  { id: 1, imageUrl: "/carousel/1-rasm.jpg", alt: "Excavator" },
  { id: 2, imageUrl: "/carousel/2-rasm.jpg", alt: "Uzmat" },
  { id: 3, imageUrl: "/carousel/3-rasm.jpg", alt: "UZMAT" },
  { id: 4, imageUrl: "/carousel/4-rasm.jpg", alt: "UZMAT" },
  { id: 5, imageUrl: "/carousel/5-rasm.jpg", alt: "UZMAT" },
  { id: 6, imageUrl: "/carousel/6-rasm.png", alt: "UZMAT" },
];

const ImageCarousel = () => {
  const [images, setImages] = useState(mockImages);
  const [loading, setLoading] = useState(false);

  // Memoized calculations for loop capability
  const { canLoopMobile, canLoopDesktop, desktopSlidesPerGroup } = useMemo(() => {
    const imageCount = images.length;
    const canLoopMobile = imageCount >= 3;
    const canLoopDesktop = imageCount >= 4;
    const desktopSlidesPerGroup = canLoopDesktop ? 2 : 1;
    return { canLoopMobile, canLoopDesktop, desktopSlidesPerGroup };
  }, [images.length]);

  // Real API integration (commented out)
  /*
  useEffect(() => {
    setLoading(true);
    axios.get("/api/carousel")
      .then((res) => {
        setImages(res.data);
      })
      .catch((err) => {
        console.error("API xatosi:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  */

  if (loading) {
    return (
      <Box w="100%" textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box w="100%" py={6}>
      <style>{`
        /* Mobile styles - Cube effect */
        @media (max-width: 900px) {
          .mobile-cube-carousel {
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            max-width: 100%;
            margin: 0 auto;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            cursor: grab;
          }
          .mobile-cube-carousel:active {
            cursor: grabbing;
          }
          .mobile-cube-carousel .swiper-slide {
            background: transparent !important;
            border-radius: 15px;
            overflow: hidden;
          }
          .mobile-cube-carousel .swiper-cube-shadow {
            background: rgba(0, 0, 0, 0.15) !important;
            border-radius: 15px;
          }
          .mobile-cube-carousel .swiper-slide-shadow-left,
          .mobile-cube-carousel .swiper-slide-shadow-right,
          .mobile-cube-carousel .swiper-slide-shadow-top,
          .mobile-cube-carousel .swiper-slide-shadow-bottom {
            background: linear-gradient(to transparent, rgba(0, 0, 0, 0.1)) !important;
            border-radius: 15px;
          }
          .mobile-pagination {
            position: relative !important;
            margin-top: 20px !important;
            text-align: center;
          }
          .mobile-pagination .swiper-pagination-bullet {
            width: 12px !important;
            height: 12px !important;
            background: rgba(108, 117, 125, 0.4) !important;
            border: 2px solid #6c757d !important;
            opacity: 1 !important;
            margin: 0 6px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .mobile-pagination .swiper-pagination-bullet-active {
            background: #495057 !important;
            transform: scale(1.2) !important;
            box-shadow: 0 0 15px rgba(73, 80, 87, 0.5) !important;
          }
        }
        /* Desktop styles - 2 slides */
        @media (min-width: 900px) {
          .desktop-carousel {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 25px;
            padding: 30px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
            max-width: 1000px;
            margin: 0 auto;
            position: relative;
            overflow: hidden;
            cursor: grab;
          }
          .desktop-carousel:active {
            cursor: grabbing;
          }
          .desktop-carousel::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
            z-index: -1;
          }
          .desktop-slide {
            padding: 0 10px;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .desktop-slide:hover {
            transform: translateY(-5px);
          }
          .desktop-pagination {
            position: relative !important;
            margin-top: 25px !important;
            text-align: center;
          }
          .desktop-pagination .swiper-pagination-bullet {
            width: 14px !important;
            height: 14px !important;
            background: rgba(102, 126, 234, 0.3) !important;
            border: none !important;
            opacity: 1 !important;
            margin: 0 8px !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            border-radius: 50% !important;
          }
          .desktop-pagination .swiper-pagination-bullet-active {
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%) !important;
            transform: scale(1.3) !important;
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.6) !important;
          }
          .desktop-pagination .swiper-pagination-bullet:hover {
            transform: scale(1.15) !important;
            background: rgba(102, 126, 234, 0.6) !important;
          }
        }
        .image-container {
          position: relative;
          overflow: hidden;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          background: #f8f9fa;
        }
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .image-container:hover .image-overlay {
          opacity: 1;
        }
        /* Performance optimizations: will-change faqat hover paytida */
        .desktop-slide:hover,
        .image-container:hover img {
          will-change: transform, filter;
        }
      `}</style>

      {/* Mobile Carousel */}
      <Box display={{ base: 'block', custom900: 'none' }}>
        <Swiper
          modules={[Autoplay, Pagination, EffectCube]}
          effect="cube"
          cubeEffect={{
            shadow: true,
            slideShadows: true,
            shadowOffset: 15,
            shadowScale: 0.96,
          }}
          spaceBetween={0}
          slidesPerView={1}
          loop={false}
          pagination={{
            clickable: true,
            type: "bullets",
            el: ".mobile-pagination"
          }}
          autoplay={canLoopMobile ? {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false}
          speed={800}
          className="mobile-cube-carousel"
          grabCursor={true}
        >
          {images.map((item) => (
            <SwiperSlide key={`mobile-${item.id}`}>
              <div className="image-container">
                <Image
                  src={item.imageUrl || "/Images/d-image.png"}
                  alt={item.alt}
                  w="100%"
                  h="300px"
                  objectFit="cover"
                  borderRadius="15px"
                  filter="brightness(1.05) contrast(1.1)"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  loading="lazy"
                />
                <div className="image-overlay" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mobile-pagination"></div>
      </Box>

      {/* Desktop Carousel */}
      <Box display={{ base: 'none', custom900: 'block' }}>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={2}
          slidesPerGroup={desktopSlidesPerGroup}
          loop={false}
          pagination={{
            clickable: true,
            type: "bullets",
            el: ".desktop-pagination"
          }}
          autoplay={canLoopDesktop ? {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false}
          speed={1000}
          className="desktop-carousel"
          grabCursor={true}
          breakpoints={{
            901: {
              slidesPerView: 2,
              slidesPerGroup: desktopSlidesPerGroup,
            },
            1200: {
              slidesPerView: 2,
              slidesPerGroup: desktopSlidesPerGroup,
              spaceBetween: 25,
            },
          }}
        >
          {images.map((item) => (
            <SwiperSlide key={`desktop-${item.id}`} className="desktop-slide">
              <div className="image-container">
                <Image
                  src={item.imageUrl || "/Images/d-image.png"}
                  alt={item.alt}
                  w="100%"
                  h="320px"
                  objectFit="cover"
                  borderRadius="15px"
                  filter="brightness(1.02) contrast(1.08)"
                  transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  loading="lazy"
                  _hover={{
                    filter: "brightness(1.08) contrast(1.12)",
                    transform: "scale(1.02)"
                  }}
                />
                <div className="image-overlay" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="desktop-pagination"></div>
      </Box>
    </Box>
  );
};

export default ImageCarousel;
