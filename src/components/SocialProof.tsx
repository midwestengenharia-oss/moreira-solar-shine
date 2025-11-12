import { useState } from "react";
import { Users, Zap, TrendingUp, Award, Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  {
    icon: Users,
    value: "2.500+",
    label: "Famílias Economizando",
    description: "Clientes ativos gerando energia",
  },
  {
    icon: Zap,
    value: "R$ 12M+",
    label: "Economizados em 2024",
    description: "Em contas de luz dos clientes",
  },
  {
    icon: TrendingUp,
    value: "38%",
    label: "Economia Média",
    description: "Redução na conta mensal",
  },
  {
    icon: Award,
    value: "4.8/5",
    label: "Avaliação Google",
    description: "Baseado em 847 avaliações",
  },
];

const testimonials = [
  {
    name: "Maria Silva",
    location: "Cuiabá, MT",
    rating: 5,
    text: "Minha conta era R$ 480 e agora pago R$ 280. Economizo R$ 200 todo mês e ainda gero minha própria energia. A Moreira Solar foi profissional do início ao fim.",
    date: "Há 2 meses",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "João Santos",
    location: "Várzea Grande, MT",
    rating: 5,
    text: "Não precisei desembolsar nada! Em 4 anos paguei tudo e agora tenho energia praticamente de graça. Melhor decisão que tomei.",
    date: "Há 1 ano",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Ana Paula Costa",
    location: "Rondonópolis, MT",
    rating: 5,
    text: "Instalação rápida, em 2 dias estava pronto. O sistema já gerou mais de R$ 8.000 em economia. Recomendo!",
    date: "Há 6 meses",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

const SocialProof = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const previous = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        {/* Stats Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Referência em Energia Solar no Centro-Oeste
          </h2>
          <p className="text-lg text-muted-foreground">
            Números reais de quem já está economizando
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
          {stats.map((stat, index) => {
            const colors = [
              { bg: "bg-gradient-to-br from-green-500/20 to-green-600/10", icon: "text-green-600", value: "text-green-600" },
              { bg: "bg-gradient-to-br from-accent/20 to-accent/10", icon: "text-accent", value: "text-accent" },
              { bg: "bg-gradient-to-br from-green-500/20 to-green-600/10", icon: "text-green-600", value: "text-green-600" },
              { bg: "bg-gradient-to-br from-accent/20 to-accent/10", icon: "text-accent", value: "text-accent" },
            ];
            const color = colors[index];

            return (
              <Card key={index} className="border-border text-center hover:shadow-lg hover:border-green-500/30 transition-all duration-300 group">
                <CardContent className="pt-8 pb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${color.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-8 w-8 ${color.icon}`} />
                  </div>
                  <div className={`text-4xl md:text-5xl font-bold ${color.value} mb-2 tracking-tight`}>
                    {stat.value}
                  </div>
                  <div className="font-semibold text-foreground text-base mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Testimonials Carousel */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-2xl font-bold text-accent">4.8/5</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Depoimentos de Clientes Reais
          </h3>
          <p className="text-muted-foreground">
            847 avaliações verificadas no Google
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getVisibleTestimonials().map((testimonial, index) => (
                <Card key={`${currentIndex}-${index}`} className="border-border hover:shadow-card-hover transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-4">
                      <Quote className="h-8 w-8 text-foreground/20 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex gap-1 mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          "{testimonial.text}"
                        </p>
                        <div className="flex items-center gap-3">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-foreground/10"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Controls */}
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
              {testimonials.map((_, index) => (
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

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Baseado em 847 avaliações verificadas no Google - Atualizado em Novembro 2024
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
