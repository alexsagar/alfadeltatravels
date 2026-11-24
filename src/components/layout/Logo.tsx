import Image from "next/image";
import logo from "../../../public/brand/alfa-delta-logo.svg";

// Official vector logo (public/brand/alfa-delta-logo(1).svg; alfa-delta-logo.svg
// is the same artwork with a tighter viewBox). Transparent, with black and
// light-grey parts, so it is only ever placed on a light surface: the header
// and footer are cool white for that reason.
export function Logo({ className, eager }: { className?: string; eager?: boolean }) {
  return <Image src={logo} alt="Alfa Delta Travels" loading={eager ? "eager" : undefined} unoptimized className={className} />;
}
