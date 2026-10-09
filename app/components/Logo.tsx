import Link from "next/link";
import Image from "next/image";

export function Logo({ light = false, image = "/logo-minasfer.png", name = "Minas Fer & Minas Gerais", shortName = "Minas Fer", tagline = "Materiais de serralheria e tornearia" }: { light?: boolean; image?: string; name?: string; shortName?: string; tagline?: string }) {
  const secondaryName = name.toLowerCase().startsWith(shortName.toLowerCase()) ? name.slice(shortName.length).trim() : name;
  return (
    <Link href="/" className={"brand" + (light ? " brand-light" : "")} aria-label={name + " - início"}>
      <span className="brand-mark" aria-hidden="true">
        <Image src={image} alt="" width={52} height={52} priority unoptimized />
      </span>
      <span className="brand-copy">
        <strong>{shortName.toUpperCase()}</strong>
        <em>{secondaryName.toUpperCase()}</em>
        <small>{tagline.toUpperCase()}</small>
      </span>
    </Link>
  );
}
