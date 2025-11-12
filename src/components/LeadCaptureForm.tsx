import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import PhoneInput from "./PhoneInput";
import { User, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LeadCaptureFormProps {
  calculationData: {
    systemKwp: number;
    currentBill: number;
    selectedPlan: {
      months: number;
      monthlyPayment: number;
      monthlySavings: number;
    };
  };
}

const LeadCaptureForm = ({ calculationData }: LeadCaptureFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneClean = phone.replace(/\D/g, '');
    
    if (phoneClean.length < 10) {
      toast({
        title: "❌ Telefone inválido",
        description: "Por favor, insira um número válido com DDD.",
        variant: "destructive",
      });
      return;
    }

    if (!accepted) {
      toast({
        title: "⚠️ Atenção",
        description: "Por favor, aceite receber a proposta comercial.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const message = encodeURIComponent(
      `Olá! 🌞\n\n` +
      `Acabei de simular na calculadora BLACK FRIDAY e quero receber o orçamento completo:\n\n` +
      `📊 Sistema: ${calculationData.systemKwp.toFixed(2)} kWp\n` +
      `💵 Conta atual: R$ ${calculationData.currentBill.toFixed(2)}\n` +
      `💰 Nova parcela (${calculationData.selectedPlan.months}x): R$ ${calculationData.selectedPlan.monthlyPayment.toFixed(2)}\n` +
      `✅ Economia mensal: R$ ${calculationData.selectedPlan.monthlySavings.toFixed(2)}\n\n` +
      `Nome: ${name || 'Não informado'}\n` +
      `WhatsApp: ${phone}\n\n` +
      `🔥 Quero aproveitar a condição BLACK FRIDAY válida até 28/11!`
    );

    toast({
      title: "✅ Redirecionando para WhatsApp...",
      description: "Prepare-se para receber sua proposta completa!",
    });

    setTimeout(() => {
      window.open(`https://wa.me/5565999999999?text=${message}`, '_blank');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="relative overflow-hidden backdrop-blur-sm bg-gradient-to-br from-background/95 to-background/80 border-2 border-accent/20 shadow-glow-accent animate-slide-up">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-yellow-400/5" />
      
      <CardHeader className="relative">
        <CardTitle className="text-2xl text-center">
          🎁 Receba seu Orçamento Completo
        </CardTitle>
        <CardDescription className="text-center">
          Proposta personalizada direto no seu WhatsApp em segundos
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Seu nome completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <svg className="h-4 w-4 fill-green-500" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp <span className="text-destructive">*</span>
            </Label>
            <PhoneInput
              value={phone}
              onChange={setPhone}
              className="h-12"
            />
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox 
              id="terms" 
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Li e aceito receber proposta comercial via WhatsApp
            </label>
          </div>

          <Button 
            type="submit" 
            variant="glow"
            size="lg"
            className="w-full h-14 text-lg font-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              "Preparando proposta..."
            ) : (
              <>
                <svg className="mr-2 h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                RECEBER ORÇAMENTO COMPLETO NO WHATSAPP
                <Sparkles className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>✅</span>
              <span>Sem pegadinhas</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✅</span>
              <span>Análise própria</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✅</span>
              <span>Instalação inclusa</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadCaptureForm;
