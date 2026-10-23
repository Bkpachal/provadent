// Static review-page generator. No dependencies: just `node build.js`.
// Reads site.json + products/*.json and writes a ready-to-deploy site into dist/.
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const site = JSON.parse(fs.readFileSync(path.join(ROOT, "site.json"), "utf8"));

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const list = (v) => (Array.isArray(v) ? v : []);
const pad = (n) => String(n).padStart(2, "0");

function layout({ title, description, canonical, body, jsonLd }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="article">
<link rel="stylesheet" href="/assets/styles.css">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
</head>
<body>
<div class="topbar">${esc(site.affiliateDisclosure)}</div>
${body}
<footer class="footer">
  <div class="wrap">
    <strong>${esc(site.siteName)}</strong>
    <p><b>Affiliate disclosure:</b> ${esc(site.affiliateDisclosure)}</p>
    <p><b>Editorial transparency:</b> ${esc(site.editorialNote)}</p>
    <p class="small">${esc(site.footerNote)} &copy; ${new Date().getFullYear()} ${esc(site.siteName)}.</p>
  </div>
</footer>
</body>
</html>`;
}

function productPage(p) {
  const url = `${site.siteUrl.replace(/\/$/, "")}/${p.slug}`;
  const cta = (cls = "btn") =>
    `<a class="${cls}" href="${esc(p.affiliateUrl)}" target="_blank" rel="sponsored noopener noreferrer">${esc(p.ctaText || "View Current Offer")} &#8599;</a>`;

  const body = `
<nav class="nav"><div class="wrap navin">
  <a class="brand" href="/">${esc(site.siteName)}</a>
  <div class="links"><a href="#what">Overview</a><a href="#contents">Contents</a><a href="#bonuses">Bonuses</a><a href="#price">Price</a><a href="#faq">FAQs</a></div>
  ${cta("btn small")}
</div></nav>

<header class="hero"><div class="wrap">
  <span class="eyebrow">${esc(new Date().getFullYear())} Independent Review &amp; Buyer's Guide</span>
  <h1>${esc(p.name)} Review</h1>
  ${list(p.intro).map((t) => `<p class="lead">${esc(t)}</p>`).join("")}
  <div class="actions">${cta()}<a class="btn ghost" href="#contents">Explore the Contents</a></div>
  <p class="muted small">Updated ${esc(p.updated || "")} &middot; Independent editorial overview &middot; Not a guarantee of results.</p>
</div></header>

<section class="stats"><div class="wrap grid4">
  ${list(p.stats).map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("")}
</div></section>

<section id="what" class="sec"><div class="wrap">
  <span class="eyebrow center">The essentials</span>
  <h2>${esc(p.whatIs.title)}</h2>
  <p class="sub">${esc(p.whatIs.text)}</p>
  <div class="grid3">
    ${list(p.whatIs.cards).map((c) => `<article class="card"><span class="tag">${esc(c.tag)}</span><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></article>`).join("")}
  </div>
  ${p.whatIs.warning ? `<div class="note"><b>Important distinction:</b> ${esc(p.whatIs.warning)}</div>` : ""}
</div></section>

<section id="contents" class="sec alt"><div class="wrap">
  <span class="eyebrow center">Inside the package</span>
  <h2>${esc(p.chaptersTitle || "What is included")}</h2>
  <p class="sub">${esc(p.chaptersIntro || "")}</p>
  <div class="grid3">
    ${list(p.chapters).map((c, i) => `<article class="card"><span class="num">${pad(i + 1)}</span><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></article>`).join("")}
  </div>
</div></section>

${list(p.bonuses).length ? `
<section id="bonuses" class="sec"><div class="wrap">
  <span class="eyebrow center">Listed extras</span>
  <h2>${esc(p.bonusesTitle || "Bonuses")}</h2>
  <p class="sub">${esc(p.bonusesIntro || "")}</p>
  <div class="grid2">
    ${p.bonuses.map((b) => `<article class="card"><span class="tag">Listed value: ${esc(b.value)}</span><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></article>`).join("")}
  </div>
</div></section>` : ""}

<section id="price" class="sec alt"><div class="wrap two">
  <div>
    <span class="eyebrow">Price &amp; checkout</span>
    <h2 class="left">${esc(p.pricing.title)}</h2>
    <p>${esc(p.pricing.text)}</p>
    <div class="note"><b>Before you buy:</b> ${esc(p.pricing.beforeYouBuy)}</div>
  </div>
  <aside class="pricebox">
    <span class="tag">Price stated in supplied offer</span>
    <div class="price">${esc(p.price)}</div>
    <ul>${list(p.pricing.checklist).map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
    ${cta("btn block")}
    <p class="muted small">Affiliate link. The seller controls checkout, fulfilment and refund terms.</p>
  </aside>
</div></section>

<section class="sec dark"><div class="wrap">
  <span class="eyebrow center gold">Independent editorial assessment</span>
  <h2>${esc(p.verdict.title)}</h2>
  <div class="grid2">
    <div class="card light"><span class="tag">What may appeal</span><ul>${list(p.verdict.pros).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div class="card light"><span class="tag">What to keep in mind</span><ul>${list(p.verdict.cons).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
  </div>
  <p class="verdict">${esc(p.verdict.summary)}</p>
</div></section>

<section class="sec"><div class="wrap">
  <span class="eyebrow center">Before and after checkout</span>
  <h2>${esc(p.checklistTitle || "What to check before ordering")}</h2>
  <p class="sub">${esc(p.checklistIntro || "")}</p>
  <div class="grid3">
    ${list(p.checklist).map((c, i) => `<article class="card"><span class="tag">${pad(i + 1)}</span><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></article>`).join("")}
  </div>
</div></section>

<section id="faq" class="sec alt"><div class="wrap narrow">
  <span class="eyebrow center">Straight answers</span>
  <h2>${esc(p.name)} FAQs</h2>
  ${list(p.faqs).map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}
</div></section>

<section class="cta-final"><div class="wrap">
  <h2>${esc(p.finalCta.title)}</h2>
  <p>${esc(p.finalCta.text)}</p>
  ${cta()}
  <p class="small">Affiliate disclosure: we may earn a commission. Purchase and fulfilment occur on the destination website.</p>
</div></section>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: `${p.name} Review`, description: p.metaDescription, dateModified: new Date().toISOString().slice(0, 10) },
      { "@type": "FAQPage", mainEntity: list(p.faqs).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return layout({
    title: `${p.name} Review ${new Date().getFullYear()}: Price, Contents & Refund Terms`,
    description: p.metaDescription || p.tagline,
    canonical: url,
    body,
    jsonLd,
  });
}

function indexPage(products) {
  const body = `
<header class="hero"><div class="wrap">
  <span class="eyebrow">Independent reviews</span>
  <h1>${esc(site.siteName)}</h1>
  <p class="lead">Plain-language reviews with disclosures, pricing notes and things to check before buying.</p>
</div></header>
<section class="sec"><div class="wrap"><div class="grid3">
  ${products.map((p) => `<a class="card link" href="/${esc(p.slug)}"><span class="tag">${esc(p.category || "Review")}</span><h3>${esc(p.name)} Review</h3><p>${esc(p.tagline || "")}</p></a>`).join("")}
</div></div></section>`;
  return layout({ title: `${site.siteName}: Independent Product Reviews`, description: "Independent product reviews and buyer's guides.", canonical: site.siteUrl, body });
}

// ---- build ----
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, "assets"), { recursive: true });
fs.copyFileSync(path.join(ROOT, "assets", "styles.css"), path.join(DIST, "assets", "styles.css"));

const files = fs.readdirSync(path.join(ROOT, "products")).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
const products = files.map((f) => JSON.parse(fs.readFileSync(path.join(ROOT, "products", f), "utf8")));

for (const p of products) {
  fs.writeFileSync(path.join(DIST, `${p.slug}.html`), productPage(p));
  console.log("built", p.slug);
}
fs.writeFileSync(path.join(DIST, "index.html"), indexPage(products));

const base = site.siteUrl.replace(/\/$/, "");
const urls = ["", ...products.map((p) => "/" + p.slug)];
fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${base}${u}</loc></url>`).join("\n")}\n</urlset>\n`
);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
console.log(`done: ${products.length} product page(s) -> dist/`);
