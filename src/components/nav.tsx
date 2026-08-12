import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { settingString } from "@/lib/api";
import { useProduct } from "@/context/product-context";

export function Nav() {
  const { data } = useProduct();
  const brand = settingString(data.settings, "brand.nav", "Creativa Melatech");
  const [first, ...rest] = brand.split(" ");

  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-border/60 bg-background/85 px-5 py-3.5 backdrop-blur-md md:px-10">
      <a href="/" className="flex items-center gap-2.5">
        <img
          src="/logo-cm.png"
          alt="Creativa Melatech"
          className="size-9 rounded-lg bg-white object-contain ring-1 ring-border"
        />
        <span className="font-heading text-lg font-bold tracking-wide text-foreground">
          <span className="text-primary">{first}</span>
          {rest.length > 0 ? ` ${rest.join(" ")}` : ""}
        </span>
      </a>

      <div className="flex items-center gap-2">
        <Badge className="hidden gap-1 border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-destructive sm:inline-flex">
          <Flame className="size-3.5" />
          Oferta limitada
        </Badge>
        <ThemeToggle />
        <Button
          size="sm"
          variant="default"
          className="hidden rounded-full px-4 md:inline-flex"
          onClick={() =>
            document
              .getElementById("comprar")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Pedir ahora
        </Button>
      </div>
    </nav>
  );
}
