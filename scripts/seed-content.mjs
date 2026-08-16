/**
 * Seed script — creates 5 published docs for each content collection.
 * Run: node scripts/seed-content.mjs
 * Requires the dev server to be running on http://localhost:3000
 */

const BASE = 'http://localhost:3000/api'

async function api(path, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `JWT ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(data.errors ?? data)}`)
  }
  return data
}

function lexical(text) {
  return {
    root: {
      children: [
        {
          children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
          direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1,
        },
      ],
      direction: 'ltr', format: '', indent: 0, type: 'root', version: 1,
    },
  }
}

function slug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ─── Login ────────────────────────────────────────────────────────────────────
console.log('🔐 Logging in as admin…')
const { token } = await api('/users/login', 'POST', {
  email: 'admin@collaboration.ai',
  password: 'Admin@1234!',
})
console.log('✓ Authenticated\n')

// ─── 1. People ────────────────────────────────────────────────────────────────
const peopleData = [
  { name: 'Sarah Chen',       role: 'CEO & Co-founder',       bio: 'Sarah has 15 years leading enterprise SaaS teams. She founded Collaboration.AI to close the gap between AI capability and actual revenue team adoption.' },
  { name: 'Marcus Williams',  role: 'CTO',                    bio: 'Marcus previously built ML infrastructure at two unicorns. He leads the engineering and AI research teams at Collaboration.AI.' },
  { name: 'Priya Patel',      role: 'Head of Product',        bio: 'Priya spent a decade in product management across CRM and sales-tech. She obsesses over what gets in the way of reps doing their best work.' },
  { name: 'James Rodriguez',  role: 'VP of Revenue',          bio: 'James has carried a bag and built sales teams. He now leads revenue and ensures every Collaboration.AI product is one a rep would actually use.' },
  { name: 'Emily Zhang',      role: 'Head of AI Research',    bio: 'Emily holds a PhD in NLP and leads the research team that builds the models powering Source, Decide, and Intelligence.' },
]

console.log('👥 Creating People…')
const createdPeople = []
for (const p of peopleData) {
  const doc = await api('/people', 'POST', p, token)
  createdPeople.push(doc.doc)
  console.log(`  ✓ ${p.name}`)
}
const firstPerson = createdPeople[0]

// ─── 2. Products ──────────────────────────────────────────────────────────────
const productsData = [
  {
    name: 'Source',
    slug: 'source',
    oneLiner: 'Find the right people, faster',
    whoItsFor: 'Sales development reps and demand-gen teams who need to build a qualified pipeline without wasting calls on the wrong contacts.',
    proof: lexical('Teams using Source report a 3× improvement in contact-to-meeting rates within the first 90 days.'),
    callToAction: { label: 'See Source in action', url: '/contact' },
  },
  {
    name: 'Decide',
    slug: 'decide',
    oneLiner: 'Structured decisions at scale',
    whoItsFor: 'Sales managers and RevOps leaders who need consistent qualification criteria across a distributed team.',
    proof: lexical('Decide reduces the average time to first meaningful qualification conversation by 28% by giving reps a clear framework before every call.'),
    callToAction: { label: 'See Decide in action', url: '/contact' },
  },
  {
    name: 'Acquire',
    slug: 'acquire',
    oneLiner: 'Turn pipeline into revenue',
    whoItsFor: 'Account executives closing complex B2B deals who need AI-drafted proposals, objection handling, and real-time intel in one place.',
    proof: lexical('Acquire customers see an average 22% reduction in sales cycle length and a 15% increase in average contract value.'),
    callToAction: { label: 'See Acquire in action', url: '/contact' },
  },
  {
    name: 'Intelligence',
    slug: 'intelligence',
    oneLiner: 'Know what your market is doing',
    whoItsFor: 'Product marketing, competitive intelligence, and executive teams who need an always-current view of what competitors are shipping and saying.',
    proof: lexical('Intelligence monitors over 200 signals per competitor per week, surfacing only the changes that matter to your positioning.'),
    callToAction: { label: 'See Intelligence in action', url: '/contact' },
  },
  {
    name: 'Align',
    slug: 'align',
    oneLiner: 'Keep revenue teams moving together',
    whoItsFor: 'Revenue leaders who need shared context, consistent messaging, and real-time signal sharing across SDR, AE, CS, and marketing teams.',
    proof: lexical('Align closes the handoff gap — teams using it report 40% fewer deal-context losses between SDR and AE stages.'),
    callToAction: { label: 'See Align in action', url: '/contact' },
  },
]

console.log('\n📦 Creating Products…')
for (const p of productsData) {
  await api('/products', 'POST', p, token)
  console.log(`  ✓ ${p.name}`)
}

// ─── 3. Posts ─────────────────────────────────────────────────────────────────
const postsData = [
  {
    title: 'Why AI Is Transforming B2B Sales in 2025',
    summary: 'The shift from intuition-led selling to AI-assisted decisions is no longer optional. Here\'s what the data shows and what it means for revenue leaders.',
    body: lexical('For decades, B2B sales operated on instinct, relationships, and luck. In 2025, the teams pulling ahead are the ones that have married human relationship-building with AI that handles pattern recognition, prioritisation, and first-draft generation. The change isn\'t coming — it\'s already here.'),
    date: '2025-03-12T09:00:00.000Z',
    reviewStatus: 'approved',
  },
  {
    title: 'The Hidden Cost of Manual Pipeline Reviews',
    summary: 'Weekly pipeline reviews eat 3–5 hours per rep per week. Most of that time produces no insight. There\'s a better way.',
    body: lexical('Ask any VP of Sales what they spend Friday afternoons doing and the answer is usually some variation of "arguing with my CRM." Manual pipeline reviews are expensive, inconsistent, and rarely catch problems early enough to course-correct. This post breaks down where the cost sits and what a structured alternative looks like.'),
    date: '2025-04-02T09:00:00.000Z',
    reviewStatus: 'approved',
  },
  {
    title: 'How Top Revenue Teams Use Structured Decisions',
    summary: 'The highest-performing sales organisations don\'t rely on gut feel at key deal moments. They\'ve built systems that make the right call the easy call.',
    body: lexical('Structured decision-making in sales isn\'t about removing human judgment — it\'s about giving judgment the right inputs at the right moment. The best teams we\'ve worked with have a framework for every major deal gate, from qualification through negotiation.'),
    date: '2025-04-28T09:00:00.000Z',
    reviewStatus: 'approved',
  },
  {
    title: 'Competitor Intelligence: Moving from Reactive to Proactive',
    summary: 'Most competitive intel arrives too late — after you\'ve already lost the deal. Here\'s how to flip the model.',
    body: lexical('The traditional competitive intelligence process works like this: a rep loses a deal to a competitor, fills in a loss reason field, and that data sits in a spreadsheet until someone has time to analyse it. By then, the competitor has shipped two more features. Proactive intelligence means you know what they\'re about to do before your reps walk into the room.'),
    date: '2025-05-15T09:00:00.000Z',
    reviewStatus: 'approved',
  },
  {
    title: 'The Future of AI in Revenue Operations',
    summary: 'Beyond automation: where AI will reshape the fundamental structure of revenue teams over the next three years.',
    body: lexical('AI in RevOps today is largely about efficiency — doing the same things faster. The next wave is about judgment: AI systems that can evaluate a deal\'s health with more accuracy than a manager who reviewed 40 deals last week, or surface a buyer signal that no human would have the bandwidth to notice.'),
    date: '2025-06-03T09:00:00.000Z',
    reviewStatus: 'approved',
  },
]

console.log('\n📝 Creating Posts…')
for (const p of postsData) {
  const payload = { ...p, slug: slug(p.title), author: firstPerson.id, _status: 'published' }
  await api('/posts', 'POST', payload, token)
  console.log(`  ✓ ${p.title}`)
}

// ─── 4. Case Studies ──────────────────────────────────────────────────────────
const caseStudiesData = [
  {
    client: 'TechCorp Solutions',
    mission: 'Scale enterprise pipeline generation without adding headcount.',
    problem: lexical('TechCorp\'s SDR team was spending 60% of their time researching contacts and writing first-touch emails. Pipeline volume was flat despite headcount growth. Leadership needed a way to do more with the team they already had.'),
    whatWeDid: lexical('We deployed Source to automate contact discovery and signal-based prioritisation, and used Acquire\'s draft engine to generate personalised first-touch sequences. Reps reviewed and sent — they didn\'t write from scratch.'),
    outcome: lexical('Within 90 days, TechCorp\'s SDR team was generating 3× the meeting volume at the same headcount. Average time-to-first-meeting dropped from 18 days to 6.'),
    quote: { text: 'We\'d been trying to solve this with more people. Collaboration.AI solved it with better tools.', attribution: 'VP of Sales, TechCorp Solutions' },
    reviewStatus: 'approved',
  },
  {
    client: 'FinanceFlow Inc',
    mission: 'Give the revenue team a shared, accurate view of pipeline health.',
    problem: lexical('FinanceFlow had three different forecasting spreadsheets, none of which agreed. Sales, RevOps, and the CFO were working from different numbers every Monday morning.'),
    whatWeDid: lexical('Decide\'s structured qualification framework became the single source of truth for deal stage. Every opp had the same data attached at the same moments. Intelligence surfaced buyer signals that fed into deal scoring automatically.'),
    outcome: lexical('Forecast accuracy improved from 61% to 89% within two quarters. The Monday morning call went from 90 minutes to 30.'),
    quote: { text: 'We stopped fighting about the numbers and started fighting about how to win deals.', attribution: 'CFO, FinanceFlow Inc' },
    reviewStatus: 'approved',
  },
  {
    client: 'MarketPulse Ltd',
    mission: 'Stay ahead of four fast-moving competitors in a category that shifts every quarter.',
    problem: lexical('MarketPulse\'s product marketing team was spending two days a month manually tracking competitors — website changes, G2 reviews, LinkedIn posts, press releases. They were always behind.'),
    whatWeDid: lexical('Intelligence automated monitoring across 200+ signals per competitor. Product marketing received a weekly digest of meaningful changes, with recommended positioning responses already drafted.'),
    outcome: lexical('Time spent on competitive research dropped by 80%. The team caught a competitor\'s pricing change 11 days before it was public — and updated their own positioning before the competitor announced.'),
    quote: { text: 'Intelligence gives us an unfair advantage. We know what\'s coming before it arrives.', attribution: 'Head of PMM, MarketPulse Ltd' },
    reviewStatus: 'approved',
  },
  {
    client: 'SalesForge Systems',
    mission: 'Standardise deal qualification across a 45-person sales team in four regions.',
    problem: lexical('SalesForge\'s reps were qualifying deals differently. Some were rigorous; others were optimistic. The result was a pipeline full of deals that looked good on paper but fell apart late in the process.'),
    whatWeDid: lexical('Decide provided a consistent qualification framework applied at every deal stage. Managers could see exactly where each deal was and which criteria it had and hadn\'t met — without having to ask.'),
    outcome: lexical('Late-stage deal loss dropped by 34% in six months. Average deal size increased as reps learned to focus on deals that matched the criteria for their best wins.'),
    quote: { text: 'Decide made every rep look like our best rep at the qualification stage.', attribution: 'Head of Sales Enablement, SalesForge Systems' },
    reviewStatus: 'approved',
  },
  {
    client: 'GrowthBridge Partners',
    mission: 'Shorten a 90-day enterprise sales cycle without cutting corners on due diligence.',
    problem: lexical('GrowthBridge sold complex partnerships with long procurement cycles. Proposals took two weeks to write. Each deal required competitive positioning that had to be researched from scratch.'),
    whatWeDid: lexical('Acquire\'s draft engine generated proposal first drafts in under an hour. Intelligence fed current competitor positioning directly into the proposal flow so reps weren\'t writing blind.'),
    outcome: lexical('Average time-to-proposal dropped from 14 days to 2. The sales cycle shortened from 90 days to 58. Win rate improved by 19 percentage points.'),
    quote: { text: 'We used to say our deals took time because they were complex. Now we know it was because our process was slow.', attribution: 'Managing Partner, GrowthBridge Partners' },
    reviewStatus: 'approved',
  },
]

console.log('\n📋 Creating Case Studies…')
for (const cs of caseStudiesData) {
  const payload = { ...cs, slug: slug(cs.client), _status: 'published' }
  await api('/case-studies', 'POST', payload, token)
  console.log(`  ✓ ${cs.client}`)
}

// ─── 5. Competitors ───────────────────────────────────────────────────────────
const competitorsData = [
  {
    name: 'Salesforce Sales Cloud',
    positioning: 'The established CRM incumbent. Strong in large enterprise accounts where Salesforce is already the system of record. Sells on ecosystem breadth and integration depth.',
    facts: [
      { claim: 'AI features are fully integrated', ours: 'Collaboration.AI AI is purpose-built for revenue workflows — not bolted on to an existing CRM.', theirs: 'Einstein AI is an add-on layer on top of a 20-year-old data model. Adoption is low.', source: 'G2 reviews Q1 2025', date: '2025-01-15T00:00:00.000Z' },
      { claim: 'Best-in-class forecasting', ours: 'Decide delivers structured deal data that feeds more accurate forecasts from day one.', theirs: 'Salesforce forecasting relies on rep-entered data, which is inconsistent without enforcement.', source: 'Forrester Wave 2024', date: '2024-11-01T00:00:00.000Z' },
    ],
    verdict: 'Compete on time-to-value and AI quality. Salesforce wins on existing relationships and IT mandates. We win when the buyer cares about what their reps actually use.',
    reviewStatus: 'approved',
    approver: firstPerson.id,
  },
  {
    name: 'HubSpot Sales Hub',
    positioning: 'The SMB and mid-market favourite. Easy to use, strong marketing integration, aggressive pricing. Competes on simplicity and the all-in-one pitch.',
    facts: [
      { claim: 'Better for smaller teams', ours: 'Collaboration.AI scales from 5-rep teams to 500. Our per-seat economics are designed for growth.', theirs: 'HubSpot becomes expensive and less flexible as teams grow past ~50 reps.', source: 'Customer interviews 2025', date: '2025-02-20T00:00:00.000Z' },
      { claim: 'AI Prospecting built in', ours: 'Source uses intent data and fit scoring that outperforms HubSpot\'s basic enrichment.', theirs: 'HubSpot AI Prospecting is early-stage. Most customers still use third-party enrichment.', source: 'HubSpot product changelog', date: '2025-03-01T00:00:00.000Z' },
    ],
    verdict: 'HubSpot wins on ease and brand recognition at the SMB level. We win when the buyer outgrows simple and needs structured decision-making and competitive intelligence.',
    reviewStatus: 'approved',
    approver: firstPerson.id,
  },
  {
    name: 'Outreach',
    positioning: 'Sales engagement leader. Strong in sequence management, email deliverability, and rep activity tracking. Focused on top-of-funnel execution.',
    facts: [
      { claim: 'Best sales engagement platform', ours: 'Collaboration.AI goes beyond engagement into deal intelligence and decision support — Outreach stops at the activity layer.', theirs: 'Outreach is strong for SDR sequencing but has limited intelligence once a deal moves to AE.', source: 'G2 comparison data', date: '2025-01-10T00:00:00.000Z' },
      { claim: 'AI writing assistant included', ours: 'Acquire generates full proposals and objection responses, not just email snippets.', theirs: 'Outreach AI writes email variants. It does not draft proposals or handle late-stage deal support.', source: 'Outreach product documentation', date: '2025-04-01T00:00:00.000Z' },
    ],
    verdict: 'Outreach owns the sequence layer. We win when the buyer needs intelligence and decision support beyond activity management. Often complementary in large orgs.',
    reviewStatus: 'approved',
    approver: firstPerson.id,
  },
  {
    name: 'Gong',
    positioning: 'Conversation intelligence leader. Records and analyses sales calls. Strong coaching and call review features. Expanding into pipeline and forecasting.',
    facts: [
      { claim: 'Best conversation intelligence', ours: 'Collaboration.AI complements call data with structured deal data, competitive signals, and proposal generation — Gong captures what was said; we help reps know what to say next.', theirs: 'Gong\'s strength is call analysis. Its pipeline and forecasting expansion is nascent.', source: 'Gong product release notes 2024', date: '2024-12-01T00:00:00.000Z' },
      { claim: 'AI-powered deal risk detection', ours: 'Decide\'s structured qualification provides more predictive signals than call sentiment alone.', theirs: 'Gong deal risk flags are primarily based on call frequency and sentiment — missing the structured deal criteria layer.', source: 'G2 reviews Q4 2024', date: '2024-10-01T00:00:00.000Z' },
    ],
    verdict: 'Gong wins on call coaching and recording. Frequently deployed alongside us in enterprise accounts. Compete when the buyer wants to replace Gong\'s forecasting with Decide.',
    reviewStatus: 'approved',
    approver: firstPerson.id,
  },
  {
    name: 'Clari',
    positioning: 'Revenue operations platform focused on forecasting, pipeline management, and revenue cadences. Strong in large enterprise accounts with complex forecasting needs.',
    facts: [
      { claim: 'Best-in-class revenue forecasting', ours: 'Decide provides the structured deal data that makes any forecast more accurate — we are upstream of the forecast layer.', theirs: 'Clari excels at aggregating and presenting forecast data but relies on the quality of upstream deal data it receives.', source: 'Clari website and customer reviews', date: '2025-02-01T00:00:00.000Z' },
      { claim: 'Complete RevOps platform', ours: 'Collaboration.AI addresses the actual selling work — Clari addresses reporting on that work. Different jobs to be done.', theirs: 'Clari is strong for VP/C-suite visibility. It does not help reps qualify deals or write proposals.', source: 'Clari G2 profile', date: '2025-01-20T00:00:00.000Z' },
    ],
    verdict: 'Clari wins at the executive level for forecast visibility. We win when the buyer needs to improve the quality of pipeline going in, not just the view of pipeline coming out.',
    reviewStatus: 'approved',
    approver: firstPerson.id,
  },
]

console.log('\n🥊 Creating Competitors…')
for (const c of competitorsData) {
  const payload = { ...c, slug: slug(c.name), _status: 'published' }
  await api('/competitors', 'POST', payload, token)
  console.log(`  ✓ ${c.name}`)
}

console.log('\n✅ Seed complete!')
console.log('   5 People · 5 Products · 5 Posts · 5 Case Studies · 5 Competitors')
