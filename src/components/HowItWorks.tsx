import { FileSearch, FileCheck, Wrench, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: FileSearch,
    number: "01",
    title: "Diagnóstico e Proposta",
    description: "Análise da conta de luz, dimensionamento do sistema e 4 opções de parcelamento em PDF",
  },
  {
    icon: FileCheck,
    number: "02",
    title: "Aprovação e Contrato",
    description: "Análise de crédito pela Moreira, coleta de documentos e assinatura digital",
  },
  {
    icon: Wrench,
    number: "03",
    title: "Viabilidade Técnica",
    description: "Nossa engenharia avalia estrutura, telhado e padrões elétricos",
  },
  {
    icon: Zap,
    number: "04",
    title: "Instalação e Homologação",
    description: "Instalação completa e homologação junto à concessionária. Primeira parcela em até 30 dias",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Como Funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Processo simples e transparente do início ao fim
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="border-border hover:shadow-card-hover transition-all duration-300 relative">
              <CardContent className="pt-8 pb-6">
                <div className="absolute -top-4 left-6">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                </div>
                <div className="text-6xl font-bold text-muted/10 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
