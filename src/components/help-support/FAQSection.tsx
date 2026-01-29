"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ } from '@/data/help-support';

interface FAQItemProps {
  faq: FAQ;
  isExpanded: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, isExpanded, onToggle }: FAQItemProps) {
  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-50 transition-colors"
      >
        <h3 className="font-unbounded text-base font-bold text-secondary-000 pr-4">
          {faq.question}
        </h3>
        {isExpanded ? (
          <ChevronUp size={20} className="text-primary-100 shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-accent-60 shrink-0" />
        )}
      </button>
      {isExpanded && (
        <div className="px-5 pb-5 pt-0">
          <p className="font-unageo text-sm text-accent-80 leading-relaxed">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8">
      <div className="mb-6">
        <h2 className="font-unbounded text-xl font-bold text-secondary-000 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="font-unageo text-sm text-accent-60">
          Find quick answers to common questions
        </p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            faq={faq}
            isExpanded={expandedIndex === index}
            onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}
