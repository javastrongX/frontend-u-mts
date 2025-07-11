import { useTranslation } from "react-i18next";
import CategoryBlock from "./CategoryBlock";

const brands = [
  { label: "JCB", count: 47, href: "/brand/jcb" },
  { label: "HITACHI", count: 50, href: "/brand/hitachi" },
  { label: "KOMATSU", count: 99, href: "/brand/komatsu" },
  { label: "KOMATSU", count: 99, href: "/brand/komatsu" },
  { label: "KOMATSU", count: 99, href: "/brand/komatsu" },
  { label: "KOMATSU", count: 99, href: "/brand/komatsu" },
  { label: "KOMATSU", count: 99, href: "/brand/komatsu" },
  { label: "KOMATSU", count: 99, href: "/brand/komatsu" },
  { label: "KOMATSU", count: 99, href: "/brand/komatsu" },
  { label: "KOMATSU", count: 99, href: "/brand/komatsu" },
  // 🔁 Qo‘shimcha brendlar shu yerga...
];

const BrandsBlock = () => {
  const { t } = useTranslation();
  return <CategoryBlock title={t("categories.brands_of_spestexniki", "Марки спецтехники")} items={brands} />;
};

export default BrandsBlock;
