import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readSource(relativePath: string): string {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("homepage and navbar expose the locked Energy entry labels and destinations", () => {
  const hero = readSource("components/home/HeroSection.tsx");
  const finalCta = readSource("components/home/FinalCTA.tsx");
  const navbar = readSource("components/layout/Navbar.tsx");

  assert.match(hero, /href=\{ENERGY_LAB_PATH\}[\s\S]{0,120}Kalori Hedefini Hesapla/);
  assert.match(hero, /href="\/calculators"[\s\S]{0,120}Bilimsel Araçları Keşfet/);
  assert.match(finalCta, /href=\{ENERGY_LAB_PATH\}[\s\S]{0,120}Kalori Hedefini Hesapla/);
  assert.equal(navbar.match(/<CTAButton href=\{ENERGY_LAB_PATH\}>Kalori Hedefi<\/CTAButton>/g)?.length, 2);
});

test("calculator index keeps the locked static need-to-tool guide contract", () => {
  const page = readSource("app/calculators/page.tsx");
  const mappings = [
    ["Günlük kalori hedefim için bir başlangıç tahmini istiyorum.", "Kalori Hedefi Simülatörü", "ENERGY_LAB_PATH"],
    ["Kalori hedefim hazır; protein, karbonhidrat ve yağ dağılımını planlamak istiyorum.", "Makro Planlayıcı", '"/calculators/macro"'],
    ["Günlük protein için pratik bir referans istiyorum.", "Günlük Protein Referansı", '"/calculators/protein"'],
    ["Yağsız kütlemi boyuma göre genel bir bağlamda incelemek istiyorum.", "FFMI Analizi", '"/calculators/ffmi"'],
  ] as const;

  assert.match(page, /Ne hesaplamak istiyorsun\?/);
  assert.match(page, /İhtiyacına en yakın seçeneği seç; araçları belirli bir sırayla kullanman gerekmez\./);
  assert.match(page, /<Link[\s\S]*href=\{item\.destination\}/);

  for (const [need, tool, destination] of mappings) {
    assert.ok(page.includes(`need: "${need}"`));
    assert.ok(page.includes(`tool: "${tool}"`));
    assert.ok(page.includes(`destination: ${destination}`));
  }
});

test("homepage Tools orientation copy represents the complete active scope", () => {
  const tools = readSource("components/home/ToolsShowcase.tsx");

  assert.match(
    tools,
    /Enerji ve beslenme planlamasından vücut kompozisyonu bağlamına kadar, daha bilinçli kararlar için bilimsel araçlar\./,
  );
  assert.doesNotMatch(tools, /Kalori ve makro verilerini analiz ederek/);
});
