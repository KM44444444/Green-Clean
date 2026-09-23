import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";

const workerGuidelines = [
  "Wear safety gloves and masks during waste collection.",
  "Dispose of hazardous waste separately.",
  "Report any broken or overflowing bins immediately.",
  "Maintain cleanliness while on duty.",
  "Follow the assigned routes strictly.",
];

export default function WorkerPage() {
  const worker = {
    id: "W123",
    name: "John Doe",
    assignedArea: "Sector 5",
    verified: true,
  };

  const notifications = [
    { id: 1, area: "Sector 5", message: "Trash pickup scheduled tomorrow." },
    { id: 2, area: "Sector 5", message: "Please clean the park area." },
    { id: 3, area: "Sector 5", message: "New waste bins installed." },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      <section className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">Welcome, {worker.name}</h1>
        <p className="text-gray-700 mb-1">Worker ID: <span className="font-medium">{worker.id}</span></p>
        <p className="text-gray-700 mb-1">Assigned Area: <span className="font-medium">{worker.assignedArea}</span></p>
        <p className="text-green-600 font-semibold">Verified Worker</p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Your Notifications</h2>
        <ul className="space-y-3">
          {notifications.map((notification) => (
            <li key={notification.id} className="p-4 border border-gray-300 rounded shadow-sm bg-green-50">
              {notification.message}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Guidelines for Workers</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {workerGuidelines.map((guideline, idx) => (
            <li key={idx}>{guideline}</li>
          ))}
        </ul>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
        <p className="text-gray-700 mb-2">Total tasks completed: 25</p>
        <p className="text-gray-700 mb-2">Pending tasks: 3</p>
        <p className="text-gray-700">Last login: September 10, 2025</p>
      </section>

      <Footer />
    </div>
  );
}
