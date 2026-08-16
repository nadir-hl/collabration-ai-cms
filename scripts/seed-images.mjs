/**
 * Attaches images to all seeded content via Payload's Media upload API.
 * Run AFTER seed-content.mjs: node scripts/seed-images.mjs
 */

const BASE = 'http://localhost:3000/api'

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts)
  const data = await res.json()
  if (!res.ok) throw new Error(`${opts.method ?? 'GET'} ${path} → ${res.status}: ${JSON.stringify(data.errors ?? data)}`)
  return data
}

async function patch(collection, id, body, token) {
  return apiFetch(`/${collection}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(body),
  })
}

/** Download an image from a URL, upload to Payload Media, return the media doc. */
async function uploadImage(imageUrl, filename, alt, token) {
  console.log(`    ↑ uploading ${filename}…`)
  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) throw new Error(`Failed to fetch ${imageUrl}: ${imgRes.status}`)
  const buffer = await imgRes.arrayBuffer()
  const mime = imgRes.headers.get('content-type') || 'image/jpeg'

  const form = new FormData()
  form.append('file', new Blob([buffer], { type: mime }), filename)
  form.append('_payload', JSON.stringify({ alt }))

  const res = await fetch(`${BASE}/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Media upload failed: ${JSON.stringify(data.errors ?? data)}`)
  return data.doc
}

// ─── Login ────────────────────────────────────────────────────────────────────
console.log('🔐 Logging in…')
const { token } = await apiFetch('/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@collaboration.ai', password: 'Admin@1234!' }),
})
console.log('✓ Authenticated\n')

// ─── 1. People photos ─────────────────────────────────────────────────────────
// pravatar.cc gives consistent human portrait photos by number
const peoplePhotos = [
  { img: 'https://i.pravatar.cc/400?img=47', name: 'Sarah Chen' },
  { img: 'https://i.pravatar.cc/400?img=33', name: 'Marcus Williams' },
  { img: 'https://i.pravatar.cc/400?img=9',  name: 'Priya Patel' },
  { img: 'https://i.pravatar.cc/400?img=52', name: 'James Rodriguez' },
  { img: 'https://i.pravatar.cc/400?img=25', name: 'Emily Zhang' },
]

console.log('👥 Uploading People photos…')
const { docs: people } = await apiFetch('/people?limit=100&depth=0', {
  headers: { Authorization: `JWT ${token}` },
})

for (const person of people) {
  const meta = peoplePhotos.find(p => p.name === person.name)
  if (!meta) continue
  const filename = `${person.name.toLowerCase().replace(/\s+/g, '-')}-photo.jpg`
  const media = await uploadImage(meta.img, filename, `Photo of ${person.name}`, token)
  await patch('people', person.id, { photo: media.id }, token)
  console.log(`  ✓ ${person.name}`)
}

// ─── 2. Post cover images ──────────────────────────────────────────────────────
// picsum.photos/seed/{seed}/w/h gives deterministic images
const postCovers = [
  { slug: 'why-ai-is-transforming-b2b-sales-in-2025',         seed: 'ai-sales',       alt: 'AI transforming B2B sales' },
  { slug: 'the-hidden-cost-of-manual-pipeline-reviews',        seed: 'pipeline',       alt: 'Pipeline review meeting' },
  { slug: 'how-top-revenue-teams-use-structured-decisions',    seed: 'decisions',      alt: 'Revenue team decision meeting' },
  { slug: 'competitor-intelligence-moving-from-reactive-to-proactive', seed: 'intel', alt: 'Competitive intelligence dashboard' },
  { slug: 'the-future-of-ai-in-revenue-operations',           seed: 'future-ai',      alt: 'Future of AI in revenue operations' },
]

console.log('\n📝 Uploading Post cover images…')
const { docs: posts } = await apiFetch('/posts?limit=100&depth=0', {
  headers: { Authorization: `JWT ${token}` },
})

for (const post of posts) {
  const meta = postCovers.find(c => c.slug === post.slug)
  if (!meta) continue
  const url = `https://picsum.photos/seed/${meta.seed}/1200/630`
  const media = await uploadImage(url, `${meta.seed}-cover.jpg`, meta.alt, token)
  await patch('posts', post.id, { socialImage: media.id }, token)
  console.log(`  ✓ ${post.title}`)
}

// ─── 3. Add richer body + tags to Posts ───────────────────────────────────────
function richBody(paragraphs) {
  return {
    root: {
      children: paragraphs.map(text => ({
        children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
        direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1,
      })),
      direction: 'ltr', format: '', indent: 0, type: 'root', version: 1,
    },
  }
}

const postBodies = {
  'why-ai-is-transforming-b2b-sales-in-2025': {
    body: richBody([
      'For decades, B2B sales operated on instinct, relationships, and luck. The best reps were the ones who had been around long enough to recognise patterns intuitively — who to call, when to follow up, how to handle the procurement objection that killed the last three deals.',
      'In 2025, that intuition is still valuable. But the teams pulling ahead are the ones that have married human relationship-building with AI that handles pattern recognition, prioritisation, and first-draft generation. The change is not coming — it is already here, and it is separating high-performing organisations from the ones still operating on instinct alone.',
      'What does this look like in practice? Top-performing SDR teams are no longer spending two hours a day researching contacts. That time goes to AI. Reps are reviewing, editing, and sending — not writing from scratch. Deal qualification is no longer a gut check at the end of the week — it happens at every stage, automatically, using criteria the team agreed on and encoded into the system.',
      'The shift is not about replacing reps. It is about giving them the tools to operate at the level of your best rep, every day. The data is clear: teams that have integrated AI into their core revenue workflows are outperforming their peers on pipeline generation, cycle length, and win rate. The window to get ahead is still open — but it is closing.',
    ]),
    tags: [{ tag: 'AI' }, { tag: 'Sales' }, { tag: 'Revenue Operations' }],
  },
  'the-hidden-cost-of-manual-pipeline-reviews': {
    body: richBody([
      'Ask any VP of Sales what they spend Friday afternoons doing and the answer is usually some variation of "arguing with my CRM." Manual pipeline reviews are expensive, inconsistent, and rarely catch problems early enough to course-correct.',
      'The math is brutal. A 45-person sales team doing weekly pipeline reviews burns roughly 200 hours per month — across managers and reps — on a process that produces no revenue directly. When we surveyed revenue leaders, 71% said their pipeline reviews surface deal problems too late to change the outcome.',
      'The problem is not that managers are bad at reading deals. The problem is that they are reading deals through a lens of inconsistent data entered by reps under pressure at the end of the week. Garbage in, garbage out — except the garbage is not obvious until it is too late.',
      'The alternative is not to stop reviewing pipeline. It is to make deal data structural rather than narrative. When every deal has the same qualification criteria applied at the same moments, the review becomes a conversation about what to do next — not a negotiation about whether the deal is real.',
    ]),
    tags: [{ tag: 'Pipeline' }, { tag: 'Sales Operations' }, { tag: 'Forecasting' }],
  },
  'how-top-revenue-teams-use-structured-decisions': {
    body: richBody([
      'The highest-performing sales organisations we work with share one characteristic that is easy to overlook: they have a framework for every major decision in the sales process, and that framework is encoded into the tools reps use every day.',
      'This is not about bureaucracy. It is about making the right call the easy call. When a rep knows exactly what criteria a deal needs to meet to advance, they spend their energy on the activities that move deals forward — not on deciding whether a deal is real enough to spend time on.',
      'Structured decision-making works because it compounds. Every deal teaches the framework something. Over time, the criteria that matter become clearer, the time wasted on deals that will never close gets shorter, and the deals that should win get more attention.',
      'The practical starting point is simpler than most teams expect: agree on what questions every deal needs to answer at each stage, put those questions where reps work, and make the answers visible to managers without a meeting. That is the foundation. Everything else follows.',
    ]),
    tags: [{ tag: 'Decision Making' }, { tag: 'Sales Process' }, { tag: 'Qualification' }],
  },
  'competitor-intelligence-moving-from-reactive-to-proactive': {
    body: richBody([
      'The traditional competitive intelligence process works like this: a rep loses a deal to a competitor, fills in a loss reason field, and that data sits in a spreadsheet until someone has time to analyse it. By then, the competitor has shipped two more features, changed their pricing, and hired a VP of Marketing who used to work at your biggest customer.',
      'Reactive intelligence is better than nothing, but it is always fighting the last war. The teams that consistently win competitive deals are the ones that know what their competitors are about to do before their reps walk into the room.',
      'Proactive intelligence means monitoring continuously rather than retrospectively. It means tracking product updates, pricing changes, hiring signals, customer review patterns, and executive messaging — not as a monthly research project, but as an always-on feed that surfaces the changes that matter.',
      'The output is not a 40-slide competitive deck that gets read once and never updated. It is a living positioning guide that tells reps exactly how to position against each competitor in the deals they are working right now. That is the difference between intelligence as a library and intelligence as a weapon.',
    ]),
    tags: [{ tag: 'Competitive Intelligence' }, { tag: 'Win Rate' }, { tag: 'Positioning' }],
  },
  'the-future-of-ai-in-revenue-operations': {
    body: richBody([
      'AI in RevOps today is largely about efficiency — doing the same things faster. Writing the first draft of an email. Summarising a call. Scoring a deal based on activity. These are meaningful improvements, but they are optimisations on an existing model.',
      'The next wave is about judgment. AI systems that can evaluate a deal health with more accuracy than a manager who reviewed 40 deals last week. Systems that surface a buyer signal — a job posting for a Head of Integration, a review mentioning a pain point you solve — that no human would have the bandwidth to notice.',
      'The teams that will pull ahead over the next three years are not the ones that automate what they are already doing. They are the ones that rethink what humans should be doing in revenue, and build AI into the foundation of every decision that matters.',
      'The job of sales leadership is changing. In five years, the best revenue leaders will be people who are expert at designing AI-augmented systems, interpreting the signals those systems surface, and coaching humans to operate at the level those systems enable. That is a different job than the one most revenue leaders were hired to do. The sooner teams start building toward it, the further ahead they will be.',
    ]),
    tags: [{ tag: 'AI' }, { tag: 'Future of Work' }, { tag: 'Revenue Operations' }, { tag: 'Leadership' }],
  },
}

console.log('\n✍️  Enriching Post bodies and tags…')
for (const post of posts) {
  const enrichment = postBodies[post.slug]
  if (!enrichment) continue
  await patch('posts', post.id, enrichment, token)
  console.log(`  ✓ ${post.title}`)
}

console.log('\n✅ Images and enrichment complete!')
console.log('   All 5 People have profile photos.')
console.log('   All 5 Posts have cover images, full body copy, and tags.')
