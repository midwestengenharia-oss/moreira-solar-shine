import Header from "@/components/Header";
import Benefits from "@/components/Benefits";
import Calculator from "@/components/Calculator";
import SocialProof from "@/components/SocialProof";
import HowItWorksAndModels from "@/components/HowItWorksAndModels";
import FAQContact from "@/components/FAQContact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      {/* Padding-top para compensar Header (80px) + Banner (~56px) = ~136px */}
      <main className="pt-[136px]">
        {/* 1. HERO - Calculadora como ponto de entrada principal */}
        <Calculator />

        {/* 2. BENEFÍCIOS - Por que energia solar? */}
        <Benefits />

        {/* 3. PROVA SOCIAL - Números + Depoimentos (seção unificada) */}
        <SocialProof />

        {/* 4. PROCESSO + MODELOS - Como funciona e opções disponíveis */}
        <HowItWorksAndModels />

        {/* 5. FAQ + CONTATO - Última oportunidade de conversão */}
        <FAQContact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
