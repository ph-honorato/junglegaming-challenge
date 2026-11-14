import { Button, Input } from "@components";
import { useTranslation } from "react-i18next";

function FooterCard(props: {
  avatar: string;
  title: string;
  description: string;
}) {
  const { avatar, title, description } = props;

  return (
    <div className="space-y-4 pr-8 md:border-r-1 border-current text-primary">
      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg">
        {avatar}
      </div>
      <h3 className="font-semibold text-base text-card-foreground tracking-wide">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full font-sans mb-8">
      <div className="w-full bg-surface max-w-[1200px]">
        {/* Cards Superiores (Segurança, Criadores, Alertas e Newsletter) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-6">
          <FooterCard
            avatar="W"
            title={t("footer.features.walletSecurity")}
            description={t("footer.features.walletSecurityDesc")}
          />
          <FooterCard
            avatar="C"
            title={t("footer.features.featuredCreators")}
            description={t("footer.features.featuredCreatorsDesc")}
          />
          <FooterCard
            avatar="D"
            title={t("footer.features.launchAlerts")}
            description={t("footer.features.launchAlertsDesc")}
          />

          <div className="space-y-4">
            <h3 className="font-semibold text-base text-card-foreground tracking-wide">
              {t("footer.newsletter.title")}
            </h3>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center pt-1"
            >
              <Input
                type="email"
                placeholder={t("footer.newsletter.placeholder")}
                className="bg-card border-border text-card-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-10 text-sm"
              />
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 px-5 transition-colors"
              >
                {t("footer.newsletter.subscribe")}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("footer.newsletter.description")}
            </p>
          </div>
        </div>

        {/* Marca e Links Rápidos de Contato */}
        <div className="bg-surface-dark grid grid-cols-1 md:grid-cols-4 gap-6 p-6 items-center text-sm">
          <div className="font-mono font-bold tracking-widest text-card-foreground text-base">
            {t("footer.info.brand")}
          </div>
          <div>{t("footer.info.tagline")}</div>
          <div>{t("footer.info.email")}</div>
          <div className=" font-mono">{t("footer.info.phone")}</div>
        </div>

        {/* Links de Navegação e Redes Sociais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-6">
          {/* Coluna 1: Meu perfil */}
          <div className="space-y-3">
            <h4 className="font-bold text-card-foreground text-sm tracking-wider">
              {t("footer.columns.profile")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.profile")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.myCollection")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.activity")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.creatorStudio")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.wishlist")}
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 2: Central de ajuda */}
          <div className="space-y-3">
            <h4 className="font-bold text-card-foreground text-sm tracking-wider">
              {t("footer.columns.help")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.helpCenter")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.buyNfts")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.walletSecurity")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.marketPolicy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.reportItem")}
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Coleções */}
          <div className="space-y-3">
            <h4 className="font-bold text-card-foreground text-sm tracking-wider">
              {t("footer.columns.collections")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.digitalArt")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.photography")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.music")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.art3d")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-card-foreground transition-colors"
                >
                  {t("footer.links.utility")}
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Redes Sociais com SVG Inline */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-bold text-card-foreground text-sm tracking-wider">
                {t("footer.columns.social")}
              </h4>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:border-primary transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:border-primary transition-all"
                >
                  <svg
                    className="w-4 h-4 fill-none stroke-current stroke-2"
                    viewBox="0 0 24 24"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:border-primary transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:border-primary transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:border-primary transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0 1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95-1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-card-foreground text-sm tracking-wider">
                {t("footer.walletsTitle")}
              </h4>
              <div className="bg-card border border-border rounded-lg px-3 py-2.5 flex items-center justify-between text-[11px] font-mono tracking-wider text-muted-foreground">
                <span>METAMASK</span>
                <span className="text-primary">•</span>
                <span>WALLETCONNECT</span>
                <span className="text-primary">•</span>
                <span>COINBASE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright final */}
      </div>
      <div className="w-full text-center text-xs tracking-wide p-6">
        {t("footer.copyright")}
      </div>
    </footer>
  );
}
