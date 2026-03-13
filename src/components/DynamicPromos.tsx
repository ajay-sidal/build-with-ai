import { Card, CardContent, CardHeader } from './ui/card'

export type PromoCategory = 'Business' | 'Creative'

type Promo = {
  tld: string
  headline: string
  subhead: string
  price: string
  badge?: string
}

const PROMOS: Record<PromoCategory, Promo[]> = {
  Business: [
    {
      tld: '.biz',
      headline: 'Business-ready names',
      subhead: 'Ship a credible brand in 24 hours.',
      price: '$4.99',
      badge: 'HOT',
    },
    {
      tld: '.blog',
      headline: 'Founder updates',
      subhead: 'Launch posts + changelogs instantly.',
      price: '$4.99',
    },
    {
      tld: '.horse',
      headline: 'Wildcard branding',
      subhead: 'Memorable names that get clicked.',
      price: '$4.99',
    },
  ],
  Creative: [
    {
      tld: '.blog',
      headline: 'Creator home base',
      subhead: 'Your work, your story, your audience.',
      price: '$4.99',
      badge: 'HOT',
    },
    {
      tld: '.horse',
      headline: 'Unexpected + iconic',
      subhead: 'The kind of domain people remember.',
      price: '$4.99',
    },
    {
      tld: '.biz',
      headline: 'Client-ready brand',
      subhead: 'Clean, professional, high intent.',
      price: '$4.99',
    },
  ],
}

export default function DynamicPromos({ category }: { category: PromoCategory }) {
  const promos = PROMOS[category] || PROMOS.Business

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Dynamic promos</div>
            <h2 className="mt-1 text-base font-medium text-zinc-100">Context-aware deals for {category.toLowerCase()} intent</h2>
            <p className="mt-1 text-xs text-zinc-500">Three featured TLDs. Pricing starts at $4.99.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-4 md:grid-cols-3">
          {promos.map((p) => (
            <div key={p.tld} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-zinc-100">{p.tld}</div>
                {p.badge ? (
                  <div className="rounded-full border border-amber-800/40 bg-amber-950/20 px-2 py-1 text-[10px] font-medium text-amber-200">
                    {p.badge}
                  </div>
                ) : null}
              </div>
              <div className="mt-2 text-sm font-medium text-zinc-200">{p.headline}</div>
              <div className="mt-1 text-xs text-zinc-500">{p.subhead}</div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-xs text-zinc-500">Starting at</div>
                <div className="font-mono text-sm text-zinc-100">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
