"use client";

import { useMemo, useState } from "react";

import FavoritesStorageControls from "@/components/favorites/FavoritesStorageControls";
import MovementFilter from "@/components/movements/MovementFilter";
import MovementGrid from "@/components/movements/MovementGrid";
import MovementHeader from "@/components/movements/MovementHeader";
import Card from "@/components/ui/Card";
import CTAButton from "@/components/ui/CTAButton";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Section from "@/components/ui/Section";
import { movements } from "@/data/movements/movements";
import { searchMovements } from "@/lib/movements/discovery";
import type { MovementFilters } from "@/lib/movements/types";

const libraryFeatures = [
  {
    title: "Teknik odaklı",
    description: "Hareket detayları adım adım uygulama bilgisini destekler.",
  },
  {
    title: "Filtrelenebilir",
    description: "Kas grubu, ekipman ve zorluk seviyesine göre keşfedilebilir.",
  },
  {
    title: "Ölçeklenebilir",
    description: "Aynı veri modeli yüzlerce hareketi desteklemek için hazırdır.",
  },
];

export default function MovementsPage() {
  const [filters, setFilters] = useState<MovementFilters>({});
  const [query, setQuery] = useState("");

  const filteredMovements = useMemo(
    () =>
      searchMovements(movements, query).filter(
        (movement) =>
          (!filters.muscleGroup || movement.muscleGroup === filters.muscleGroup) &&
          (!filters.equipment || movement.equipment === filters.equipment) &&
          (!filters.difficulty || movement.difficulty === filters.difficulty),
      ),
    [filters, query],
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-12">
        <MovementHeader count={movements.length} />

        <FavoritesStorageControls kind="movements" itemLabel="hareket" />

        <MovementFilter
          movements={movements}
          filters={filters}
          onChange={setFilters}
          query={query}
          onQueryChange={setQuery}
          resultCount={filteredMovements.length}
          onClear={() => { setFilters({}); setQuery(""); }}
        />

        {filteredMovements.length > 0 ? (
          <MovementGrid movements={filteredMovements} />
        ) : (
          <Card
            title="Sonuç bulunamadı"
            description="Seçtiğin filtrelerle eşleşen örnek hareket bulunmuyor."
            variant="subtle"
          >
            <CTAButton type="button" variant="secondary" onClick={() => { setFilters({}); setQuery(""); }}>
              Filtreleri Temizle
            </CTAButton>
          </Card>
        )}

        <FeatureGrid items={libraryFeatures} columns={3} />
      </Section>
    </main>
  );
}
