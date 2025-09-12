import { useTranslation } from "react-i18next";
import CategoryBlock from "./CategoryBlock";

const cities = [
  { label: "Алматы", count: 1900, href: "/city/almaty" },
  { label: "Астана", count: 883, href: "/city/astana" },
  { label: "Шымкент", count: 177, href: "/city/shymkent" },
  { label: "Шымкент", count: 177, href: "/city/shymkent" },
  { label: "Шымкент", count: 177, href: "/city/shymkent" },
  { label: "Шымкент", count: 177, href: "/city/shymkent" },
  { label: "Шымкент", count: 177, href: "/city/shymkent" },
  { label: "Шымкент", count: 177, href: "/city/shymkent" },
  { label: "Шымкент", count: 177, href: "/city/shymkent" },
  { label: "Шымкент", count: 177, href: "/city/shymkent" },
  { label: "Шымкент", count: 177, href: "/city/shymkent" },
  { label: "Шымкент", count: 177, href: "/city/shymkent" },
  { label: "Шымкент", count: 177, href: "/city/shymkent" },
  // 🔁 Qo‘shimcha shaharlar shu yerga...
];

const CitiesBlock = () => {
  const { t } = useTranslation();
  return <CategoryBlock title={t("categories.spestexniki_on_city", "Спецтехника в городах")} items={cities} />;
};

export default CitiesBlock;
