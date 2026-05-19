// seed.mjs
//
// Seeds the bacway-backend with contributors from contributors.json.
// Run: node seed.mjs
// Requires: Node 18+ (uses built-in fetch)

import fs from 'node:fs/promises';

// ─── Config ──────────────────────────────────────────────────────────────────

const API_URL     = 'https://bacway-backend1.onrender.com/api/v1/contributors';
const PUBLIC_BASE = 'https://bacway.vercel.app';   // for resolving relative picture paths
const DATA_FILE   = './contributors.json';
const DELAY_MS    = 250;                            // pause between requests

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Build a slug-style placeholder email from the full name.
// Backend says email isn't unique, so collisions don't matter — but we still
// make them stable so re-runs don't create duplicates with new IDs.
function placeholderEmail(fullName) {
  const slug = fullName
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '');
  return `${slug}@bacway.placeholder`;
}

// Turn "team/massa.jpg" into "https://bacway.vercel.app/team/massa.jpg".
// Pass-through for full URLs and null.
function resolvePicture(p) {
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  return `${PUBLIC_BASE}/${p.replace(/^\/+/, '')}`;
}

// Strip any fields the backend doesn't accept on Resource creation.
function cleanResource(r) {
  const out = {
    folderName: r.folderName,
    folderLink: r.folderLink,
  };
  if (r.description) out.description = r.description;
  return out;
}

// Build the full payload the backend expects, per ADMIN_API.md.
function buildPayload(c) {
  return {
    email:         placeholderEmail(c.fullName),
    fullName:      c.fullName,
    bacYear:       c.bacYear,
    grade:         c.grade,
    bacSpeciality: c.bacSpeciality,
    pictureLink:   resolvePicture(c.pictureLink),
    letter:        c.letter ?? null,
    contacts:      c.contacts  ?? [],
    resources:    (c.resources ?? []).map(cleanResource),
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

const raw = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));

console.log(`Seeding ${raw.length} contributors → ${API_URL}\n`);

const results = [];

for (const c of raw) {
  const body = buildPayload(c);
  process.stdout.write(`→ ${c.fullName.padEnd(28)} `);

  try {
    const res  = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const text = await res.text();

    if (!res.ok) {
      console.log(`FAIL (${res.status})`);
      console.log('  ', text.slice(0, 400));
      results.push({ name: c.fullName, ok: false, status: res.status });
    } else {
      let id = '';
      try { id = JSON.parse(text)?.id ?? ''; } catch {}
      console.log(`ok${id ? `  [id ${id}]` : ''}`);
      results.push({ name: c.fullName, ok: true, id });
    }
  } catch (e) {
    console.log('ERROR');
    console.log('  ', e.message);
    results.push({ name: c.fullName, ok: false, error: e.message });
  }

  await new Promise(r => setTimeout(r, DELAY_MS));
}

// ─── Summary ─────────────────────────────────────────────────────────────────

const okCount   = results.filter(r => r.ok).length;
const failCount = results.length - okCount;

console.log(`\n${okCount}/${results.length} succeeded${failCount ? `, ${failCount} failed` : ''}.`);
if (failCount) {
  console.log('\nFailures:');
  console.table(results.filter(r => !r.ok));
}
console.log('\nNext: open /admin and accept the new PENDING contributions.');
