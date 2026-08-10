const ITEMS = [
  { icon: "🚚", text: "Envío en Huancayo según tarifa del transportista" },
  { icon: "📅", text: "Fabricación semanal · Entrega coordinada" },
  { icon: "🤝", text: "Acepta contra entrega" },
  { icon: "💛", text: "Yape · Plin · Efectivo" },
];

export function DeliveryStrip() {
  return (
    <div className="reveal flex flex-wrap items-center justify-center gap-5 bg-primary px-6 py-7 md:gap-10">
      {ITEMS.map((item) => (
        <div
          key={item.text}
          className="flex items-center gap-2.5 text-sm font-medium text-white"
        >
          <span className="text-xl">{item.icon}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
