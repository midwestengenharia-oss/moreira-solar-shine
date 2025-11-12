import { FileSearch, FileCheck, Wrench, Zap, CreditCard, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

const models = [
  {
    icon: CreditCard,
    title: "Financiamento",
    description: "Instale painéis solares na sua casa e pague parcelas menores que sua conta de luz",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
    highlights: [
      "R$0 de entrada - comece sem investir nada",
      "Parcelas até 30% menores que a conta atual",
      "Instalação completa na sua residência",
      "Primeira parcela só após 30 dias da instalação",
      "Aprovação em até 48h",
    ],
    badge: "Mais Escolhido",
  },
  {
    icon: Share2,
    title: "Outros Serviços",
    description: "Soluções para quem não pode instalar painéis ou quer investir",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop",
    highlights: [
      "Geração Compartilhada: Economize até 25% sem instalar nada. Créditos de energia de uma usina remota aplicados na sua conta.",
      "Usina de Investimento: Invista em quotas de usinas solares. Retorno médio de 24% ao ano via contratos PPA.",
      "Ideal para apartamentos, imóveis alugados ou investidores",
      "Sem obras, sem burocracia, gestão completa pela Moreira",
    ],
  },
];

const HowItWorksAndModels = () => {
  const handleWhatsApp = () => {
    window.open("https://wa.me/5565999999999", "_blank");
  };

  const handleCalculate = () => {
    const calculatorSection = document.getElementById("calculadora");
    const billInput = document.getElementById("bill");

    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: "smooth", block: "start" });

      setTimeout(() => {
        if (billInput) {
          billInput.focus();
        }
      }, 800);
    }
  };

  return (
    <>
      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
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
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-6xl font-bold text-foreground/15 mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modelos de Aquisição */}
      <section id="modelos" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Modelos de Aquisição
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha a melhor opção para o seu perfil
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {models.map((model, index) => {
              const isFinancing = model.title === "Financiamento";
              return (
                <Card
                  key={index}
                  className={`border-border hover:shadow-card-hover transition-all duration-300 relative overflow-hidden flex flex-col ${
                    isFinancing ? "ring-2 ring-green-500/50 shadow-lg shadow-green-500/20" : ""
                  }`}
                >
                  {model.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {model.badge}
                      </span>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={model.image}
                      alt={model.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent"></div>
                    <div className="absolute bottom-4 left-6">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                        isFinancing ? "bg-green-600" : "bg-foreground/10"
                      }`}>
                        <model.icon className={`h-8 w-8 ${isFinancing ? "text-white" : "text-foreground"}`} />
                      </div>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground">{model.title}</CardTitle>
                    <CardDescription className="text-base">{model.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-3 mb-6 flex-1">
                      {model.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                            isFinancing ? "bg-green-600" : "bg-foreground/50"
                          }`} />
                          <span className="text-muted-foreground text-sm">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={isFinancing ? handleCalculate : handleWhatsApp}
                      className={`w-full font-semibold mt-auto ${
                        isFinancing
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                      }`}
                    >
                      {isFinancing ? "Calcular Agora" : "Falar com Especialista"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorksAndModels;
