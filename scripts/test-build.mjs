import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import ts from 'typescript';
// Test the same pure domain module shipped to the browser, without a test dependency.
const source = await readFile(new URL('../src/lib/build.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { emptyBuild, toggleUpgrade, validateBuild, encodeBuild, decodeBuild, enquiryMessage } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
let checks = 0;
function check(name, fn) { fn(); checks++; console.log(`PASS ${name}`); }
check('share link round-trips Unicode vehicle preferences', () => { const build = { ...emptyBuild(), vehicle: { make: 'Škoda', model: 'Kushaq', year: '2023' }, selections: ['matting-cocoa', 'light-amber'], lighting: 'amber' }; assert.deepEqual(decodeBuild(encodeBuild(build)), build); });
check('exclusive light and rim choices preserve unrelated upgrades', () => { let build = toggleUpgrade(emptyBuild(), 'matting-cocoa'); for (const id of ['light-red', 'light-blue', 'rim-silver', 'rim-bronze']) build = toggleUpgrade(build, id); assert.deepEqual(build.selections, ['matting-cocoa', 'light-blue', 'rim-bronze']); assert.equal(build.lighting, 'blue'); });
check('remove does not mutate saved snapshots', () => { const before = toggleUpgrade(emptyBuild(), 'dsp'); const next = toggleUpgrade(before, 'dsp'); assert.deepEqual(before.selections, ['dsp']); assert.deepEqual(next.selections, []); assert.notEqual(next, before); });
check('malformed and unsupported shared versions are rejected', () => { for (const value of ['%', 'A'.repeat(4001), 'e30', 'eyJ2ZXJzaW9uIjo5fQ']) assert.equal(decodeBuild(value), null); });
check('import filters unknown IDs, duplicates, controls and invalid years', () => { const valid = validateBuild({ version: 1, vehicle: { make: '<Hyundai>\n', model: 'i20', year: 'oops' }, selections: ['bogus', 'dsp', 'dsp', 'light-blue', 'light-red', 'rim-silver', 'rim-bronze'] }); assert.equal(valid.vehicle.make, 'Hyundai'); assert.equal(valid.vehicle.year, ''); assert.deepEqual(valid.selections, ['dsp', 'light-red', 'rim-bronze']); assert.equal(valid.lighting, 'red'); });
check('quote message includes exact car, upgrades, goal, budget and visit', () => { const build = { ...emptyBuild(), vehicle: { make: 'Hyundai', model: 'i20', year: '2022' }, selections: ['pioneer-receiver', 'matting-cocoa'] }; const message = enquiryMessage(build, { name: 'Preview Visitor', goal: 'Clear sound & fitted mats', budget: '₹25,000–₹50,000', visit: true }); for (const text of ['Hyundai i20 2022', 'Pioneer receiver', 'Cocoa quilt matting', 'Clear sound & fitted mats', '₹25,000–₹50,000', 'workshop visit', 'confirm fitment']) assert.ok(message.includes(text)); const url = new URL(`https://wa.me/919949695030?text=${encodeURIComponent(message)}`); assert.equal(url.searchParams.get('text'), message); });
check('empty configuration requests advice without fabricated prices', () => { const message = enquiryMessage(emptyBuild()); assert.ok(message.includes('Help me choose')); assert.ok(message.includes('Vehicle to be confirmed')); assert.ok(!message.includes('undefined')); });
console.log(`${checks} build-domain checks passed.`);
