"use client";

import { useMemo, useState } from "react";

import MovementFilter from "@/components/movements/MovementFilter";
import MovementGrid from "@/components/movements/MovementGrid";
import MovementHeader from "@/components/movements/MovementHeader";
import Card from "@/components/ui/Card";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Section from "@/components/ui/Section";
import { movements } from "@/data/movements/movements";
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

  const filteredMovements = useMemo(
    () =>
      movements.filter(
        (movement) =>
          (!filters.muscleGroup || movement.muscleGroup === filters.muscleGroup) &&
          (!filters.equipment || movement.equipment === filters.equipment) &&
          (!filters.difficulty || movement.difficulty === filters.difficulty),
      ),
    [filters],
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-12">
        <MovementHeader count={movements.length} />

        <MovementFilter
          movements={movements}
          filters={filters}
          onChange={setFilters}
        />

        {filteredMovements.length > 0 ? (
          <MovementGrid movements={filteredMovements} />
        ) : (
          <Card
            title="Sonuç bulunamadı"
            description="Seçtiğin filtrelerle eşleşen örnek hareket bulunmuyor."
            variant="subtle"
          />
        )}

        <FeatureGrid items={libraryFeatures} columns={3} />
      </Section>
    </main>
  );
}
