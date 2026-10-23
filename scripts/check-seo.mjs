// Verify the exported pages a crawler actually receives, without running JavaScript.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('out');
const origin = 'https://cartunez.in';
const read = path => readFile(resolve(root, path), 'utf8');
const sitemap = await read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const serviceDirs = (await readdir(resolve(root, 'services'), { withFileTypes: true })).filter(entry => entry.isDirectory());
assert.equal(serviceDirs.length, 6, 'All six distinct service pages must be exported');
const expectedPaths = ['/', '/services/', '/visit/', '/enquire/', ...serviceDirs.map(entry => `/services/${entry.name}/`)];
assert.deepEqual(new Set(urls), new Set(expectedPaths.map(path => `${origin}${path}`)), 'Sitemap must contain every canonical page exactly once');
assert.equal(urls.length, expectedPaths.length, 'Sitemap contains duplicate URLs');

const attribute = (tag, name) => new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1];
const decode = text => text.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
const allTitles = new Set();
const allDescriptions = new Set();
const allHtml = new Map();

for (const path of expectedPaths) {
  const html = await read(`${path.slice(1)}index.html`);
  allHtml.set(path, html);
  const title = decode(/<title>([^<]+)<\/title>/.exec(html)?.[1] ?? '');
  assert.ok(title.length >= 20 && title.length <= 85, `${path}: meaningful title required`);
  assert.ok(!allTitles.has(title), `${path}: duplicate title`);
  allTitles.add(title);
  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map(match => match[0]);
  const description = decode(attribute(meta.find(tag => attribute(tag, 'name') === 'description') ?? '', 'content') ?? '');
  assert.ok(description.length >= 100 && description.length <= 180, `${path}: missing or excessive description (${description.length})`);
  assert.ok(!allDescriptions.has(description), `${path}: duplicate description`);
  allDescriptions.add(description);
  const canonical = [...html.matchAll(/<link\b[^>]*>/g)].map(match => match[0]).filter(tag => attribute(tag, 'rel') === 'canonical');
  assert.equal(canonical.length, 1, `${path}: one canonical required`);
  assert.equal(attribute(canonical[0], 'href'), `${origin}${path}`, `${path}: wrong canonical`);
  for (const property of ['og:url', 'og:title', 'og:description', 'og:image']) {
    const value = attribute(meta.find(tag => attribute(tag, 'property') === property) ?? '', 'content');
    assert.ok(value, `${path}: missing ${property}`);
    if (property === 'og:url') assert.equal(value, `${origin}${path}`, `${path}: inherited homepage OG URL`);
  }
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path}: one H1 required`);
  assert.ok(/<html[^>]+lang="en-IN"/.test(html), `${path}: document language missing`);
  assert.ok(!meta.some(tag => /noindex/.test(attribute(tag, 'content') ?? '') && attribute(tag, 'name') === 'robots'), `${path}: unexpectedly noindex`);

  const graphs = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1])).flatMap(data => data['@graph'] ?? [data]);
  const business = graphs.find(node => node['@id'] === `${origin}/#business`);
  assert.equal(business?.address?.postalCode, '500003', `${path}: local business postal address missing`);
  assert.equal(business?.telephone, '+919949695030', `${path}: inconsistent phone`);
  assert.equal(business?.address?.addressLocality, 'Secunderabad', `${path}: inconsistent locality`);
  assert.ok(!graphs.some(node => node.aggregateRating || node.review), `${path}: unverified review markup`);
  if (path.startsWith('/services/') && path !== '/services/') {
    const service = graphs.find(node => node['@type'] === 'Service');
    assert.equal(service?.url, `${origin}${path}`, `${path}: service entity missing`);
    assert.equal(service?.provider?.['@id'], business['@id'], `${path}: disconnected business entity`);
    assert.ok(graphs.some(node => node['@type'] === 'BreadcrumbList'), `${path}: breadcrumb data missing`);
    const main = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(html)?.[1] ?? '';
    const readable = main.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
    assert.ok(readable.split(/\s+/).length > 350, `${path}: service content must be present in static HTML`);
  }
}

const homepage = allHtml.get('/');
for (const entry of serviceDirs) {
  assert.ok(homepage.includes(`href="/services/${entry.name}/"`), `Homepage must link to ${entry.name}`);
}
// Check internal navigation and hash targets across all exported pages.
for (const [path, html] of allHtml) {
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = decode(match[1]);
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const url = new URL(href, `${origin}${path}`);
    if (url.pathname.startsWith('/images/') || url.pathname.startsWith('/models/')) continue;
    const normalized = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    assert.ok(allHtml.has(normalized), `${path}: broken internal link ${href}`);
    if (url.hash) {
      assert.ok(allHtml.get(normalized).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${path}: missing anchor ${href}`);
    }
  }
}
const robots = await read('robots.txt');
assert.ok(robots.includes('User-Agent: *\nAllow: /'), 'Public crawling must remain enabled');
assert.ok(!robots.includes('Disallow: /\n'), 'Do not block public crawling');
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'Sitemap discovery missing');
const llms = await read('llms.txt');
assert.ok(llms.includes('Secunderabad') && llms.includes('+919949695030'), 'Business discovery facts missing');
for (const entry of serviceDirs) assert.ok(llms.includes(`/services/${entry.name}/`), `Discovery link missing for ${entry.name}`);
console.log(`SEO checks passed: ${expectedPaths.length} static pages, unique metadata, canonical/social URLs, connected schema, sitemap, crawlability and internal links.`);
