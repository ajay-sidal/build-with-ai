import { Card, CardContent, CardHeader } from '../../components/ui/card'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CURL = `curl -s \
  -H "x-api-key: YOUR_API_KEY" \
  "https://www.buildwithai.digital/api/v1/domains/check?query=verde&tlds=com,digital,ai"`

const JS = `const res = await fetch("https://www.buildwithai.digital/api/v1/domains/check?query=verde", {
  headers: { "x-api-key": process.env.BWAI_API_KEY },
});
const data = await res.json();
console.log(data.results);`

const PY = `import os
import requests

url = "https://www.buildwithai.digital/api/v1/domains/check?query=verde"
res = requests.get(url, headers={"x-api-key": os.environ["BWAI_API_KEY"]})
print(res.json()["results"])`

export default function DevelopersPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Developers</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Programmatic access to domain availability + SSL catalog. Powered by OpenProvider.
        </p>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/60">
        <CardHeader>
          <h2 className="text-sm font-medium text-zinc-200">Authentication</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Send your key in the <span className="font-mono">x-api-key</span> header. Keys are generated in your dashboard.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-300">
            Rate limit: <span className="font-mono">60 requests/min</span> per key.
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-950/60">
        <CardHeader>
          <h2 className="text-sm font-medium text-zinc-200">Endpoints</h2>
          <p className="mt-1 text-xs text-zinc-500">All responses include a <span className="font-mono">powered_by</span> header.</p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-xs uppercase tracking-widest text-zinc-500">Domains</div>
            <div className="mt-1 font-mono text-sm text-zinc-200">GET /api/v1/domains/check</div>
            <div className="mt-2 text-xs text-zinc-400">
              Query params: <span className="font-mono">query</span> (required), <span className="font-mono">tlds</span> (optional comma list).
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-xs uppercase tracking-widest text-zinc-500">SSL</div>
            <div className="mt-1 font-mono text-sm text-zinc-200">GET /api/v1/ssl/products</div>
            <div className="mt-2 text-xs text-zinc-400">Returns the SSL catalog from the OpenProvider engine.</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-950/60">
        <CardHeader>
          <h2 className="text-sm font-medium text-zinc-200">Examples</h2>
          <p className="mt-1 text-xs text-zinc-500">Copy/paste starter snippets.</p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">cURL</div>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-200">{CURL}</pre>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">JavaScript</div>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-200">{JS}</pre>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Python</div>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-200">{PY}</pre>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-950/60">
        <CardHeader>
          <h2 className="text-sm font-medium text-zinc-200">Monetization note</h2>
          <p className="mt-1 text-xs text-zinc-500">
            API usage is attributed to the key owner. Future registration endpoints can automatically propagate partner attribution.
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-zinc-400">
            This is the foundation for API access tiers (higher limits, team keys, usage analytics) without exposing OpenProvider credentials.
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
