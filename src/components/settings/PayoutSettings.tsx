"use client";

import React from "react";
import { Plus, Building2, Smartphone, Trash2 } from "lucide-react";

interface PayoutMethod {
  id: string;
  type: "bank" | "mobile-money";
  name: string;
  details: string;
  isPrimary: boolean;
}

interface PayoutSettingsProps {
  methods: PayoutMethod[];
  onAddMethod: () => void;
  onDeleteMethod: (id: string) => void;
  onSetPrimary: (id: string) => void;
}

export function PayoutSettings({
  methods,
  onAddMethod,
  onDeleteMethod,
  onSetPrimary,
}: PayoutSettingsProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-5 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-unageo text-xl font-semibold text-secondary-000">
          Payout Methods
        </h2>
        <button
          onClick={onAddMethod}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-100 text-white text-sm font-semibold hover:bg-primary-100/90 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Method
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              method.isPrimary
                ? "border-primary-100 bg-primary-100/5"
                : "border-zinc-100 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  method.type === "bank" ? "bg-emerald-50" : "bg-amber-50"
                }`}
              >
                {method.type === "bank" ? (
                  <Building2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Smartphone className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-unageo text-[15px] font-semibold text-secondary-000">
                    {method.name}
                  </h4>
                  {method.isPrimary && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-100 text-white uppercase tracking-wider">
                      Primary
                    </span>
                  )}
                </div>
                <p className="font-unageo text-sm text-zinc-500">
                  {method.details}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!method.isPrimary && (
                <>
                  <button
                    onClick={() => onSetPrimary(method.id)}
                    className="px-3 py-1.5 rounded-lg border border-zinc-200 text-[12px] font-medium text-zinc-600 hover:border-primary-100 hover:text-primary-100 transition-all active:scale-95 cursor-pointer"
                  >
                    Set Primary
                  </button>
                  <button
                    onClick={() => onDeleteMethod(method.id)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
