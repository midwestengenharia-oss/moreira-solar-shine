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
import { Calculator as CalcIcon, Zap, TrendingUp, TrendingDown, Battery, Grid3x3, Cpu, Star, ArrowLeft, Wallet, PiggyBank, ChevronDown, Gift } from "lucide-react";
import LeadCaptureForm from "./LeadCaptureForm";
import UrgencyBanner from "./UrgencyBanner";

interface FinancingOption {
  months: number;
  monthlyPayment: number;
  monthlySavings: number;
  yearlySavings: number;
  financingPeriodSavings: number;
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
const REAJUSTE_ANUAL_ENERGIA = 0.08; // 8% ao ano

// Calcula o retorno do investimento:
// - Investimento total = parcela × meses de financiamento
// - Economia mensal = geração × tarifa (crescente 8%/ano)
// - Retorno = quando economia acumulada >= investimento total
const calcularRetornoInvestimento = (
  contaSemSolarInicial: number,
  parcelaFixa: number,
  mesesFinanciamento: number
): number => {
  const investimentoTotal = parcelaFixa * mesesFinanciamento;
  let economiaAcumulada = 0;
  let mes = 0;
  let economiaMensalAtual = contaSemSolarInicial;

  // Simula mês a mês até a economia acumulada >= investimento total
  while (economiaAcumulada < investimentoTotal && mes < 360) { // limite de 30 anos
    mes++;

    // A cada 12 meses, aplica o reajuste de 8% na economia
    // (tarifa sobe, então a economia de não pagar também sobe)
    if (mes > 1 && mes % 12 === 1) {
      economiaMensalAtual *= (1 + REAJUSTE_ANUAL_ENERGIA);
    }

    // Acumula a economia mensal (quanto deixou de pagar na conta de luz)
    economiaAcumulada += economiaMensalAtual;
  }

  return mes / 12; // retorna em anos
};

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

      // Calcula economia total durante o período de financiamento com reajustes anuais
      const anos = months / 12;
      let economiaTotalParcelamento = 0;
      for (let ano = 0; ano < anos; ano++) {
        const economiaMensalAjustada = economiaMensal * Math.pow(1 + REAJUSTE_ANUAL_ENERGIA, ano);
        economiaTotalParcelamento += economiaMensalAjustada * 12;
      }

      return {
        months,
        monthlyPayment: parcela,
        monthlySavings: economiaMensal,
        yearlySavings: economiaAnual,
        financingPeriodSavings: economiaTotalParcelamento,
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
    <section id="calculadora" className="relative pt-8 pb-12 md:pt-12 md:pb-16">
      <UrgencyBanner />
      <div className="mx-auto w-full px-4 md:px-6">
        <Card className="mx-auto w-full max-w-[1100px] border-border">
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-1">
                <CalcIcon className="h-7 w-7 text-green-600" />
                <div>
                  <CardTitle className="text-2xl md:text-3xl text-foreground">
                    {!result ? "Calcule sua economia" : "Sua economia real"}
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {!result
                      ? "Simule e descubra quanto você pode economizar todo mês com energia solar."
                      : "Compare os planos e escolha o prazo ideal para você"
                    }
                  </CardDescription>
                </div>
                {result && (
                  <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:border-green-700 hover:text-green-700 hover:bg-transparent" onClick={handleReset}>
                    <ArrowLeft className="mr-1 h-4 w-4" /> Nova simulação
                  </Button>
                )}
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Badge variant="glow" className="text-sm px-4 py-1.5 flex items-center gap-1.5">
                  <Gift className="h-4 w-4" />
                  1ª parcela só em 30 dias após instalação
                </Badge>
                <div className="text-xs text-muted-foreground text-center space-y-0.5">
                  <div>R$0 de entrada</div>
                  <div>Parcelas até 30% menores</div>
                </div>
              </div>
            </div>
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
                        <Label htmlFor="bill" className="text-sm font-semibold">Quanto você paga por mês?</Label>
                        <Input
                          id="bill"
                          inputMode="numeric"
                          placeholder="Ex: R$ 450,00 (sua conta média)"
                          value={billMasked}
                          onChange={handleBillChange}
                          className="mt-2 h-12 text-base"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="consumption" className="space-y-3">
                      <div>
                        <Label htmlFor="consumption" className="text-sm font-semibold">Quanto você consome por mês?</Label>
                        <Input
                          id="consumption"
                          inputMode="numeric"
                          placeholder="Ex: 350 kWh (veja na sua conta)"
                          value={consumptionMasked}
                          onChange={handleConsumptionChange}
                          className="mt-2 h-12 text-base"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  <Button onClick={calculate} variant="glow" size="lg" className="w-full h-12 text-base font-semibold">
                    <Zap className="mr-2 h-5 w-5" />
                    VER QUANTO VOU ECONOMIZAR
                  </Button>
                </>
              )}
              {result && (
                <div className="space-y-8">
                  {(() => {
                    const preferred = result.options.find(o => o.months === 72) || result.options[result.options.length - 1];
                    const displayPlan = selectedPlan || viewingPlan || preferred;
                    const savingsPercentage = Math.round((displayPlan.monthlySavings / result.currentBill) * 100);
                    return (
                      <div className="space-y-4">
                        {/* ECONOMIA + ESPECIFICAÇÕES TÉCNICAS - OTIMIZADO */}
                        <div className="grid md:grid-cols-3 gap-4">
                          {/* Coluna esquerda: 2/3 (Custo + Parcela + Specs) */}
                          <div className="md:col-span-2 flex flex-col gap-4">
                            {/* Linha 1: 2 cards lado a lado (compactos) */}
                            <div className="grid grid-cols-2 gap-4">
                              <Card className="p-3 text-center border-red-500/30 bg-red-500/5">
                                <p className="text-xs text-muted-foreground mb-1">Você paga hoje</p>
                                <AnimatedCurrency value={result.currentBill} className="text-xl font-bold text-red-500" />
                                <p className="text-xs text-muted-foreground mt-1 px-2">Custo Energisa</p>
                              </Card>

                              <Card className="p-3 text-center border-accent/30 bg-accent/10">
                                <p className="text-xs text-muted-foreground mb-1">Você vai pagar</p>
                                <AnimatedCurrency value={displayPlan.monthlyPayment} className="text-xl font-bold text-accent" />
                                <p className="text-xs text-muted-foreground mt-1 px-2">Parcela Moreira Solar</p>
                              </Card>
                            </div>

                            {/* Linha 2: Especificações do Sistema */}
                            <Card className="p-4 border-border bg-background/50 flex-1">
                              <h4 className="text-xs font-semibold text-muted-foreground mb-3 text-center">Especificações do Sistema</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="text-center">
                                  <Battery className="h-5 w-5 text-accent mx-auto mb-1" />
                                  <p className="text-xs text-muted-foreground">Potência</p>
                                  <p className="text-sm font-bold text-foreground">{result.systemKwp.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWp</p>
                                </div>
                                <div className="text-center">
                                  <Grid3x3 className="h-5 w-5 text-accent mx-auto mb-1" />
                                  <p className="text-xs text-muted-foreground">Módulos 620W</p>
                                  <p className="text-sm font-bold text-foreground">{result.modulesQty} un</p>
                                </div>
                                <div className="text-center">
                                  <Cpu className="h-5 w-5 text-accent mx-auto mb-1" />
                                  <p className="text-xs text-muted-foreground">Inversor</p>
                                  <p className="text-sm font-bold text-foreground">{result.inverterKw} kW</p>
                                </div>
                                <div className="text-center">
                                  <Zap className="h-5 w-5 text-accent mx-auto mb-1" />
                                  <p className="text-xs text-muted-foreground">Geração</p>
                                  <p className="text-sm font-bold text-foreground">{result.generation.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} kWh</p>
                                </div>
                              </div>
                            </Card>
                          </div>

                          {/* Coluna direita: 1/3 (Card verde de economias) */}
                          <div className="md:col-span-1">
                            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 h-full">
                              <div className="space-y-2">
                                <Card className="p-3 text-center border-border bg-background/50">
                                  <p className="text-xs text-muted-foreground mb-1">Desconto de</p>
                                  <div className="flex items-baseline justify-center gap-1">
                                    <AnimatedInteger value={savingsPercentage} className="text-3xl font-bold text-green-500" />
                                    <span className="text-xl font-bold text-green-500">%</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1 px-2">Conta de luz</p>
                                </Card>

                                <Card className="p-3 border-border bg-background/50">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Economia mensal</span>
                                    <AnimatedCurrency value={displayPlan.monthlySavings} className="text-sm font-bold text-green-500" />
                                  </div>
                                </Card>

                                <Card className="p-3 border-border bg-background/50">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Economia parcelamento</span>
                                    <AnimatedCurrency value={displayPlan.financingPeriodSavings} className="text-sm font-bold text-green-600" />
                                  </div>
                                </Card>
                              </div>
                            </Card>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  {/* 3. Planos de Financiamento com CTA forte */}
                  <div className="relative">
                    {/* Destaque visual forte para induzir scroll */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="text-center space-y-4 mb-8 py-8 relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent blur-xl"></div>
                      <div className="relative">
                        <Badge variant="glow" className="mb-3 text-sm px-4 py-1">
                          Próxima Etapa
                        </Badge>
                        <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent via-green-500 to-accent bg-clip-text text-transparent mb-3">
                          Escolha o Prazo do Seu Financiamento
                        </h3>
                        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                          Quanto maior o prazo, menor a parcela e maior a economia mensal
                        </p>
                        <motion.div
                          animate={{ y: [0, 8, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="mt-4"
                        >
                          <TrendingDown className="h-6 w-6 mx-auto text-accent rotate-90" />
                        </motion.div>
                      </div>
                    </motion.div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {result.options.map((option) => {
                          const isMostChosen = option.months === 72;
                          const retornoAnos = calcularRetornoInvestimento(
                            result.currentBill,
                            option.monthlyPayment,
                            option.months
                          );
                          const isSelected = selectedPlan?.months === option.months;
                          const isViewing = viewingPlan?.months === option.months && !selectedPlan;

                          return (
                            <motion.div
                              key={option.months}
                              variants={itemVariants}
                              whileHover={{ scale: 1.03, y: -4 }}
                              onMouseEnter={() => setViewingPlan(option)}
                              onMouseLeave={() => setViewingPlan(null)}
                              className="h-full"
                            >
                              <Card
                                className={`relative h-full p-5 cursor-pointer transition-all duration-200 ${
                                  isSelected
                                    ? 'ring-2 ring-accent border-accent shadow-lg shadow-accent/20'
                                    : isViewing
                                    ? 'ring-1 ring-accent/50 border-accent/50'
                                    : 'hover:border-accent/50'
                                }`}
                                onClick={() => setSelectedPlan(option)}
                              >
                                {isMostChosen && (
                                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge variant="glow" className="shadow-lg">
                                      <Star className="h-3 w-3 mr-1" /> Mais escolhido
                                    </Badge>
                                  </div>
                                )}

                                <div className="space-y-4">
                                  <div className="text-center pt-2">
                                    <p className="text-sm text-muted-foreground mb-1">Parcelado em</p>
                                    <p className="text-3xl font-bold text-accent mb-1">{option.months}x</p>
                                    <div className="h-px bg-border my-3"></div>
                                    <p className="text-xs text-muted-foreground mb-1">Parcela mensal de</p>
                                    <p className="text-2xl font-bold text-foreground">R$ {option.monthlyPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                  </div>

                                  <div className="space-y-2 pt-2 border-t">
                                    <div className="flex flex-col items-center text-center p-2 rounded bg-green-500/10 gap-1">
                                      <span className="text-xs text-muted-foreground">Economia mensal</span>
                                      <span className="text-sm font-bold text-green-500">R$ {option.monthlySavings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-2 rounded bg-green-600/10 gap-1">
                                      <span className="text-xs text-muted-foreground">Economia durante o parcelamento</span>
                                      <span className="text-sm font-bold text-green-600">R$ {option.financingPeriodSavings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-2 rounded bg-accent/10 gap-1">
                                      <span className="text-xs text-muted-foreground">Retorno do investimento</span>
                                      <span className="text-sm font-bold text-accent">{retornoAnos.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} anos</span>
                                    </div>
                                  </div>

                                  {isSelected && (
                                    <div className="pt-2">
                                      <Button variant="glow" size="sm" className="w-full">
                                        Plano Selecionado
                                      </Button>
                                    </div>
                                  )}
                                </div>
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