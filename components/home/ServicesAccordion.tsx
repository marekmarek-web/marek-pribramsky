"use client";

import { useCallback, useMemo, useState } from "react";
import { serviceItems, type ServiceItem } from "@/components/home/home-data";
import { ServiceCard } from "@/components/home/ServiceCard";

const SERVICES_ACC_DOM_ID = "home-services-accordion";

type OpenRow = "top" | "bottom" | null;

function ServiceRow({
  rowKey,
  items,
  openRow,
  onCardClick,
  baseId,
}: {
  rowKey: "top" | "bottom";
  items: ServiceItem[];
  openRow: OpenRow;
  onCardClick: (row: "top" | "bottom") => void;
  baseId: string;
}) {
  const rowOpen = openRow === rowKey;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5 lg:gap-6">
      {items.map((item) => {
        const triggerId = `${baseId}-svc-${item.id}-trigger`;
        const panelId = `${baseId}-svc-${item.id}-panel`;
        return (
          <ServiceCard
            key={item.id}
            item={item}
            open={rowOpen}
            onToggle={() => onCardClick(rowKey)}
            triggerId={triggerId}
            panelId={panelId}
          />
        );
      })}
    </div>
  );
}

export function ServicesAccordion() {
  const baseId = SERVICES_ACC_DOM_ID;
  const [openRow, setOpenRow] = useState<OpenRow>(null);

  const { topRow, bottomRow } = useMemo(
    () => ({
      topRow: serviceItems.slice(0, 3),
      bottomRow: serviceItems.slice(3, 6),
    }),
    []
  );

  const onCardClick = useCallback((row: "top" | "bottom") => {
    setOpenRow((prev) => {
      if (prev === row) return null;
      return row;
    });
  }, []);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <ServiceRow rowKey="top" items={topRow} openRow={openRow} onCardClick={onCardClick} baseId={baseId} />
      <ServiceRow rowKey="bottom" items={bottomRow} openRow={openRow} onCardClick={onCardClick} baseId={baseId} />
    </div>
  );
}
