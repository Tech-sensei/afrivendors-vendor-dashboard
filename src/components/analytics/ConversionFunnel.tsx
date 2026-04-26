"use client";

import type { ConversionStep } from '@/data/analytics';

interface ConversionFunnelProps {
  data: ConversionStep[];
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  return (
    <div className="bg-white border border-accent-20 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="font-unageo text-lg font-semibold text-secondary-000 mb-1">
          Conversion Funnel
        </h3>
        <p className="font-unageo text-sm text-accent-60">
          From profile view to booking completion
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {data.map((step, index) => {
          const percentage =
            index === 0
              ? 100
              : parseFloat(((step.value / data[0].value) * 100).toFixed(1));

          return (
            <div key={step.name}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-unageo text-sm font-medium text-secondary-000">
                  {step.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-unageo text-sm font-semibold text-secondary-300">
                    {step.value.toLocaleString()}
                  </span>
                  <span className="font-unageo text-[13px] font-medium text-accent-60 min-w-[50px] text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full h-10 bg-accent-10 rounded-xl overflow-hidden">
                <div
                  className="h-full rounded-xl transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%`, backgroundColor: step.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
