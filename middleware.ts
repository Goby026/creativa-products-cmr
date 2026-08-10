export const config = {
  matcher: ["/", "/esquinero-5-niveles"],
};

const SITE_URL = "https://creativamelatech.com";
const CANONICAL_PATH = "/esquinero-5-niveles";

type Seo = { title?: string; description?: string; og_image?: string };

const DEFAULTS: Seo = {
  title: "Estante Vertical 5 Niveles | Creativa Melatech — Huancayo",
  description:
    "Estante esquinero vertical de 5 niveles en melamina de 15 mm. Soporta 30 kg por bandeja. S/ 120. Fabricado en Huancayo con envío local.",
  og_image: "/esquinero1.jpg",
};

const CRAWLER_RE =
  /Googlebot|bingbot|twitterbot|facebookexternalhit|whatsapp|LinkedInBot|slackbot|telegrambot|discordbot|pinterest|DuckDuckBot|YandexBot|SemrushBot|AhrefsBot/i;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function absolute(path: string | undefined): string {
  if (!path) return `${SITE_URL}${DEFAULTS.og_image}`;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : "/" + path}`;
}

type SeoData = {
  seo: Seo;
  product: { name: string; price: number; currency: string } | null;
};

async function fetchSeoData(): Promise<SeoData | null> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const headers = { apikey: key, Authorization: `Bearer ${key}` };
    const [settingsRes, productRes] = await Promise.all([
      fetch(`${url}/rest/v1/site_settings?select=key,value`, { headers }),
      fetch(
        `${url}/rest/v1/products?select=name,price,currency&active=eq.true&order=sort_order.asc&limit=1`,
        { headers },
      ),
    ]);
    if (!settingsRes.ok) return null;
    const settings = (await settingsRes.json()) as Array<{ key: string; value: Seo }>;
    const seoRow = settings.find((s) => s.key === "seo");
    const seo = { ...DEFAULTS, ...seoRow?.value };
    let product: SeoData["product"] = null;
    if (productRes.ok) {
      const products = (await productRes.json()) as Array<{
        name: string;
        price: number;
        currency: string;
      }>;
      product = products[0] ?? null;
    }
    return { seo, product };
  } catch {
    return null;
  }
}

function buildMeta(data: SeoData): string {
  const seo = data.seo;
  const image = absolute(seo.og_image);
  const title = escapeHtml(seo.title ?? DEFAULTS.title ?? "");
  const description = escapeHtml(seo.description ?? DEFAULTS.description ?? "");
  const canonical = `${SITE_URL}${CANONICAL_PATH}`;

  const offers = data.product
    ? {
        "@type": "Offer",
        url: canonical,
        priceCurrency: data.product.currency === "$" ? "USD" : "PEN",
        price: String(data.product.price),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
      }
    : null;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: seo.title ?? DEFAULTS.title,
    image: [image],
    description: seo.description ?? DEFAULTS.description,
    brand: { "@type": "Brand", name: "Creativa Melatech" },
    sku: "CM-EV-5N",
    ...(offers ? { offers } : {}),
  });

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="product" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:site_name" content="Creativa Melatech" />`,
    `<meta property="og:locale" content="es_PE" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join("\n    ");
}

function inject(html: string, block: string): string {
  let out = html
    .replace(/<title>[^<]*<\/title>/i, "")
    .replace(
      /<meta[^>]*(?:name|property)="(?:description|og:|twitter:)[^>]*>/gi,
      "",
    )
    .replace(/<link[^>]*rel="canonical"[^>]*>/gi, "")
    .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, "");
  return out.replace("</head>", `  ${block}\n  </head>`);
}

export default async function middleware(request: Request): Promise<Response> {
  const ua = request.headers.get("user-agent") ?? "";
  const isCrawler = CRAWLER_RE.test(ua);

  const indexUrl = new URL("/index.html", request.url);
  const original = await fetch(indexUrl);
  const html = await original.text();

  if (!isCrawler) {
    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, s-maxage=60",
      },
    });
  }

  const data = await fetchSeoData();
  const block = buildMeta(data ?? { seo: DEFAULTS, product: null });
  const transformed = inject(html, block);

  return new Response(transformed, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
