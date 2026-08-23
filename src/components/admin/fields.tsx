"use client";

import { useState } from "react";
import MediaPicker from "./MediaPicker";
import { Field, Input, inputCls, btnSecondary } from "./ui";

export function UrlField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "/uploads/… or https://…"}
        />
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className={btnSecondary}
        >
          Pick
        </button>
      </div>
      {pickerOpen && (
        <MediaPicker
          onSelect={(url) => {
            onChange(url);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </Field>
  );
}

export function ChipsEditor({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder ?? "Add an item and press Enter"}
          className={inputCls}
        />
        <button type="button" onClick={add} className={btnSecondary}>
          Add
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-bold tracking-widest uppercase"
            >
              {value}
              <button
                type="button"
                onClick={() => onChange(values.filter((v) => v !== value))}
                className="text-secondary hover:text-red-400 transition-colors"
                aria-label={`Remove ${value}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
