"use client";

import { useCallback, useId, useState } from "react";
import { serviceItems } from "@/components/home/home-data";
import { ServiceCard } from "@/components/home/ServiceCard";

export function ServicesAccordion() {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5 lg:gap-6">
      {serviceItems.map((item) => {
        const triggerId = `${baseId}-svc-${item.id}-trigger`;
        const panelId = `${baseId}-svc-${item.id}-panel`;
        const open = openId === item.id;
        return (
          <ServiceCard key={item.id} item={item} open={open} onToggle={() => toggle(item.id)} panelId={panelId} triggerId={triggerId} />
        );
      })}
    </div>
  );
}
