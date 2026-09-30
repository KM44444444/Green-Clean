import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useUser, API_BASE } from "@/UserContext";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const workerGuidelines = [
  "Wear safety gloves and masks during waste collection.",
  "Dispose of hazardous waste separately.",
  "Report any broken or overflowing bins immediately.",
  "Maintain cleanliness while on duty.",
  "Follow the assigned routes strictly.",
];

export default function WorkerPage() {
  const { currentUser, token } = useUser();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({ completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      if (!token) return;
      const [tasksRes, notifRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/worker/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/worker/notifications`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/worker/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const tasksData = await tasksRes.json();
      const notifData = await notifRes.json();
      const statsData = await statsRes.json();

      setTasks(tasksData.tasks || []);
      setNotifications(notifData.notifications || []);
      setStats(statsData || { completed: 0, pending: 0 });
    } catch (err) {
      toast({ title: "Error", description: "Could not load worker data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleClaim = async (taskId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/worker/tasks/${taskId}/claim`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to claim");
      toast({ title: "Task Claimed", description: "You have been assigned this task." });
      fetchData();
    } catch {
      toast({ title: "Error", description: "Could not claim task", variant: "destructive" });
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/worker/tasks/${taskId}/complete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to complete");
      toast({ title: "Task Completed", description: "Good job!" });
      fetchData();
    } catch {
      toast({ title: "Error", description: "Could not complete task", variant: "destructive" });
    }
  };

  if (!currentUser) return null;
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-green-600" /></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12 min-h-screen">
      <section className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser.name}</h1>
        <p className="text-gray-700 mb-1">Worker Area: <span className="font-medium">{currentUser.city}</span></p>
        {currentUser.verified ? (
          <p className="text-green-600 font-semibold">Verified Worker</p>
        ) : (
          <p className="text-red-500 font-semibold">Account Pending Verification</p>
        )}
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Available & Assigned Tasks</h2>
        {tasks.length === 0 ? <p className="text-gray-500">No tasks currently.</p> : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="p-4 border rounded flex justify-between items-center">
                <div>
                  <p className="font-medium text-lg">Report #{task.id} - {task.category}</p>
                  <p className="text-gray-600 text-sm">Location: {task.lat}, {task.lng}</p>
                  <p className="text-sm">Status: <span className="font-semibold capitalize text-green-700">{task.status}</span></p>
                </div>
                {task.status === "pending" && (
                  <Button onClick={() => handleClaim(task.id)}>Claim Task</Button>
                )}
                {task.status === "assigned" && task.assigned_worker_id === currentUser.id && (
                  <Button variant="eco" onClick={() => handleComplete(task.id)}>Mark Completed</Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Your Notifications</h2>
        <ul className="space-y-3">
          {notifications.length === 0 ? <p className="text-gray-500">No new notifications.</p> : null}
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
        <p className="text-gray-700 mb-2">Total tasks completed: {stats.completed}</p>
        <p className="text-gray-700 mb-2">Pending tasks: {stats.pending}</p>
      </section>

      <Footer />
    </div>
  );
}
