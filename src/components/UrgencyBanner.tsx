import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Flame, Clock, Zap } from "lucide-react";

const UrgencyBanner = () => {
  const targetDate = new Date('2025-11-28T23:59:59');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sticky top-20 z-40 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 text-white py-3 px-4 shadow-lg animate-pulse-slow">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 animate-bounce" />
            <span className="font-bold text-sm md:text-base">BLACK FRIDAY SOLAR</span>
            <Badge variant="glow" className="hidden md:inline-flex">
              🔥 Última chance
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 text-center">
            <Clock className="h-4 w-4" />
            <span className="text-xs md:text-sm font-semibold">Termina em:</span>
            <div className="flex gap-2">
              <div className="bg-white/20 backdrop-blur px-2 py-1 rounded">
                <span className="font-bold">{timeLeft.days}d</span>
              </div>
              <div className="bg-white/20 backdrop-blur px-2 py-1 rounded">
                <span className="font-bold">{timeLeft.hours}h</span>
              </div>
              <div className="bg-white/20 backdrop-blur px-2 py-1 rounded">
                <span className="font-bold">{timeLeft.minutes}m</span>
              </div>
              <div className="bg-white/20 backdrop-blur px-2 py-1 rounded">
                <span className="font-bold">{timeLeft.seconds}s</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-xs md:text-sm font-semibold">Parcelas até 30% menores!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrgencyBanner;
