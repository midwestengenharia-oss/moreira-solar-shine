import { useState, useEffect } from "react";
import { motion, animate, useMotionValue } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Calculator as CalcIcon, Zap, TrendingUp, TrendingDown, Battery, Grid3x3, Cpu, Star, ArrowLeft, Wallet, PiggyBank } from "lucide-react";
import LeadCaptureForm from "./LeadCaptureForm";
import UrgencyBanner from "./UrgencyBanner";

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
const CUSTO_POR_KWP = 5000;

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
  const [billMasked, setBillMasked] = useState("");
  const [billNumeric, setBillNumeric] = useState<number | null>(null);
  const [consumptionMasked, setConsumptionMasked] = useState("");
  const [consumptionNumeric, setConsumptionNumeric] = useState<number | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<FinancingOption | null>(null);
  const [viewingPlan, setViewingPlan] = useState<FinancingOption | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleReset = () => {
    setHasCalculated(false);
    setResult(null);
    setSelectedPlan(null);
    setViewingPlan(null);
  };

  const formatCurrencyMask = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const cents = digits ? parseInt(digits, 10) : 0;
    const num = cents / 100;
    const formatted = `R$ ${num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return { formatted, numeric: num };
  };

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { formatted, numeric } = formatCurrencyMask(e.target.value);
    setBillMasked(formatted);
    setBillNumeric(numeric);
  };

  const formatKwhMask = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const num = digits ? parseInt(digits, 10) : 0;
    const formatted = num.toLocaleString("pt-BR");
    return { formatted, numeric: num };
  };

  const handleConsumptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { formatted, numeric } = formatKwhMask(e.target.value);
    setConsumptionMasked(formatted);
    setConsumptionNumeric(numeric);
  };

  const calculate = () => {
    let consumption = 0;

    if (inputType === "bill" && billNumeric && billNumeric > 0) {
      consumption = billNumeric / TARIFA_BASE;
    } else if (inputType === "consumption" && consumptionNumeric && consumptionNumeric > 0) {
      consumption = consumptionNumeric;
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
    <section id="calculadora" className="relative pt-24 pb-12 md:pb-16">
      <UrgencyBanner />
      <div className="mx-auto w-full px-4 md:px-6">
        <Card className="mx-auto w-full max-w-[1100px] border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalcIcon className="h-6 w-6 text-accent" />
                <CardTitle className="text-2xl text-foreground">Calculadora de Economia</CardTitle>
                {result && (
                  <Button variant="outline" size="sm" className="border-accent text-accent hover:border-accent hover:text-accent hover:bg-transparent" onClick={handleReset}>
                    <ArrowLeft className="mr-1 h-4 w-4" /> Calcular novamente
                  </Button>
                )}
              </div>
              <Badge variant="glow">Black Friday</Badge>
            </div>
            <CardDescription className="text-base">Informe o valor da sua conta ou seu consumo mensal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {!result && (
                <>
                  <Tabs value={inputType} onValueChange={(v) => setInputType(v as "bill" | "consumption")}> 
                    <TabsList className="grid w-full grid-cols-2 h-10">
                      <TabsTrigger value="bill" className="text-sm">Valor da Conta (R$)</TabsTrigger>
                      <TabsTrigger value="consumption" className="text-sm">Consumo (kWh)</TabsTrigger>
                    </TabsList>
                    <TabsContent value="bill" className="space-y-3">
                      <div>
                        <Label htmlFor="bill" className="text-sm">Valor médio da sua conta de luz</Label>
                        <Input
                          id="bill"
                          inputMode="numeric"
                          placeholder="R$ 350,00"
                          value={billMasked}
                          onChange={handleBillChange}
                          className="mt-2 h-12 text-base"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="consumption" className="space-y-3">
                      <div>
                        <Label htmlFor="consumption" className="text-sm">Consumo mensal em kWh</Label>
                        <Input
                          id="consumption"
                          inputMode="numeric"
                          placeholder="Ex: 290"
                          value={consumptionMasked}
                          onChange={handleConsumptionChange}
                          className="mt-2 h-12 text-base"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  <Button onClick={calculate} variant="glow" size="lg" className="w-full h-12 text-base">
                    <Zap className="mr-2 h-5 w-5" />
                    Calcular Minha Economia
                  </Button>
                </>
              )}
              {result && (
                <div className="space-y-8">
                  <div className="flex justify-end">
                    <div className="grid grid-cols-4 gap-3 md:w-[420px]">
                      <Card className="p-3 text-center">
                        <Battery className="h-6 w-6 text-accent mx-auto mb-1" />
                        <p className="text-[11px] text-muted-foreground">Sistema</p>
                        <p className="text-base font-bold text-foreground">{result.systemKwp.toFixed(2)} kWp</p>
                      </Card>
                      <Card className="p-3 text-center">
                        <Grid3x3 className="h-6 w-6 text-accent mx-auto mb-1" />
                        <p className="text-[11px] text-muted-foreground">Módulos {MODULO_W}W</p>
                        <p className="text-base font-bold text-foreground">{result.modulesQty}</p>
                      </Card>
                      <Card className="p-3 text-center">
                        <Cpu className="h-6 w-6 text-accent mx-auto mb-1" />
                        <p className="text-[11px] text-muted-foreground">Inversor</p>
                        <p className="text-base font-bold text-foreground">{result.inverterKw} kW</p>
                      </Card>
                      <Card className="p-3 text-center">
                        <Zap className="h-6 w-6 text-accent mx-auto mb-1" />
                        <p className="text-[11px] text-muted-foreground">Geração</p>
                        <p className="text-base font-bold text-foreground">{result.generation.toFixed(0)} kWh/mês</p>
                      </Card>
                    </div>
                  </div>
                  {(() => {
                    const preferred = result.options.find(o => o.months === 72) || result.options[result.options.length - 1];
                    const displayPlan = selectedPlan || viewingPlan || preferred;
                    const savingsPercentage = Math.round((displayPlan.monthlySavings / result.currentBill) * 100);
                    return (
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2">
                          <div className="relative h-64 w-full flex items-center justify-start md:pl-2">
                            <svg viewBox="0 0 36 36" className="h-64 w-64">
                              <defs>
                                <linearGradient id="gradEconomy" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#ef4444" />
                                  <stop offset="50%" stopColor="#f59e0b" />
                                  <stop offset="75%" stopColor="#facc15" />
                                  <stop offset="100%" stopColor="#22c55e" />
                                </linearGradient>
                                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                  <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#22c55e" flood-opacity="0.35" />
                                </filter>
                              </defs>
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" strokeLinecap="round" />
                              <motion.path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#gradEconomy)" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" animate={{ strokeDasharray: `${savingsPercentage}, 100` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <div className="flex items-baseline gap-1">
                                <AnimatedInteger value={savingsPercentage} className="text-3xl font-bold text-accent" />
                                <span className="text-2xl font-semibold text-accent">%</span>
                              </div>
                              <span className="text-sm text-muted-foreground">Economia mensal</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 md:w-[420px] md:ml-auto">
                          <Card className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <TrendingDown className="h-5 w-5 text-red-500" />
                              <span className="text-xs font-semibold">Conta atual</span>
                            </div>
                            <AnimatedCurrency value={result.currentBill} className="text-2xl font-bold text-red-500" />
                          </Card>
                          <Card className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Wallet className="h-4 w-4 text-accent" />
                              <span className="text-xs font-semibold">Nova parcela</span>
                            </div>
                            <AnimatedCurrency value={displayPlan.monthlyPayment} className="text-2xl font-bold text-accent" />
                          </Card>
                          <Card className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <PiggyBank className="h-4 w-4 text-accent" />
                              <span className="text-xs font-semibold">Economia mensal</span>
                            </div>
                            <AnimatedCurrency value={displayPlan.monthlySavings} className="text-2xl font-bold text-green-500" />
                            <p className="text-[11px] text-muted-foreground">Todo mês no seu bolso</p>
                          </Card>
                        </div>
                      </div>
                    );
                  })()}
                  <div>
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-center">Escolha seu plano MOREIRA SOLAR</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {result.options.map((option) => {
                          const isMostChosen = option.months === 72;
                          const retornoAnos = option.monthlySavings > 0 ? Math.max(0, (result.systemKwp * CUSTO_POR_KWP) / option.monthlySavings / 12) : 0;
                          return (
                            <motion.div key={option.months} variants={itemVariants} whileHover={{ scale: 1.02 }} onMouseEnter={() => setViewingPlan(option)} onMouseLeave={() => setViewingPlan(null)}>
                              <Card className={`border p-4 cursor-pointer hover:border-accent ${selectedPlan?.months === option.months ? 'ring-2 ring-accent' : ''} ${viewingPlan?.months === option.months && !selectedPlan ? 'ring-1 ring-accent/50' : ''}`} onClick={() => setSelectedPlan(option)}>
                                <CardHeader className="pt-1 pb-1">
                                  <div className="flex items-center justify-end">
                                    {isMostChosen && <Badge>Mais escolhido</Badge>}
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <div className="text-center">
                                    <div className="text-xs text-muted-foreground">{option.months}x parcelas de</div>
                                    <div className="text-2xl font-bold">R$ {option.monthlyPayment.toFixed(2)}</div>
                                  </div>
                                  <div className="flex justify-between text-[11px]">
                                    <span className="text-muted-foreground">Mensal</span>
                                    <span className="text-sm font-bold text-green-500">R$ {option.monthlySavings.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-[11px]">
                                    <span className="text-muted-foreground">Anual</span>
                                    <span className="text-sm font-bold text-green-700">R$ {option.yearlySavings.toFixed(2)}</span>
                                  </div>
                                  <Separator />
                                  <div className="flex justify-between text-[11px]">
                                    <span className="text-muted-foreground">Retorno</span>
                                    <span className="text-sm font-bold text-foreground">{retornoAnos.toFixed(1)} anos</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {selectedPlan && (
                    <div className="rounded-lg border bg-card p-4">
                      <LeadCaptureForm calculationData={{ systemKwp: result.systemKwp, currentBill: result.currentBill, selectedPlan }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Calculator;
const AnimatedCurrency = ({ value, className }: { value: number; className?: string }) => {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(mv.get(), value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v as number),
    });
    return () => {
      controls.stop();
    };
  }, [value]);
  return (
    <span className={className}>
      {`R$ ${display.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
    </span>
  );
};

const AnimatedInteger = ({ value, className }: { value: number; className?: string }) => {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(mv.get(), value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v as number),
    });
    return () => {
      controls.stop();
    };
  }, [value]);
  return <span className={className}>{Math.round(display)}</span>;
};