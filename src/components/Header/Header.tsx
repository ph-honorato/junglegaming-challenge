import * as React from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../contexts/AuthContext";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  LogIn,
  LogOut,
} from "lucide-react";
import {
  Button,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationLink,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle,
} from "../ui";
import { useTranslation } from "react-i18next";

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogged } = useAuth();
  // const search = useSearch({ from: "/" });
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState<string>("");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setSelectedSection(sectionId);
  };

  // The home sections mount after the navigation commit, so retry within a few frames
  const scrollToSectionWhenMounted = (sectionId: string, attempt = 0) => {
    if (document.getElementById(sectionId)) {
      scrollToSection(sectionId);
      return;
    }
    if (attempt < 5) {
      requestAnimationFrame(() =>
        scrollToSectionWhenMounted(sectionId, attempt + 1),
      );
    }
  };

  // Navigates home first when coming from another page, then lands on the section
  const handleSectionNavigation = async (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      await navigate({ to: "/" });
      scrollToSectionWhenMounted(sectionId);
      return;
    }
    scrollToSection(sectionId);
  };

  const navigateTo = (
    to: string,
    searchParams?: Record<string, string | undefined>,
  ) => {
    navigate({ to, search: searchParams });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-18 items-center justify-between">
          {/* Logo - go to home (Início section) */}
          <button
            onClick={() => handleSectionNavigation("hero")}
            className="flex items-center gap-2 text-xl lg:text-2xl font-bold text-primary hover:opacity-80 transition-all duration-200 group"
            aria-label={t("navigation.home")}
          >
            KURIO
          </button>

          {/* Desktop Navigation - using navigation-menu */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label={t("navigation.main")}
          >
            <NavigationMenu>
              <NavigationMenuList className="gap-6">
                <NavigationMenuItem>
                  <NavigationLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <button
                      type="button"
                      onClick={() => handleSectionNavigation("hero")}
                      className={`navigation-buttons ${selectedSection === "hero" ? "section-selected" : ""}`}
                    >
                      {t("navigation.home")}
                    </button>
                  </NavigationLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <button
                      type="button"
                      onClick={() => handleSectionNavigation("catalog")}
                      className={`navigation-buttons ${selectedSection === "catalog" ? "section-selected" : ""}`}
                    >
                      {t("navigation.marketplace")}
                    </button>
                  </NavigationLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <button
                      type="button"
                      onClick={() => handleSectionNavigation("creators")}
                      className={`navigation-buttons ${selectedSection === "creators" ? "section-selected" : ""}`}
                    >
                      {t("navigation.creators")}
                    </button>
                  </NavigationLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <button
                      type="button"
                      onClick={() => handleSectionNavigation("blog")}
                      className={`navigation-buttons ${selectedSection === "blog" ? "section-selected" : ""}`}
                    >
                      {t("navigation.learn")}
                    </button>
                  </NavigationLink>
                </NavigationMenuItem>
              </NavigationMenuList>
              <NavigationMenuIndicator />
            </NavigationMenu>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-xl hover:bg-accent transition-colors"
              // onClick={() => navigateTo("/marketplace", { ...search, q: "" })}
              aria-label={t("common.search")}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative w-10 h-10 rounded-xl hover:bg-accent transition-colors"
              onClick={() => navigateTo("/cart")}
              aria-label={t("navigation.cart")}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>

            {/* Login / Logout */}
            <Button
              variant="default"
              onClick={() => navigateTo("/login")}
              aria-label={
                isLogged ? t("navigation.logout") : t("navigation.login")
              }
              className="gap-2"
            >
              {isLogged ? (
                <LogOut className="h-5 w-5" />
              ) : (
                <LogIn className="h-5 w-5" />
              )}
              {isLogged ? t("navigation.logout") : t("navigation.login")}
            </Button>
          </div>

          {/* Mobile Menu Button - only visible on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden w-10 h-10 rounded-xl hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? t("common.close") : t("common.menu")}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden py-4 border-t border-border animate-slide-down"
          >
            <nav
              className="flex flex-col gap-2"
              aria-label={t("navigation.main")}
            >
              <button
                className="w-full px-4 py-3 text-left text-lg font-medium rounded-xl hover:bg-accent transition-colors"
                onClick={() => handleSectionNavigation("hero")}
              >
                {t("navigation.home")}
              </button>
              <button
                className="w-full px-4 py-3 text-left text-lg font-medium rounded-xl hover:bg-accent transition-colors"
                onClick={() => handleSectionNavigation("catalog")}
              >
                {t("navigation.marketplace")}
              </button>
              <button
                className="w-full px-4 py-3 text-left text-lg font-medium rounded-xl hover:bg-accent transition-colors"
                onClick={() => handleSectionNavigation("creators")}
              >
                {t("navigation.creators")}
              </button>
              <button
                className="w-full px-4 py-3 text-left text-lg font-medium rounded-xl hover:bg-accent transition-colors"
                onClick={() => handleSectionNavigation("blog")}
              >
                {t("navigation.learn")}
              </button>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full justify-start px-4 py-3 rounded-xl"
                  // onClick={() =>
                  //   navigateTo("/marketplace", { ...search, q: "" })
                  // }
                >
                  <Search className="mr-2 h-5 w-5" />
                  {t("common.search")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start px-4 py-3 rounded-xl"
                  onClick={() => navigateTo("/favorites")}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  {t("navigation.favorites")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start px-4 py-3 rounded-xl"
                  onClick={() => navigateTo("/cart")}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {t("navigation.cart")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start px-4 py-3 rounded-xl"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo("/login");
                  }}
                >
                  {isLogged ? (
                    <LogOut className="mr-2 h-5 w-5" />
                  ) : (
                    <LogIn className="mr-2 h-5 w-5" />
                  )}
                  {isLogged ? t("navigation.logout") : t("navigation.login")}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
