import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import logo from "@/assets/logo-white.png";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });

      if (id === "calculadora") {
        setTimeout(() => {
          const billInput = document.getElementById("bill") as HTMLInputElement;
          const consumptionInput = document.getElementById("consumption") as HTMLInputElement;
          const activeInput = billInput?.offsetParent ? billInput : consumptionInput;
          activeInput?.focus();
        }, 800);
      }
    }
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/5565999999999", "_blank");
  };

  return (
    <header className={`fixed top-0 z-[60] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <img src={logo} alt="Moreira Solar" className="h-12 w-auto" />
          <nav className="hidden md:flex gap-6">
            <button
              onClick={() => scrollToSection("calculadora")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Calculadora
            </button>
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection("modelos")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Modelos
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Contato
            </button>
          </nav>
        </div>
        <Button onClick={handleWhatsApp} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          <MessageCircle className="mr-2 h-4 w-4" />
          Falar com Especialista
        </Button>
      </div>
    </header>
  );
};

export default Header;
