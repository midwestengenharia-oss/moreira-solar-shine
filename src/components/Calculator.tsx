import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator as CalcIcon, Zap, TrendingUp } from "lucide-react";
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
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* Before/After Comparison */}
            <motion.div variants={itemVariants}>
              <BeforeAfterComparison
                currentBill={result.currentBill}
                newPayment={result.options[2].monthlyPayment}
                monthlySavings={result.options[2].monthlySavings}
                savingsPercentage={Math.round((result.options[2].monthlySavings / result.currentBill) * 100)}
              />
            </motion.div>

            {/* Technical Specs */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-primary bg-primary text-primary-foreground shadow-3d">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-sm opacity-80 mb-1">Sistema</p>
                      <p className="text-3xl font-bold">{result.systemKwp.toFixed(2)} kWp</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80 mb-1">Módulos</p>
                      <p className="text-3xl font-bold">{result.modulesQty}x {MODULO_W}W</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80 mb-1">Inversor</p>
                      <p className="text-3xl font-bold">{result.inverterKw} kW</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80 mb-1">Geração Mensal</p>
                      <p className="text-3xl font-bold">{result.generation.toFixed(0)} kWh</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80 mb-1">Conta Atual</p>
                      <p className="text-3xl font-bold">R$ {result.currentBill.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80 mb-1">Consumo</p>
                      <p className="text-3xl font-bold">{result.consumption.toFixed(0)} kWh</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Financing Options */}
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-center mb-6">Escolha seu Plano de Financiamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {result.options.map((option, idx) => {
                  const savingsPercentage = Math.round((option.monthlySavings / result.currentBill) * 100);
                  const isMostChosen = idx === 2; // 60x

                  return (
                    <motion.div
                      key={option.months}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`
                        ${isMostChosen ? 'md:scale-105' : ''}
                      `}
                    >
                      <Card className={`
                        relative overflow-hidden border-2 transition-all duration-300
                        hover:shadow-3d
                        ${isMostChosen 
                          ? 'border-accent shadow-glow-accent bg-gradient-to-br from-card to-accent/5' 
                          : 'border-border hover:border-accent/50'
                        }
                        ${selectedPlan?.months === option.months ? 'ring-4 ring-accent' : ''}
                      `}>
                        {isMostChosen && (
                          <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-accent to-yellow-400 text-black text-center py-2 text-xs font-bold">
                            ⭐ MAIS ESCOLHIDO - 89% DOS CLIENTES
                          </div>
                        )}
                        
                        <CardHeader className={isMostChosen ? 'pt-12' : 'pt-6'}>
                          <CardTitle className="text-center text-3xl mb-4">{option.months}x</CardTitle>
                          <div className="flex justify-center mb-4">
                            <CircularProgress value={savingsPercentage} size={100} strokeWidth={6} />
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Conta atual:</span>
                              <span className="line-through text-red-500">R$ {result.currentBill.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">Nova parcela:</span>
                              <span className="text-2xl font-bold text-green-500">R$ {option.monthlyPayment.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center text-accent">
                              <span className="font-bold text-sm">Você economiza:</span>
                              <div className="text-right">
                                <p className="text-xl font-bold">R$ {option.monthlySavings.toFixed(2)}</p>
                                <p className="text-xs">por mês</p>
                              </div>
                            </div>
                          </div>

                          <div className="text-center pt-2">
                            <p className="text-sm text-muted-foreground mb-1">Economia anual</p>
                            <p className="text-lg font-bold text-accent flex items-center justify-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              R$ {option.yearlySavings.toFixed(2)}
                            </p>
                          </div>

                          <Button
                            onClick={() => setSelectedPlan(option)}
                            className="w-full"
                            variant={selectedPlan?.months === option.months ? "default" : "outline"}
                          >
                            {selectedPlan?.months === option.months ? "✅ Plano Selecionado" : "Escolher este plano"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Lead Capture Form */}
            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
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
