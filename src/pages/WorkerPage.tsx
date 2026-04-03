import { useState, useEffect } from "react";
import Footer from "@/components/Footer";

type Notification = {
  id: number;
  area: string;
  message: string;
};

const workerGuidelines = [
  "Wear safety gloves and masks during waste collection.",
  "Dispose of hazardous waste separately.",
  "Report any broken or overflowing bins immediately.",
  "Maintain cleanliness while on duty.",
  "Follow the assigned routes strictly.",
];

export default function WorkerPage() {
  // Worker details (mock data here)
  const worker = {
    id: "W123",
    name: "John Doe",
    assignedArea: "Sector 5",
    verified: true,
  };

  const allNotifications: Notification[] = [
    { id: 1, area: "Sector 1", message: "Trash pickup scheduled tomorrow." },
    { id: 2, area: "Sector 5", message: "Please clean the park area." },
    { id: 3, area: "Sector 5", message: "New waste bins installed." },
    { id: 4, area: "Sector 3", message: "Weekly garbage pickup rescheduled." },
  ];

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (worker.verified) {
      setNotifications(allNotifications.filter((n) => n.area === worker.assignedArea));
    }
  }, [worker]);

  if (!worker.verified) {
    return <p>Your account is awaiting admin approval.</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      {/* Worker Info */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">Welcome, {worker.name}</h1>
        <p className="text-gray-700 mb-1">
          Worker ID: <span className="font-medium">{worker.id}</span>
        </p>
        <p className="text-gray-700 mb-1">
          Assigned Area: <span className="font-medium">{worker.assignedArea}</span>
        </p>
        <p className="text-green-600 font-semibold">{worker.verified ? "Verified Worker" : "Unverified Worker"}</p>
      </section>

      {/* Notifications Panel */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Your Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-600">No notifications at this time.</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((notification) => (
              <li key={notification.id} className="p-4 border border-gray-300 rounded shadow-sm bg-green-50">
                {notification.message}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Guidelines for Workers */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Guidelines for Workers</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {workerGuidelines.map((guideline, idx) => (
            <li key={idx}>{guideline}</li>
          ))}
        </ul>
      </section>

      {/* Embedded Dashboard Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
        {/* Put some dashboard summary info here */}
        <p className="text-gray-700 mb-2">Total tasks completed: 25</p>
        <p className="text-gray-700 mb-2">Pending tasks: 3</p>
        <p className="text-gray-700">Last login: September 10, 2025</p>
        {/* Add charts or stats if you have */}

        {/* Optionally add buttons to navigate to full dashboard page */}
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="mt-4 px-4 py-2 bg-eco-green text-white rounded hover:bg-green-600 transition"
        >
          Go to Full Dashboard
        </button>
      </section>

      <Footer />
    </div>
  );
}
