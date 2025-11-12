import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-solar.jpg";

const Hero = () => {
  const scrollToCalculator = () => {
    const element = document.getElementById("calculadora");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/5565999999999", "_blank");
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(10, 20, 74, 0.85), rgba(10, 20, 74, 0.75)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="container relative z-10 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
          Troque sua conta de luz por uma parcela menor
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
          Financiamento direto pela Moreira Solar, com instalação e homologação inclusas
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={scrollToCalculator}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8 shadow-glow-accent"
          >
            Calcular minha economia
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleWhatsApp}
            className="border-white text-white hover:bg-white/10 font-semibold text-lg px-8"
          >
            Falar no WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
