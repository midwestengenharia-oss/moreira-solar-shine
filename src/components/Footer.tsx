import logo from "@/assets/logo.png";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <img src={logo} alt="Moreira Solar" className="h-12 w-auto mb-4 brightness-0 invert" />
            <p className="text-sm opacity-80 mb-4">
              Tornando a energia solar acessível, sustentável e financeiramente vantajosa.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <div className="space-y-2 text-sm opacity-80">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                (65) 99999-9999
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                contato@moreirasolar.com.br
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Mato Grosso, Brasil
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Sobre</h3>
            <div className="space-y-2 text-sm opacity-80">
              <p><strong>Missão:</strong> Tornar a energia solar acessível</p>
              <p><strong>Visão:</strong> Referência no Centro-Oeste</p>
              <p><strong>Valores:</strong> Sustentabilidade, transparência e inovação</p>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} Moreira Solar. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
