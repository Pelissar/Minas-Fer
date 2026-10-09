import { ArrowUpRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import type { Equipment } from "@/lib/data";
import { whatsappUrl } from "@/lib/data";

export function EquipmentCard({ item, whatsappNumber }: { item: Equipment; whatsappNumber?: string }) {
  return (
    <article className="equipment-card">
      <Image src={item.image} alt={item.name} width={1000} height={700} unoptimized />
      <div className="equipment-card-content">
        <span className="card-kicker">{item.category}</span>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <ul>
          {item.specs.map((spec) => <li key={spec}>{spec}</li>)}
        </ul>
        <a className="button button-outline" href={whatsappUrl("Olá! Gostaria de consultar a disponibilidade de " + item.name + ".", whatsappNumber)} target="_blank" rel="noreferrer">
          <CalendarDays size={17} />
          Consultar disponibilidade
          <ArrowUpRight size={16} />
        </a>
      </div>
    </article>
  );
}
