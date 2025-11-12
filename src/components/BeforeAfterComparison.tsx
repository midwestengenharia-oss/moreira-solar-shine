import { useEffect, useState } from "react";
import { ArrowRight, TrendingDown, TrendingUp, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface BeforeAfterComparisonProps {
  currentBill: number;
  newPayment: number;
  monthlySavings: number;
  savingsPercentage: number;
}

const BeforeAfterComparison = ({
  currentBill,
  newPayment,
  monthlySavings,
  savingsPercentage
}: BeforeAfterComparisonProps) => {
  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  const [animatedNew, setAnimatedNew] = useState(0);
  const [animatedSavings, setAnimatedSavings] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentCount = 0;
    const currentIncrement = currentBill / steps;
    const newIncrement = newPayment / steps;
    const savingsIncrement = monthlySavings / steps;
    
    const timer = setInterval(() => {
      currentCount++;
      setAnimatedCurrent(Math.min(currentCount * currentIncrement, currentBill));
      setAnimatedNew(Math.min(currentCount * newIncrement, newPayment));
      setAnimatedSavings(Math.min(currentCount * savingsIncrement, monthlySavings));
      
      if (currentCount >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [currentBill, newPayment, monthlySavings]);

  return (
    <div className="relative bg-gradient-to-r from-red-50 via-white to-green-50 dark:from-red-950/20 dark:via-background dark:to-green-950/20 rounded-lg p-6 shadow-3d">
      <Badge variant="glow" className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        ECONOMIZE {savingsPercentage}% TODO MÊS
      </Badge>
      
      <div className="grid md:grid-cols-2 gap-6 mt-4">
        {/* SEM SOLAR */}
        <div className="bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950/30 dark:to-red-900/20 rounded-lg p-6 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <span className="font-bold text-red-600 text-sm">SEM SOLAR</span>
          </div>
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">Conta atual</p>
            <p className="text-3xl font-bold text-red-600">
              R$ {animatedCurrent.toFixed(2)}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <X className="h-4 w-4 text-red-500" />
              <span>Sem retorno</span>
            </div>
          </div>
        </div>

        {/* COM MOREIRA SOLAR */}
        <div className="bg-gradient-to-br from-green-100 to-yellow-50 dark:from-green-950/30 dark:to-yellow-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="font-bold text-green-600 text-sm">COM MOREIRA SOLAR</span>
          </div>
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">Nova parcela</p>
            <p className="text-3xl font-bold text-green-600">
              R$ {animatedNew.toFixed(2)}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-accent">
              <Check className="h-4 w-4 text-green-600" />
              <span>Patrimônio próprio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-accent">Você economiza mensalmente:</span>
          <span className="text-xl font-bold text-accent">R$ {animatedSavings.toFixed(2)}</span>
        </div>
        <Progress value={savingsPercentage} className="h-3" />
      </div>
    </div>
  );
};

export default BeforeAfterComparison;
