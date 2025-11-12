import { Zap, DollarSign, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Zap,
    title: "Zero Investimento Inicial",
    description: "Comece a economizar sem precisar desembolsar nada",
  },
  {
    icon: DollarSign,
    title: "Parcelas Menores",
    description: "Até 25% mais barato que sua conta de luz atual",
  },
  {
    icon: Shield,
    title: "Processo Completo",
    description: "Instalação, homologação e suporte inclusos",
  },
  {
    icon: Clock,
    title: "Primeira Parcela em 30 Dias",
    description: "Pague apenas quando o sistema estiver gerando",
  },
];

const Benefits = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Por que escolher a Moreira Solar?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Energia solar acessível com financiamento próprio e economia garantida
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="border-border hover:shadow-card-hover transition-shadow duration-300"
            >
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                  <benefit.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
