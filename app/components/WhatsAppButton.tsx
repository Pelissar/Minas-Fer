import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/data";

export function WhatsAppButton({ label = "Fale pelo WhatsApp", message = "Olá! Gostaria de falar com a Minas Fer.", whatsappNumber }: { label?: string; message?: string; whatsappNumber?: string }) {
  return (
    <a className="button button-primary" href={whatsappUrl(message, whatsappNumber)} target="_blank" rel="noreferrer">
      <MessageCircle size={18} />
      {label}
    </a>
  );
}
