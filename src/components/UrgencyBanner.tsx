import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock } from "lucide-react";

const UrgencyBanner = () => {
  // Define target date - 15 dias a partir de hoje
  const getTargetDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    date.setHours(23, 59, 59, 999);
    return date;
  };

  const [targetDate] = useState(getTargetDate());
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
  }, [targetDate]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsMenuVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsMenuVisible(false);
      } else {
        setIsMenuVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleBannerClick = () => {
    const calculatorSection = document.getElementById("calculadora");
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        const billInput = document.getElementById("bill") as HTMLInputElement;
        const consumptionInput = document.getElementById("consumption") as HTMLInputElement;
        const activeInput = billInput?.offsetParent ? billInput : consumptionInput;
        activeInput?.focus();
      }, 800);
    }
  };

  return (
    <div
      onClick={handleBannerClick}
      className={`fixed z-50 w-full bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white py-3 px-4 shadow-lg cursor-pointer hover:opacity-95 transition-all duration-300 animate-banner-pulse ${isMenuVisible ? 'top-20' : 'top-0'}`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 animate-zap-bounce" />
            <span className="font-bold text-sm md:text-base">CONDIÇÃO ESPECIAL</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4" />
            <span className="text-xs md:text-sm font-semibold">Termina em:</span>
            <div className="flex gap-2">
              <div className="bg-white/20 backdrop-blur px-2 py-1 rounded text-xs md:text-sm">
                <span className="font-bold">{timeLeft.days}d</span>
              </div>
              <div className="bg-white/20 backdrop-blur px-2 py-1 rounded text-xs md:text-sm">
                <span className="font-bold">{timeLeft.hours}h</span>
              </div>
              <div className="bg-white/20 backdrop-blur px-2 py-1 rounded text-xs md:text-sm">
                <span className="font-bold">{timeLeft.minutes}m</span>
              </div>
              <div className="bg-white/20 backdrop-blur px-2 py-1 rounded text-xs md:text-sm">
                <span className="font-bold">{timeLeft.seconds}s</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-white/30 text-white border-white/40 font-bold">
              Tempo limitado
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrgencyBanner;
