# Review Site Template

Ek JSON file = ek poora review page. Koi framework/dependency nahi, sirf Node.

## Naya product add karna
1. `products/eastern-star-chart-review.json` ko copy karo, naam rakho jaise `products/my-product-review.json`
2. Andar `slug`, `name`, `affiliateUrl`, price, chapters, bonuses, FAQs sab apne product ke hisaab se badlo
3. `site.json` me apna site name, domain aur disclosure daalo
4. Local check: `npm run build` phir `dist/` folder dekho
5. Git push karo, Vercel apne aap deploy kar dega

Jis file ka naam `_` se shuru hota hai, wo build me skip hoti hai (drafts ke liye).

## Vercel pe deploy
1. GitHub pe naya repo banao aur ye folder push karo
2. vercel.com > Add New > Project > repo import karo
3. Settings apne aap `vercel.json` se aa jayengi (build: `npm run build`, output: `dist`)
4. Deploy dabao. Baad me Domains me apna custom domain jodo

## Zaroori rules (honest rakho)
- `affiliateUrl` me apna asli affiliate link do
- Jo product khud use nahi kiya, uske liye "tested" ya fake reviews/ratings mat likho
- Seller ke claims ko "seller says" ke saath likho, guaranteed results mat promise karo
- Seller ki sales page copy-paste mat karo, apne words me likho
- Disclosure top bar aur footer me automatically aata hai, ise hatana mat
