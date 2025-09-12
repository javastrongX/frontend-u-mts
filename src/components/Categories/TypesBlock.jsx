import { useTranslation } from "react-i18next";
import CategoryBlock from "./CategoryBlock";

const types = [
  { label: "Бульдозеры", count: 1030, href: "/category/buldozer" },
  { label: "Колесные экскаваторы", count: 914, href: "/category/excavator" },
  { label: "Мини-погрузчики", count: 542, href: "/category/mini-loader" },
  { label: "Мини-погрузчики", count: 542, href: "/category/mini-loader" },
  { label: "Мини-погрузчики", count: 542, href: "/category/mini-loader" },
  { label: "Мини-погрузчики", count: 542, href: "/category/mini-loader" },
  { label: "Мини-погрузчики", count: 542, href: "/category/mini-loader" },
  { label: "Мини-погрузчики", count: 542, href: "/category/mini-loader" },
  { label: "Мини-погрузчики", count: 542, href: "/category/mini-loader" },
  { label: "Мини-погрузчики", count: 542, href: "/category/mini-loader" },
  { label: "Мини-погрузчики", count: 542, href: "/category/mini-loader" },
  { label: "Мини-погрузчики", count: 542, href: "/category/mini-loader" },
  { label: "Мини-погрузчики", count: 542, href: "/category/mini-loader" },
  // 🔁 Qo‘shimcha turlar shu yerga...
];

const TypesBlock = () => {
  const { t } = useTranslation();
  return <CategoryBlock title={t("categories.type_of_spestexniki", "Типы спецтехники")} items={types} />;
};

export default TypesBlock;
