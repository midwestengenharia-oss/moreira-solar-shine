import { useState } from "react";
import { ChevronDown, Phone, User, DollarSign, Send, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  {
    question: "Preciso ter dinheiro guardado para começar?",
    answer: "Não! O sistema é 100% financiado. Você não desembolsa nada e só começa a pagar a primeira parcela 30 dias APÓS a instalação estar gerando energia.",
  },
  {
    question: "E se meu crédito não for aprovado?",
    answer: "Temos aprovação de 85% dos casos. Nossa análise é rápida (até 48h) e menos burocrática que bancos. Se não aprovar, não tem problema - a simulação é gratuita e sem compromisso.",
  },
  {
    question: "As parcelas são realmente mais baratas que minha conta?",
    answer: "Sim! Em média, nossos clientes pagam de 30% a 40% menos. Use nossa calculadora acima para ver sua economia real baseada na sua conta atual.",
  },
  {
    question: "E se eu me mudar de casa?",
    answer: "O sistema solar valoriza o imóvel em até 8%. Você pode vender a casa com o sistema (que é um diferencial), transferir o financiamento para o novo comprador, ou levar o sistema para a nova casa.",
  },
  {
    question: "Quanto tempo dura o sistema?",
    answer: "Os painéis têm garantia de 25 anos e vida útil de 30-40 anos. Ou seja, após quitar o financiamento (3-6 anos), você terá mais de 20 anos de energia praticamente gratuita!",
  },
  {
    question: "E se chover ou ficar nublado?",
    answer: "O sistema continua gerando (mesmo com menor eficiência). Você fica conectado à rede elétrica e usa o sistema de créditos: a energia gerada nos dias de sol compensa os dias nublados.",
  },
];

const FAQContact = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [billValue, setBillValue] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !city || !billValue) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const message = `Olá! Meu nome é ${name}, de ${city}. Minha conta de luz está em torno de R$ ${billValue}. Gostaria de saber mais sobre energia solar.`;
    const whatsappUrl = `https://wa.me/5565999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "Redirecionando...",
      description: "Você será direcionado para o WhatsApp",
    });
  };

  return (
    <section id="contato" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ainda Tem Dúvidas? Fale com a Gente
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Respondemos em até 5 minutos via WhatsApp
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto items-start">
          {/* FAQ */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-foreground mb-6">Perguntas Frequentes</h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="border-border hover:shadow-card-hover transition-all duration-200 cursor-pointer"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-base font-semibold text-foreground flex-1">
                        {faq.question}
                      </h4>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {openIndex === index && (
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-foreground mb-6">Fale com um Especialista</h3>
            <Card className="border-border shadow-card-hover">
              <CardHeader>
                <CardDescription className="text-base">
                  Atendimento rápido via WhatsApp - Resposta em minutos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      Nome Completo
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4" />
                      WhatsApp
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(65) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4" />
                      Cidade/UF
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Cuiabá/MT"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="billValue" className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4" />
                      Valor da Conta de Luz (R$)
                    </Label>
                    <Input
                      id="billValue"
                      type="number"
                      placeholder="350"
                      value={billValue}
                      onChange={(e) => setBillValue(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" variant="glow" className="w-full font-semibold">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar e Falar no WhatsApp
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center">
                    Sem compromisso • Resposta rápida • 100% gratuito
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQContact;
