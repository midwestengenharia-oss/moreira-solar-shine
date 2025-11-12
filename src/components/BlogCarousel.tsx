import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "Energia Solar Vale a Pena? Descubra os Números Reais",
    excerpt: "Análise completa com dados reais de clientes: quanto custa, quanto economiza e em quanto tempo você recupera o investimento.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop",
    date: "15 Nov 2024",
    readTime: "8 min",
    category: "Economia",
  },
  {
    title: "Como Funciona o Financiamento de Energia Solar",
    excerpt: "Entenda todas as opções de financiamento, prazos, taxas e como conseguir aprovação rápida para seu sistema solar.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    date: "10 Nov 2024",
    readTime: "6 min",
    category: "Financiamento",
  },
  {
    title: "Manutenção de Painéis Solares: Guia Completo",
    excerpt: "Tudo o que você precisa saber sobre cuidados, limpeza e manutenção preventiva para maximizar a vida útil do seu sistema.",
    image: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=600&h=400&fit=crop",
    date: "5 Nov 2024",
    readTime: "5 min",
    category: "Manutenção",
  },
  {
    title: "5 Erros Comuns ao Instalar Energia Solar",
    excerpt: "Evite problemas! Conheça os principais erros que as pessoas cometem ao contratar sistemas solares e como se proteger.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop",
    date: "1 Nov 2024",
    readTime: "7 min",
    category: "Dicas",
  },
  {
    title: "Energia Solar em Apartamentos: É Possível?",
    excerpt: "Descubra as alternativas disponíveis para moradores de apartamentos que querem economizar com energia solar.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    date: "28 Out 2024",
    readTime: "5 min",
    category: "Moradia",
  },
];

const BlogCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % blogPosts.length);
  };

  const previous = () => {
    setCurrentIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
  };

  const getVisiblePosts = () => {
    const posts = [];
    for (let i = 0; i < 3; i++) {
      posts.push(blogPosts[(currentIndex + i) % blogPosts.length]);
    }
    return posts;
  };

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Aprenda Mais Sobre Energia Solar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conteúdos exclusivos para você tomar a melhor decisão
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Carrossel */}
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getVisiblePosts().map((post, index) => (
                <Card
                  key={`${currentIndex}-${index}`}
                  className="border-border hover:shadow-card-hover transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-accent hover:text-accent hover:bg-transparent">
                      Ler mais <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={previous}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {blogPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-accent w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogCarousel;
