import { useTranslation } from "react-i18next";
import { Button } from "@components";

function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          {t("home.title")}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          {t("home.subtitle")}
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => console.log("test")}>
            {t("home.getStarted")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
