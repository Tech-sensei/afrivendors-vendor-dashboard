import React from 'react';

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-accent-20 rounded-lg p-6">
        <h3 className="font-unbounded font-semibold text-secondary-000 text-lg mb-4">Wallet Balance</h3>
        <p className="font-unbounded text-3xl font-semibold text-secondary-000 mb-4">₦0.00</p>
        <p className="text-accent-60">No transactions yet</p>
      </div>
    </div>
  );
}
