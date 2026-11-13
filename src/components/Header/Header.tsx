// Header Component
import * as React from "react";
import { useNavigate, useSearch, Link } from "@tanstack/react-router";
import { Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
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
  // const search = useSearch({ from: "/" });
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const navigateTo = (
    to: string,
    searchParams?: Record<string, string | undefined>,
  ) => {
    navigate({ to, search: searchParams });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 lg:h-18 items-center justify-between">
          {/* Logo - redirect to hero/Início */}
          <button
            onClick={() => scrollToSection("hero")}
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
                    <Link
                      to="#hero"
                      onClick={() => scrollToSection("hero")}
                      className="px-4 py-2"
                    >
                      {t("navigation.home")}
                    </Link>
                  </NavigationLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link
                      to="#catalog"
                      onClick={() => scrollToSection("catalog")}
                      className="px-4 py-2"
                    >
                      {t("navigation.marketplace")}
                    </Link>
                  </NavigationLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link
                      to="#creators"
                      onClick={() => scrollToSection("creators")}
                      className="px-4 py-2"
                    >
                      {t("navigation.creators")}
                    </Link>
                  </NavigationLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link
                      to="#blog"
                      onClick={() => scrollToSection("blog")}
                      className="px-4 py-2"
                    >
                      {t("navigation.learn")}
                    </Link>
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

            {/* Login */}
            <Button
              variant="outline"
              size="icon"
              // className="relative w-10 h-10 rounded-xl hover:bg-accent transition-colors"
              onClick={() => navigateTo("/login")}
              aria-label={t("navigation.login")}
            >
              {t("navigation.login")}
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
                onClick={() => scrollToSection("hero")}
              >
                {t("navigation.home")}
              </button>
              <button
                className="w-full px-4 py-3 text-left text-lg font-medium rounded-xl hover:bg-accent transition-colors"
                onClick={() => scrollToSection("catalog")}
              >
                {t("navigation.marketplace")}
              </button>
              <button
                className="w-full px-4 py-3 text-left text-lg font-medium rounded-xl hover:bg-accent transition-colors"
                onClick={() => scrollToSection("creators")}
              >
                {t("navigation.creators")}
              </button>
              <button
                className="w-full px-4 py-3 text-left text-lg font-medium rounded-xl hover:bg-accent transition-colors"
                onClick={() => scrollToSection("blog")}
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
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
