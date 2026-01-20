'use client';

interface ServicesStatsProps {
  totalCount: number;
  publishedCount: number;
  hiddenCount: number;
}

export function ServicesStats({ totalCount, publishedCount, hiddenCount }: ServicesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-2">
      {/* Total Services */}
      <div className="p-7 bg-white border border-secondary-600 rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300">
        <p className="font-unageo text-[13px] font-bold text-accent-80 uppercase tracking-widest mb-3">
          Total Services
        </p>
        <p className="font-unbounded text-5xl font-bold text-secondary-000">
          {totalCount}
        </p>
      </div>
      
      {/* Published */}
      <div className="p-7 bg-[#D1FAE5]/30 border border-[#059669]/20 rounded-[24px]">
        <p className="font-unageo text-[13px] font-bold text-[#059669] uppercase tracking-widest mb-3">
          Published
        </p>
        <p className="font-unbounded text-5xl font-bold text-[#059669]">
          {publishedCount}
        </p>
      </div>
      
      {/* Hidden */}
      <div className="p-7 bg-white border border-secondary-600 rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300">
        <p className="font-unageo text-[13px] font-bold text-accent-80 uppercase tracking-widest mb-3">
          Hidden
        </p>
        <p className="font-unbounded text-5xl font-bold text-secondary-000">
          {hiddenCount}
        </p>
      </div>
    </div>
  );
}

