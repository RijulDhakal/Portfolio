"use client";

import type { TypographyElementOverrideDto } from "@/lib/api";
import { Card } from "../ui";
import { emptyOverride, isOverrideEmpty, otherGroups } from "./shared";
import { OverrideEditor } from "./widgets";

export function OtherTextCard({
  overrides,
  onOverrideChange,
  onResetOverride,
}: {
  overrides: Record<string, TypographyElementOverrideDto>;
  onOverrideChange: (key: string, value: TypographyElementOverrideDto) => void;
  onResetOverride: (key: string) => void;
}) {
  return (
    <Card>
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl uppercase tracking-tight">Other text</h2>
        <p className="text-sm text-secondary mt-1">
          Text outside the CMS sections: intro, personal, contact, footer and navigation.
          Overrides here apply on top of the global defaults.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {otherGroups.map((group) => {
          const groupHasOverrides = group.elements.some(
            (e) => !isOverrideEmpty(overrides[e.key] ?? emptyOverride)
          );
          return (
            <div key={group.id}>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-display font-bold text-lg uppercase tracking-tight">
                  {group.label}
                </h3>
                {groupHasOverrides && (
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-electric/10 text-electric border border-electric/30">
                    Overridden
                  </span>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {group.elements.map((element) => (
                  <OverrideEditor
                    key={element.key}
                    elementLabel={element.label}
                    kind={element.kind}
                    sizeLocked={element.sizeLocked}
                    alignable={element.alignable}
                    value={overrides[element.key] ?? emptyOverride}
                    onChange={(v) => onOverrideChange(element.key, v)}
                    onReset={() => onResetOverride(element.key)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
