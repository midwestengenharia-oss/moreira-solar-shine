import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Calculator from "@/components/Calculator";
import HowItWorks from "@/components/HowItWorks";
import BusinessModels from "@/components/BusinessModels";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Calculator />
        <HowItWorks />
        <BusinessModels />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
