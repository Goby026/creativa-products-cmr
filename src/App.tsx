import { useState } from "react";
import { BottomCta } from "@/components/bottom-cta";
import { DeliveryStrip } from "@/components/delivery-strip";
import { Dimensions } from "@/components/dimensions";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SpecsStrip } from "@/components/specs-strip";
import { ToastProvider } from "@/components/toast";
import { Uses } from "@/components/uses";
import { useReveal } from "@/hooks/use-reveal";

export default function App() {
  const [color, setColor] = useState("Blanco");
  useReveal();

  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}
