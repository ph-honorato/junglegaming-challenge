import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components";
import { useCatalog } from "../../CatalogContext";
import { SORT_OPTIONS } from "./SortSelect.types";
import { useTranslation } from "react-i18next";

export function SortSelect() {
  const { t } = useTranslation();
  const { searchParams, setSort } = useCatalog();
  const currentSort = searchParams.sort || "recent";

  const currentOption = SORT_OPTIONS.find((opt) => opt.value === currentSort);

  return (
    <Select value={currentSort} onValueChange={setSort}>
      <SelectTrigger
        className="w-[200px] md:w-[240px] bg-background border-border hover:border-primary/50"
        aria-label={t("home.catalog.sort.label")}
      >
        <SelectValue placeholder={t("home.catalog.sort.label")}>
          {currentOption
            ? t(currentOption.label)
            : t("home.catalog.sort.label")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {t(label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
