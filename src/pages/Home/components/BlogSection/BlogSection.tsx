// BlogSection Component
import { ArrowRight } from "lucide-react";
import { Card } from "@components";
import { useTranslation } from "react-i18next";
import { BLOG_POSTS } from "./BlogSection.types";

export function BlogSection() {
  const { t } = useTranslation();

  return (
    <section id="blog" aria-labelledby="blog-heading" className="py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 lg:py-16">
        <div className="text-center mb-12">
          <h2
            id="blog-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3 font-sans"
          >
            {t("home.learn.title", { defaultValue: "Diário da Cunhagem" })}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            {t("home.learn.subtitle", {
              defaultValue:
                "Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.slug}
              className="group h-full flex flex-col"
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border-border hover:border-primary/40 rounded-2xl flex flex-col justify-between">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted mb-3">
                  <img
                    src={post.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    aria-hidden="true"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <span>
                      {new Date(post.date).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                    <span>|</span>
                    <span>
                      {t("home.learn.readTime", {
                        time: post.readTime,
                        defaultValue: `Leitura de ${post.readTime} min`,
                      })}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm md:text-base mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <span className="text-xs font-semibold text-primary flex items-center gap-1 mt-auto group-hover:underline">
                    {t("home.learn.readMore", { defaultValue: "Ler mais" })}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
