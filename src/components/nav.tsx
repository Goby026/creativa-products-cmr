import { Badge } from "@/components/ui/badge";
import { settingString } from "@/lib/api";
import { useProduct } from "@/context/product-context";

export function Nav() {
  const { data } = useProduct();
  const brand = settingString(data.settings, "brand.nav", "Creativa Melatech");
  const [first, ...rest] = brand.split(" ");

  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-border/80 bg-background/90 px-5 py-4 backdrop-blur-md md:px-10">
      <a
        href="/"
        className="font-heading text-lg font-bold tracking-wide text-foreground"
      >
        <span className="text-primary">{first}</span>
        {rest.length > 0 ? ` ${rest.join(" ")}` : ""}
      </a>
      <Badge className="animate-pulse bg-destructive px-3 uppercase tracking-widest text-white">
        🔥 Oferta limitada
      </Badge>
    </nav>
  );
}
