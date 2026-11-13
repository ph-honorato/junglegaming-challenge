import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@components";
import { useTranslation } from "react-i18next";
import {
  CREATOR_BANNERS,
  type CreatorBannerProps,
} from "./CreatorsSection.types";

function CreatorBanner(props: CreatorBannerProps) {
  const { image, title, description, href } = props;
  const { t } = useTranslation();

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center gap-6 group hover:border-primary/40 transition-colors shadow-lg">
      {/* Left Column: Image */}
      <div className="w-full sm:w-48 md:w-56 aspect-square rounded-xl overflow-hidden flex-shrink-0 bg-muted">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          aria-hidden="true"
          loading="lazy"
        />
      </div>

      {/* Right Column: Text & CTA */}
      <div className="flex-1 flex flex-col py-2 text-right w-full p-4">
        <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 leading-snug">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>
        <span>
          <Button
            variant="default"
            size="sm"
            className="self-start bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-4 py-2 text-xs md:text-sm rounded-lg shadow-sm"
            asChild
          >
            <Link to={href} className="flex items-center gap-2">
              {t("home.creators.explore")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </span>
      </div>
    </div>
  );
}

export function CreatorsSection() {
  return (
    <section
      id="creators"
      aria-labelledby="creators-heading"
      className="py-8 lg:py-16"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CREATOR_BANNERS.map((banner, index) => (
            <CreatorBanner key={index} {...banner} />
          ))}
        </div>
      </div>
    </section>
  );
}
