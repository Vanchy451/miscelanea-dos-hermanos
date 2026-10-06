import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/529541301043?text=Hola%2C%20me%20gustar%C3%ADa%20consultar%20sobre%20un%20producto."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      <MessageCircle size={28} aria-hidden="true" />
    </a>
  );
}
