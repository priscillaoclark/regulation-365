// dashboard/overview/page.tsx

import React from "react";

export default function OverviewPage() {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold">Dashboard Overview</h2>

      {/* Key Statistics Section */}
      <section className="bg-white p-6 rounded shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Key Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-lime-500 text-white rounded shadow">
            <p className="text-sm">Total Users</p>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="p-4 bg-blue-500 text-white rounded shadow">
            <p className="text-sm">Active Sessions</p>
            <p className="text-2xl font-bold">567</p>
          </div>
          <div className="p-4 bg-red-500 text-white rounded shadow">
            <p className="text-sm">New Sign-ups</p>
            <p className="text-2xl font-bold">89</p>
          </div>
          <div className="p-4 bg-yellow-500 text-white rounded shadow">
            <p className="text-sm">Upcoming Renewals</p>
            <p className="text-2xl font-bold">42</p>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="bg-white p-6 rounded shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Recent Activity</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>User A signed in at 10:15 AM</li>
          <li>User B updated their profile</li>
          <li>User C signed up for the newsletter</li>
          <li>User D completed a new session</li>
        </ul>
      </section>

      {/* Upcoming Events Section */}
      <section className="bg-white p-6 rounded shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Upcoming Events</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Webinar on Compliance - Oct 28, 2024</li>
          <li>Annual Review Meeting - Nov 15, 2024</li>
          <li>Product Release - Dec 1, 2024</li>
        </ul>
      </section>
    </div>
  );
}
