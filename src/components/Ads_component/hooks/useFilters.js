import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useFilters = ( tabLabels, activeTab) => {
  const { t } = useTranslation();
  const [selectedFilters, setSelectedFilters] = useState({
    cities: [],
    types: [],
    brands: []
  });

  
  const filtersData = {
    [t("filter_block.all" ,"Все")]: {
      cities: {
        visible: ["Алматы", "Астана", "Шымкент", "Актау", "Актобе", "Кызылорда", "Мангистау", "Павлодар"],
        hidden: [
          "Ганюшкино", "Георгиевка", "Глубокое", "Гранитогорск", "Гульшад", "Гульдала", "Габидена Мустафина",
          "Джалтыр", "Дарьинское", "Достык", "Другое", "Дарьинский", "Державинск", "Доссор", "Денисовка", "Деркул",
          "Егиндыколь", "Егиндыбулак", "Ерейментау", "Есиль", "Ескене", "Есик"
        ]
      },
      types: {
        visible: ["Экскаваторы-погрузчики", "Бульдозеры", "Гусеничные экскаваторы"],
        hidden: ["Автокраны", "Асфальтоукладчики", "Автобетоносмесители", "Виброкатки", "Грейдеры"]
      },
      brands: {
        visible: ["CATERPILLAR", "KOMATSU", "SHANTUI", "SHEHWA / HBXG", "ЧЕТРА", "ЧТЗ-УРАЛТРАК"],
        hidden: ["HITACHI", "VOLVO", "LIEBHERR", "DOOSAN", "HYUNDAI", "XCMG"]
      }
    },
    [t("filter_block.sell_special_tech", "Продажа спецтехники")]: {
      cities: {
        visible: ["Алматы", "Актобе", "Астана"],
        hidden: ["Караганда", "Шымкент", "Тараз"]
      },
      types: {
        visible: ["Продажа Тип 1", "Продажа Тип 2"],
        hidden: ["Продажа Тип 3", "Продажа Тип 4"]
      },
      brands: {
        visible: ["Продажа Бренд А", "Продажа Бренд Б"],
        hidden: ["Продажа Бренд В", "Продажа Бренд Г"]
      }
    },
    [t("filter_block.rent", "Аренда спецтехники")]: {
      cities: {
        visible: ["Астана", "Шымкент"],
        hidden: ["Актобе", "Тараз"]
      },
      types: {
        visible: ["Аренда Тип 1", "Аренда Тип 2"],
        hidden: ["Аренда Тип 3"]
      },
      brands: {
        visible: ["Аренда Бренд А", "Аренда Бренд Б"],
        hidden: ["Аренда Бренд В"]
      }
    },
    [t("filter_block.spare_parts", "Запчасти")]: {
      cities: {
        visible: ["Кызылорда"],
        hidden: ["Шымкент", "Тараз"]
      },
      types: {
        visible: ["Запчасти Тип 1"],
        hidden: ["Запчасти Тип 2"]
      },
      brands: {
        visible: ["Запчасти Бренд А"],
        hidden: ["Запчасти Бренд Б"]
      }
    },
    [t("filter_block.repair", "Ремонт")]: {
      cities: {
        visible: ["Павлодар"],
        hidden: ["Караганда"]
      },
      profession: {
        visible: ["Ремонт Тип 1"],
        hidden: ["Ремонт Тип 2"]
      }
    },
    [t("filter_block.drivers", "Водители")]: {
      cities: {
        visible: ["Мангистау"],
        hidden: ["Актау"]
      },
      types: {
        visible: ["Водители Тип 1"],
        hidden: ["Водители Тип 2"]
      }
    },
  };

  // Memoized current filters
  const currentFilters = useMemo(() => 
    filtersData[tabLabels[activeTab]], 
    [filtersData, tabLabels, activeTab]
  );

  // Tab o'zgarganda selectionlarni tozalash
  useEffect(() => {
    setSelectedFilters({
      cities: [],
      types: [],
      brands: []
    });
  }, [activeTab]);

  // Optimized toggle filter function
  const toggleFilter = useCallback((category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category][0] === value ? [] : [value], // faqat bitta tanlov
    }));
  }, []);

  const resetFilters = useCallback((additionalReset) => {
    setSelectedFilters({ cities: [], types: [], brands: [] });
    if (additionalReset) {
      additionalReset();
    }
  }, []);

  return {
    selectedFilters,
    currentFilters,
    toggleFilter,
    resetFilters
  };
};