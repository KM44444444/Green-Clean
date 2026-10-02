import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useUser, API_BASE } from "@/UserContext";
import { Loader2, MapPin, AlertCircle, CheckCircle, Activity, ClipboardList, Bell, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen bg-muted/30">

      <section className="bg-gradient-hero text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              Worker Dashboard
            </h1>
            <p className="text-white/80 text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5" /> {currentUser.city} Area
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-lg font-medium">Welcome, {currentUser.name}</span>
            {currentUser.verified ? (
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mt-2">
                <CheckCircle className="w-3 h-3 mr-1" /> Verified Partner
              </Badge>
            ) : (
              <Badge className="bg-red-500/80 text-white hover:bg-red-500/90 border-none mt-2">
                <AlertCircle className="w-3 h-3 mr-1" /> Pending Verification
              </Badge>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 -mt-8 space-y-8 pb-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-card border-none bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-success/10 rounded-xl text-success">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Tasks</p>
                <h3 className="text-3xl font-bold">{stats.completed}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-none bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-warning/10 rounded-xl text-warning">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                <h3 className="text-3xl font-bold">{stats.pending}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card border-none">
              <CardHeader className="border-b bg-muted/10">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" /> Tasks & Assignments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {tasks.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No tasks currently available.</p>
                  </div>
                ) : (
                  <ul className="divide-y">
                    {tasks.map((task) => (
                      <li key={task.id} className="p-6 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg text-foreground">Report #{task.id}</span>
                            <Badge variant={task.status === "completed" ? "default" : "secondary"} className="capitalize">
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Location: {task.lat}, {task.lng}
                          </p>
                          <p className="text-sm font-medium text-primary bg-primary/5 px-2 py-1 rounded-md inline-block">
                            Category: {task.category}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {task.status === "pending" && (
                            <Button className="w-full sm:w-auto shadow-button" onClick={() => handleClaim(task.id)}>
                              Claim Task
                            </Button>
                          )}
                          {task.status === "assigned" && task.assigned_worker_id === currentUser.id && (
                            <Button variant="eco" className="w-full sm:w-auto shadow-button" onClick={() => handleComplete(task.id)}>
                              <CheckCircle className="w-4 h-4 mr-2" /> Mark Complete
                            </Button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>


          <div className="space-y-6">
            <Card className="shadow-card border-none bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-accent" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No new notifications.</p>
                  ) : (
                    notifications.map((notif) => (
                      <li key={notif.id} className="p-3 bg-white border rounded-lg text-sm shadow-sm flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                        <span className="text-foreground">{notif.message}</span>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {workerGuidelines.map((guideline, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="font-bold text-accent">•</span> {guideline}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
