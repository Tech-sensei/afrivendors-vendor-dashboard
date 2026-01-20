import React from 'react';

export default function Page() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-accent-20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent-60 mb-1">Total Revenue</p>
              <p className="font-unbounded text-2xl font-semibold text-secondary-000">₦0.00</p>
            </div>
            <div className="w-12 h-12 bg-primary-300 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-accent-20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent-60 mb-1">Total Orders</p>
              <p className="font-unbounded text-2xl font-semibold text-secondary-000">0</p>
            </div>
            <div className="w-12 h-12 bg-secondary-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-accent-20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent-60 mb-1">Total Products</p>
              <p className="font-unbounded text-2xl font-semibold text-secondary-000">0</p>
            </div>
            <div className="w-12 h-12 bg-secondary-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-accent-20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent-60 mb-1">Active Customers</p>
              <p className="font-unbounded text-2xl font-semibold text-secondary-000">0</p>
            </div>
            <div className="w-12 h-12 bg-secondary-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-accent-20 rounded-lg p-6">
        <h3 className="font-unbounded font-semibold text-secondary-000 text-lg mb-4">Recent Activity</h3>
        <div className="text-center py-12">
          <p className="text-accent-60">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}
