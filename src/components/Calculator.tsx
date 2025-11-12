import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator as CalcIcon, Zap, TrendingUp, Battery, Grid3x3, Cpu, Star } from "lucide-react";
import UrgencyBanner from "./UrgencyBanner";
import BeforeAfterComparison from "./BeforeAfterComparison";
import CircularProgress from "./CircularProgress";
import LeadCaptureForm from "./LeadCaptureForm";

interface FinancingOption {
  months: number;
  monthlyPayment: number;
  monthlySavings: number;
  yearlySavings: number;
}

interface CalculationResult {
  consumption: number;
  generation: number;
  systemKwp: number;
  modulesQty: number;
  inverterKw: number;
  currentBill: number;
  options: FinancingOption[];
}

const TARIFA_BASE = 1.2;
const MODULO_W = 620;
const GERACAO_MODULO = 75.67;
const COBERTURA = 1.0;
const OVERLOAD = 1.7;
const TARIFAS_PRAZO = { 36: 1.18, 48: 1.0, 60: 0.9, 72: 0.83 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Calculator = () => {
  const [inputType, setInputType] = useState<"bill" | "consumption">("bill");
  const [billValue, setBillValue] = useState("");
  const [consumptionValue, setConsumptionValue] = useState("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<FinancingOption | null>(null);
  const [viewingPlan, setViewingPlan] = useState<FinancingOption | null>(null);

  const calculate = () => {
    let consumption = 0;

    if (inputType === "bill" && billValue) {
      consumption = parseFloat(billValue) / TARIFA_BASE;
    } else if (inputType === "consumption" && consumptionValue) {
      consumption = parseFloat(consumptionValue);
    }

    if (consumption <= 0) return;

    const alvoKwh = consumption * COBERTURA;
    const qtdModulos = Math.ceil(alvoKwh / GERACAO_MODULO);
    const geracaoReal = qtdModulos * GERACAO_MODULO;
    const sistemaKwp = (qtdModulos * MODULO_W) / 1000;
    const inversorKw = Math.ceil(((qtdModulos * MODULO_W) / OVERLOAD) / 1000);
    const contaBase = geracaoReal * TARIFA_BASE;

    const options: FinancingOption[] = [36, 48, 60, 72].map((months) => {
      const parcela = geracaoReal * TARIFAS_PRAZO[months as keyof typeof TARIFAS_PRAZO];
      const economiaMensal = Math.max(0, contaBase - parcela);
      const economiaAnual = economiaMensal * 12;

      return {
        months,
        monthlyPayment: parcela,
        monthlySavings: economiaMensal,
        yearlySavings: economiaAnual,
      };
    });

    setResult({
      consumption,
      generation: geracaoReal,
      systemKwp: sistemaKwp,
      modulesQty: qtdModulos,
      inverterKw: inversorKw,
      currentBill: contaBase,
      options,
    });
    setSelectedPlan(null);
    setViewingPlan(null);
  };


  return (
    <section id="calculadora" className="relative min-h-screen bg-gradient-mesh">
      <UrgencyBanner />
      
      <div className="container py-12 md:py-20">
        {/* Hero Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full mb-4">
            <Zap className="h-5 w-5" />
            <span className="font-bold">BLACK FRIDAY SOLAR</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary">
            Troque sua conta por parcela
            <span className="block text-accent">até 30% menor</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra quanto você vai economizar TODO MÊS com energia solar
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <Card className="border-2 border-accent/20 shadow-glow-accent backdrop-blur-sm bg-card/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CalcIcon className="h-7 w-7 text-accent" />
                Calculadora de Economia
              </CardTitle>
              <CardDescription className="text-base">
                Informe o valor da sua conta ou seu consumo mensal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={inputType} onValueChange={(v) => setInputType(v as "bill" | "consumption")}>
                <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
                  <TabsTrigger value="bill" className="text-base">Valor da Conta (R$)</TabsTrigger>
                  <TabsTrigger value="consumption" className="text-base">Consumo (kWh)</TabsTrigger>
                </TabsList>
                <TabsContent value="bill" className="space-y-4">
                  <div>
                    <Label htmlFor="bill" className="text-base">Valor médio da sua conta de luz</Label>
                    <Input
                      id="bill"
                      type="number"
                      placeholder="Ex: 350"
                      value={billValue}
                      onChange={(e) => setBillValue(e.target.value)}
                      className="mt-2 h-14 text-lg"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="consumption" className="space-y-4">
                  <div>
                    <Label htmlFor="consumption" className="text-base">Consumo mensal em kWh</Label>
                    <Input
                      id="consumption"
                      type="number"
                      placeholder="Ex: 290"
                      value={consumptionValue}
                      onChange={(e) => setConsumptionValue(e.target.value)}
                      className="mt-2 h-14 text-lg"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              <Button 
                onClick={calculate} 
                variant="glow"
                size="lg"
                className="w-full mt-6 h-14 text-lg"
              >
                <Zap className="mr-2 h-6 w-6" />
                Calcular Minha Economia
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto space-y-8"
          >
            {/* Layout em Grid - Comparação + Cards de Planos lado a lado */}
            <div className="grid lg:grid-cols-5 gap-6">
              
              {/* Coluna Esquerda: Comparação Before/After + Specs Técnicas */}
              <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                {/* Before/After Comparison - Dinâmico com hover */}
                {(() => {
                  const displayPlan = selectedPlan || viewingPlan || result.options[2];
                  return (
                    <BeforeAfterComparison
                      currentBill={result.currentBill}
                      newPayment={displayPlan.monthlyPayment}
                      monthlySavings={displayPlan.monthlySavings}
                      savingsPercentage={Math.round((displayPlan.monthlySavings / result.currentBill) * 100)}
                    />
                  );
                })()}

                {/* Technical Specs - Com ícones modernos */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3 text-center bg-card/50 backdrop-blur border-2 border-accent/20 hover:border-accent/50 transition-all hover:shadow-glow-accent">
                    <Battery className="h-8 w-8 text-accent mx-auto mb-1" />
                    <p className="text-[10px] text-muted-foreground mb-1">Sistema</p>
                    <p className="text-lg font-bold">{result.systemKwp.toFixed(2)} kWp</p>
                  </Card>
                  
                  <Card className="p-3 text-center bg-card/50 backdrop-blur border-2 border-accent/20 hover:border-accent/50 transition-all hover:shadow-glow-accent">
                    <Grid3x3 className="h-8 w-8 text-accent mx-auto mb-1" />
                    <p className="text-[10px] text-muted-foreground mb-1">Módulos</p>
                    <p className="text-lg font-bold">{result.modulesQty}x</p>
                    <p className="text-[10px] text-muted-foreground">{MODULO_W}W</p>
                  </Card>
                  
                  <Card className="p-3 text-center bg-card/50 backdrop-blur border-2 border-accent/20 hover:border-accent/50 transition-all hover:shadow-glow-accent">
                    <Cpu className="h-8 w-8 text-accent mx-auto mb-1" />
                    <p className="text-[10px] text-muted-foreground mb-1">Inversor</p>
                    <p className="text-lg font-bold">{result.inverterKw} kW</p>
                  </Card>
                  
                  <Card className="p-3 text-center bg-card/50 backdrop-blur border-2 border-accent/20 hover:border-accent/50 transition-all hover:shadow-glow-accent">
                    <Zap className="h-8 w-8 text-accent mx-auto mb-1" />
                    <p className="text-[10px] text-muted-foreground mb-1">Geração</p>
                    <p className="text-lg font-bold">{result.generation.toFixed(0)} kWh</p>
                  </Card>
                </div>
              </motion.div>

              {/* Coluna Direita: Planos de Financiamento */}
              <motion.div variants={itemVariants} className="lg:col-span-3">
                <h3 className="text-xl font-bold text-center mb-4">Escolha seu Plano de Financiamento</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {result.options.map((option, idx) => {
                    const savingsPercentage = Math.round((option.monthlySavings / result.currentBill) * 100);
                    const isMostChosen = idx === 2; // 60x

                    return (
                      <motion.div
                        key={option.months}
                        variants={itemVariants}
                        whileHover={{ scale: 1.03, y: -3 }}
                        onMouseEnter={() => setViewingPlan(option)}
                        onMouseLeave={() => setViewingPlan(null)}
                        className={`
                          ${isMostChosen ? 'lg:scale-[1.02]' : ''}
                        `}
                      >
                        <Card className={`
                          relative overflow-hidden border-2 transition-all duration-300
                          hover:shadow-3d cursor-pointer h-full
                          ${isMostChosen 
                            ? 'border-accent shadow-glow-accent bg-gradient-to-br from-card to-accent/5' 
                            : 'border-border hover:border-accent/50'
                          }
                          ${selectedPlan?.months === option.months ? 'ring-4 ring-accent' : ''}
                          ${viewingPlan?.months === option.months && !selectedPlan ? 'ring-2 ring-accent/50' : ''}
                        `}>
                          {isMostChosen && (
                            <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-accent to-yellow-400 text-black text-center py-1.5 text-[10px] font-bold flex items-center justify-center gap-1">
                              <Star className="h-3 w-3" />
                              MAIS ESCOLHIDO
                            </div>
                          )}
                          
                          <CardHeader className={isMostChosen ? 'pt-8 pb-3' : 'pt-4 pb-3'}>
                            <CardTitle className="text-center text-2xl mb-2">{option.months}x</CardTitle>
                            <div className="flex justify-center mb-2">
                              <CircularProgress value={savingsPercentage} size={80} strokeWidth={6} />
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-3 px-3 pb-3">
                            <div className="space-y-1.5 p-2.5 bg-muted/50 rounded-lg">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-muted-foreground">Conta atual:</span>
                                <span className="line-through text-red-500 font-semibold">R$ {result.currentBill.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-xs">Parcela:</span>
                                <span className="text-lg font-bold text-green-500">R$ {option.monthlyPayment.toFixed(2)}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between items-center text-accent">
                                <span className="font-bold text-[10px]">Economia:</span>
                                <div className="text-right">
                                  <p className="text-base font-bold">R$ {option.monthlySavings.toFixed(2)}</p>
                                  <p className="text-[9px]">por mês</p>
                                </div>
                              </div>
                            </div>

                            <div className="text-center pt-1">
                              <p className="text-[10px] text-muted-foreground mb-0.5">Economia anual</p>
                              <p className="text-sm font-bold text-accent flex items-center justify-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                R$ {option.yearlySavings.toFixed(2)}
                              </p>
                            </div>

                            <Button
                              onClick={() => setSelectedPlan(option)}
                              className="w-full text-xs h-8"
                              variant={selectedPlan?.months === option.months ? "default" : "outline"}
                            >
                              {selectedPlan?.months === option.months ? "Plano Selecionado" : "Escolher"}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Lead Capture Form */}
            {selectedPlan && (
              <motion.div
                id="lead-capture-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border-4 border-accent/30 rounded-lg animate-border-glow"
              >
                <LeadCaptureForm
                  calculationData={{
                    systemKwp: result.systemKwp,
                    currentBill: result.currentBill,
                    selectedPlan,
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Calculator;
