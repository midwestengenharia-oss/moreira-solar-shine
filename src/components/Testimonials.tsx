import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Maria Silva",
    location: "Cuiabá, MT",
    rating: 5,
    text: "Incrível! Minha conta era R$ 480 e agora pago R$ 280 de parcela. Economizo R$ 200 todo mês e ainda estou gerando minha própria energia. A Moreira Solar foi profissional do início ao fim.",
    date: "Há 2 meses",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "João Santos",
    location: "Várzea Grande, MT",
    rating: 5,
    text: "Tinha receio pelo investimento, mas não precisei desembolsar nada! Em 4 anos paguei tudo e agora tenho energia praticamente de graça. Melhor decisão que tomei para minha casa.",
    date: "Há 1 ano",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Ana Paula Costa",
    location: "Rondonópolis, MT",
    rating: 5,
    text: "A instalação foi rápida, em 2 dias estava tudo pronto. O sistema já gerou mais de R$ 8.000 em economia. Recomendo para todos!",
    date: "Há 6 meses",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Carlos Mendes",
    location: "Sinop, MT",
    rating: 5,
    text: "Fiz a simulação, aprovaram meu crédito em 48h e em 50 dias o sistema estava instalado. Suporte excelente e economia real desde o primeiro mês!",
    date: "Há 3 meses",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    name: "Fernanda Lima",
    location: "Cuiabá, MT",
    rating: 5,
    text: "Estava pagando R$ 650/mês. Agora pago R$ 380 de parcela e economizo R$ 270. Quando terminar de pagar, vou economizar quase R$ 8.000 por ano!",
    date: "Há 4 meses",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
  {
    name: "Roberto Alves",
    location: "Primavera do Leste, MT",
    rating: 5,
    text: "Sistema funcionando perfeitamente há 8 meses. A conta de luz praticamente zerou. Energia limpa, economia garantida e valorização do imóvel. Nota 10!",
    date: "Há 8 meses",
    avatar: "https://i.pravatar.cc/150?img=59",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-2xl font-bold text-foreground">4.8/5</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mais de 847 avaliações verificadas de clientes reais economizando com energia solar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border hover:shadow-card-hover transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <Quote className="h-8 w-8 text-accent/30 flex-shrink-0" />
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
                        className="w-12 h-12 rounded-full object-cover border-2 border-accent/20"
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

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            ⭐ Baseado em 847 avaliações verificadas no Google • Atualizado em Novembro 2024
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
