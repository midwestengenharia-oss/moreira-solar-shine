import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Phone, User, DollarSign, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [billValue, setBillValue] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !billValue) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const message = `Olá! Meu nome é ${name}. Minha conta de luz está em torno de R$ ${billValue}. Gostaria de saber mais sobre energia solar.`;
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
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Fale Conosco
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Preencha seus dados e entraremos em contato
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <Card className="border-border shadow-card-hover">
            <CardHeader>
              <CardTitle>Solicite uma Proposta</CardTitle>
              <CardDescription>
                Receba um orçamento personalizado em minutos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    WhatsApp
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(65) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billValue" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Valor da Conta de Luz (R$)
                  </Label>
                  <Input
                    id="billValue"
                    type="number"
                    placeholder="350"
                    value={billValue}
                    onChange={(e) => setBillValue(e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar via WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
