import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-white.png";

const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/5565999999999", "_blank");
  };

  return (
    <header className="sticky top-0 z-[60] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          Falar no WhatsApp
        </Button>
      </div>
    </header>
  );
};

export default Header;
