import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { SpecsStrip } from "@/components/specs-strip";
import { Features } from "@/components/features";
import { Dimensions } from "@/components/dimensions";
import { Uses } from "@/components/uses";
import { DeliveryStrip } from "@/components/delivery-strip";
import { BottomCta } from "@/components/bottom-cta";
import { Footer } from "@/components/footer";
import { useProduct } from "@/context/product-context";
import { useMeta } from "@/hooks/use-meta";
import { useReveal } from "@/hooks/use-reveal";
import { trackVisit } from "@/lib/analytics";

function Skeleton() {
  return (
    <main className="container-page animate-pulse py-28">
      <div className="mx-auto h-4 w-40 rounded bg-muted" />
      <div className="mx-auto mt-6 h-10 w-72 rounded bg-muted" />
      <div className="mx-auto mt-4 h-10 w-56 rounded bg-muted" />
      <div className="mx-auto mt-10 h-24 w-full max-w-xl rounded bg-muted" />
      <div className="mx-auto mt-10 h-12 w-full max-w-md rounded bg-muted" />
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="max-w-md rounded-2xl p-8 text-center shadow-lifted">
        <CardContent className="p-0">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="size-6 text-destructive" />
          </span>
          <CardTitle className="mt-4 font-heading text-xl font-bold">
            No pudimos cargar el contenido
          </CardTitle>
          <CardDescription className="mt-2 text-sm">{message}</CardDescription>
          <Button
            variant="default"
            className="mt-5 rounded-full"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export function PublicSite() {
  const [color, setColor] = useState("Blanco");
  const { data, loading, error } = useProduct();
  useMeta(data.settings, data.product);
  useReveal();

  useEffect(() => {
    trackVisit();
  }, []);

  if (loading) return <Skeleton />;
  if (error) return <ErrorState message={error} />;

  return (
    <>
      <Nav />
      <main>
        <Hero color={color} onColorChange={setColor} />
        <SpecsStrip />
        <Features />
        <Dimensions />
        <Uses />
        <DeliveryStrip />
        <BottomCta color={color} />
      </main>
      <Footer />
    </>
  );
}
