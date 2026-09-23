import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  getUsers,
  updateUser,
  deleteUser,
  getReports,
  updateReportStatus,
  deleteReport,
  getRewards,
  addReward,
  deleteReward,
  addPoints,
  osmLink,
  timeAgo,
  StoredUser,
  WasteReport,
  Reward,
} from "@/lib/store";

export default function AdminPanel() {
  const { toast } = useToast();
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  // new reward form
  const [rTitle, setRTitle] = useState("");
  const [rDesc, setRDesc] = useState("");
  const [rPoints, setRPoints] = useState<number | "">("");
  const [rCategory, setRCategory] = useState("Products");

  const reload = () => {
    setUsers(getUsers());
    setReports(getReports());
    setRewards(getRewards());
  };
  useEffect(() => { reload(); }, []);

  const pendingWorkers = users.filter((u) => u.role === "worker" && !u.verified);
  const activeWorkers = users.filter((u) => u.role === "worker" && u.verified);
  const citizens = users.filter((u) => u.role === "user");

  const stats = useMemo(() => ({
    totalUsers: users.length,
    totalReports: reports.length,
    pending: reports.filter((r) => r.status === "reported").length,
    inProgress: reports.filter((r) => r.status === "assigned").length,
    completed: reports.filter((r) => r.status === "cleaned").length,
    rejected: reports.filter((r) => r.status === "rejected").length,
  }), [users, reports]);

  const approveWorker = (u: StoredUser) => {
    updateUser(u.id, { verified: true });
    toast({ title: "Worker approved", description: `${u.name} can now access assigned tasks.` });
    reload();
  };

  const rejectWorker = (u: StoredUser) => {
    deleteUser(u.id);
    toast({ title: "Application rejected", description: `${u.name}'s worker account was removed.` });
    reload();
  };

  const moderateReport = (r: WasteReport, action: "reject" | "delete") => {
    if (action === "reject") {
      updateReportStatus(r.id, "rejected");
      toast({ title: "Report rejected", description: `#${r.id} marked as rejected.` });
    } else {
      deleteReport(r.id);
      toast({ title: "Report deleted", description: `#${r.id} removed.` });
    }
    reload();
  };

  const giveBonus = (u: StoredUser) => {
    addPoints(u.id, 50, "Monthly admin bonus", "bonus");
    toast({ title: "Bonus awarded", description: `${u.name} received 50 bonus points.` });
    reload();
  };

  const submitReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rTitle || !rPoints) {
      toast({ title: "Missing fields", description: "Title and points are required.", variant: "destructive" });
      return;
    }
    addReward({ title: rTitle, description: rDesc, points: Number(rPoints), category: rCategory });
    setRTitle(""); setRDesc(""); setRPoints(""); setRCategory("Products");
    toast({ title: "Reward added" });
    reload();
  };

  const removeReward = (id: string) => {
    deleteReward(id);
    reload();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users, moderate reports, and configure rewards.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          ["Users", stats.totalUsers],
          ["Reports", stats.totalReports],
          ["Pending", stats.pending],
          ["In Progress", stats.inProgress],
          ["Completed", stats.completed],
          ["Rejected", stats.rejected],
        ].map(([label, value]) => (
          <Card key={label as string}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{value as number}</p>
              <p className="text-xs text-muted-foreground">{label as string}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="workers">
        <TabsList>
          <TabsTrigger value="workers">Worker Approvals ({pendingWorkers.length})</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        {/* Worker approvals */}
        <TabsContent value="workers" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>Pending Worker Applications</CardTitle></CardHeader>
            <CardContent>
              {pendingWorkers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending applications.</p>
              ) : (
                <div className="space-y-3">
                  {pendingWorkers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{u.name} <span className="text-muted-foreground text-sm">({u.email})</span></p>
                        <p className="text-xs text-muted-foreground">{u.city}, {u.state} • applied {timeAgo(u.createdAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="eco" onClick={() => approveWorker(u)}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => rejectWorker(u)}>Reject</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Active Workers</CardTitle></CardHeader>
            <CardContent>
              {activeWorkers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active workers yet.</p>
              ) : (
                <div className="space-y-2">
                  {activeWorkers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.city}, {u.state}</p>
                      </div>
                      <Badge className="bg-success text-success-foreground">Verified</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports moderation */}
        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader><CardTitle>All Reports</CardTitle></CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reports submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {reports.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 border rounded-lg gap-3">
                      <div>
                        <p className="font-medium">#{r.id} — {r.userName}</p>
                        <a href={osmLink(r.lat, r.lng)} target="_blank" rel="noreferrer" className="text-sm underline text-accent">
                          {r.city}
                        </a>
                        <p className="text-xs text-muted-foreground">{timeAgo(r.createdAt)} • {r.status}{r.assignedWorkerName ? ` • worker: ${r.assignedWorkerName}` : ""}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {r.status !== "rejected" && (
                          <Button size="sm" variant="outline" onClick={() => moderateReport(r, "reject")}>Reject</Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => moderateReport(r, "delete")}>Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Citizens ({citizens.length})</CardTitle></CardHeader>
            <CardContent>
              {citizens.length === 0 ? (
                <p className="text-sm text-muted-foreground">No citizen accounts yet.</p>
              ) : (
                <div className="space-y-2">
                  {citizens.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{u.name} <span className="text-muted-foreground text-sm">({u.email})</span></p>
                        <p className="text-xs text-muted-foreground">{u.city}, {u.state} • {u.points} points</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => giveBonus(u)}>+50 bonus points</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards */}
        <TabsContent value="rewards" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle>Add a Reward</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submitReward} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <Label>Title</Label>
                  <Input value={rTitle} onChange={(e) => setRTitle(e.target.value)} placeholder="Reward title" />
                </div>
                <div>
                  <Label>Points</Label>
                  <Input type="number" value={rPoints} onChange={(e) => setRPoints(e.target.value ? parseInt(e.target.value) : "")} placeholder="e.g. 100" />
                </div>
                <div>
                  <Label>Category</Label>
                  <select value={rCategory} onChange={(e) => setRCategory(e.target.value)} className="w-full p-2 border rounded">
                    <option>Environment</option>
                    <option>Products</option>
                    <option>Food</option>
                    <option>Transport</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <Label>Description</Label>
                  <Input value={rDesc} onChange={(e) => setRDesc(e.target.value)} placeholder="Short description" />
                </div>
                <Button type="submit" variant="eco" className="md:col-span-4">Add Reward</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Current Rewards</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rewards.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{r.title} — {r.points} pts</p>
                      <p className="text-xs text-muted-foreground">{r.category} • {r.description}</p>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => removeReward(r.id)}>Remove</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
