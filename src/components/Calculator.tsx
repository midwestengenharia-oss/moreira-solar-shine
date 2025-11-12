import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calculator as CalcIcon, Zap } from "lucide-react";

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

const Calculator = () => {
  const [inputType, setInputType] = useState<"bill" | "consumption">("bill");
  const [billValue, setBillValue] = useState("");
  const [consumptionValue, setConsumptionValue] = useState("");
  const [result, setResult] = useState<CalculationResult | null>(null);

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
  };

  return (
    <section id="calculadora" className="py-20 bg-muted">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Calcule sua Economia
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra quanto você pode economizar com energia solar
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="border-border shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalcIcon className="h-6 w-6 text-accent" />
                Calculadora de Financiamento
              </CardTitle>
              <CardDescription>
                Informe o valor da sua conta ou seu consumo mensal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={inputType} onValueChange={(v) => setInputType(v as "bill" | "consumption")}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="bill">Valor da Conta (R$)</TabsTrigger>
                  <TabsTrigger value="consumption">Consumo (kWh)</TabsTrigger>
                </TabsList>
                <TabsContent value="bill" className="space-y-4">
                  <div>
                    <Label htmlFor="bill">Valor médio da sua conta de luz</Label>
                    <Input
                      id="bill"
                      type="number"
                      placeholder="Ex: 350"
                      value={billValue}
                      onChange={(e) => setBillValue(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="consumption" className="space-y-4">
                  <div>
                    <Label htmlFor="consumption">Consumo mensal em kWh</Label>
                    <Input
                      id="consumption"
                      type="number"
                      placeholder="Ex: 290"
                      value={consumptionValue}
                      onChange={(e) => setConsumptionValue(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              <Button onClick={calculate} className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                <Zap className="mr-2 h-5 w-5" />
                Calcular Economia
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="mt-8 space-y-6">
              <Card className="border-border bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-sm opacity-80">Sistema</p>
                      <p className="text-2xl font-bold">{result.systemKwp.toFixed(2)} kWp</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Módulos</p>
                      <p className="text-2xl font-bold">{result.modulesQty}x {MODULO_W}W</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Inversor</p>
                      <p className="text-2xl font-bold">{result.inverterKw} kW</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Geração Mensal</p>
                      <p className="text-2xl font-bold">{result.generation.toFixed(0)} kWh</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Conta Atual</p>
                      <p className="text-2xl font-bold">R$ {result.currentBill.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Consumo</p>
                      <p className="text-2xl font-bold">{result.consumption.toFixed(0)} kWh</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.options.map((option) => (
                  <Card key={option.months} className="border-border hover:shadow-card-hover transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-center text-2xl">{option.months}x</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Parcela Mensal</p>
                        <p className="text-2xl font-bold text-primary">
                          R$ {option.monthlyPayment.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center pt-3 border-t border-border">
                        <p className="text-sm text-muted-foreground">Economia Mensal</p>
                        <p className="text-xl font-bold text-accent">
                          R$ {option.monthlySavings.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Economia Anual</p>
                        <p className="text-lg font-semibold text-accent">
                          R$ {option.yearlySavings.toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Calculator;
