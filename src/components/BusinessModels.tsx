import { CreditCard, Share2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const models = [
  {
    icon: CreditCard,
    title: "Financiamento Próprio",
    description: "O modelo principal: troque sua conta de luz por parcelas menores",
    highlights: [
      "Zero investimento inicial",
      "Parcelas até 25% mais baratas",
      "Instalação e homologação inclusas",
      "Primeira parcela em 30 dias",
    ],
    badge: "Mais Popular",
  },
  {
    icon: Share2,
    title: "Geração Compartilhada",
    description: "Ideal para quem não pode instalar placas no imóvel",
    highlights: [
      "Desconto garantido de até 25%",
      "Sem instalação ou obras",
      "Energia 100% limpa",
      "Ideal para inquilinos e apartamentos",
    ],
  },
  {
    icon: TrendingUp,
    title: "Usina de Investimento",
    description: "Invista em geração solar com retorno previsível",
    highlights: [
      "Retorno médio anual: 24%",
      "Contratos longos (PPA)",
      "Gestão pela Moreira Solar",
      "Ativos reais e duradouros",
    ],
  },
];

const BusinessModels = () => {
  const handleWhatsApp = () => {
    window.open("https://wa.me/5565999999999", "_blank");
  };

  return (
    <section id="modelos" className="py-20 bg-muted">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Modelos de Aquisição
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha a melhor opção para o seu perfil
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {models.map((model, index) => (
            <Card key={index} className="border-border hover:shadow-card-hover transition-all duration-300 relative overflow-hidden">
              {model.badge && (
                <div className="absolute top-4 right-4">
                  <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {model.badge}
                  </span>
                </div>
              )}
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <model.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{model.title}</CardTitle>
                <CardDescription className="text-base">{model.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {model.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
                <Button onClick={handleWhatsApp} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Saiba Mais
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessModels;
