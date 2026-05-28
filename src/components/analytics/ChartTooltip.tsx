"use client";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-accent-20 rounded-xl p-3 shadow-lg">
      <p className="font-unbounded text-[13px] font-semibold text-secondary-000 mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="font-unageo text-[13px] my-1" style={{ color: entry.color }}>
          {entry.name}:{' '}
          {entry.name.toLowerCase().includes('earnings') || entry.name.toLowerCase().includes('revenue')
            ? '£'
            : ''}
          {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}
