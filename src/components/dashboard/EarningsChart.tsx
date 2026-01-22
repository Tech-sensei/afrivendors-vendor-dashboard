"use client";

import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { EarningData } from "@/data/dashboard";

interface EarningsChartProps {
  data: EarningData[];
}

export function EarningsChart({ data }: EarningsChartProps) {
  return (
    <div className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm">
      <div className="mb-10">
        <h2 className="font-unbounded text-lg font-bold text-secondary-000 tracking-tight mb-1">
          Earnings Overview
        </h2>
        <p className="font-unageo text-accent-60 text-sm font-medium">
          Last 7 days performance
        </p>
      </div>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f1f1" />
            <XAxis 
              dataKey="day" 
              tick={{ fill: '#a59e9b', fontFamily: 'Unageo, sans-serif', fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              dy={15}
            />
            <YAxis 
              tick={{ fill: '#a59e9b', fontFamily: 'Unageo, sans-serif', fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid #f1f1f1',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                padding: '12px 20px',
                fontFamily: 'Unageo, sans-serif'
              }}
              formatter={(value: any) => [`$${value.toLocaleString()}`, 'Earnings']}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px", color: "#1d0d04" }}
            />
            <Line 
              type="monotone" 
              dataKey="earnings" 
              stroke="#BC6D39" 
              strokeWidth={4}
              dot={{ fill: '#BC6D39', strokeWidth: 3, r: 5, stroke: '#fff' }}
              activeDot={{ r: 8, strokeWidth: 0, fill: '#BC6D39' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
