import { cn } from "@/lib/utils";
import { useCatalog } from "../../CatalogContext";
import { CATALOG_TABS } from "./CatalogTabs.types";
import { useTranslation } from "react-i18next";

export function CatalogTabs() {
  const { searchParams, setTab } = useCatalog();
  const { t } = useTranslation();
  const currentTab = searchParams.tab || "all";

  return (
    <nav
      className="flex gap-6 overflow-x-auto scrollbar-hide"
      role="tablist"
      aria-label={t("home.catalog.tabs.label")}
    >
      {CATALOG_TABS.map(({ value, label }) => (
        <button
          key={value}
          role="tab"
          aria-selected={currentTab === value}
          aria-controls={`panel-${value}`}
          id={`tab-${value}`}
          onClick={() => setTab(value)}
          className={cn(
            "relative pb-2 text-sm font-semibold whitespace-nowrap transition-all duration-200",
            currentTab === value
              ? "text-primary border-b-2 border-primary -mb-[2px]"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t(label)}
        </button>
      ))}
    </nav>
  );
}
