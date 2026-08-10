import { useState } from "react";
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

function Skeleton() {
  return (
    <main className="mx-auto max-w-4xl animate-pulse px-6 py-24">
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
      <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
        <p className="text-4xl">⚠️</p>
        <h1 className="mt-3 font-heading text-xl font-bold">
          No pudimos cargar el contenido
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <a
          href="/"
          className="mt-5 inline-block text-sm font-semibold text-primary underline"
        >
          Reintentar
        </a>
      </div>
    </main>
  );
}

export function PublicSite() {
  const [color, setColor] = useState("Blanco");
  const { data, loading, error } = useProduct();
  useMeta(data.settings);
  useReveal();

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
