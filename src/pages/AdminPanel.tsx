import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialWorkers = [
  { name: "Rohan Singh", city: "Lucknow" },
  { name: "Priya Sharma", city: "Meerut" },
  { name: "Arjun Patel", city: "Kanpur" },
];

const initialUsers = [
  { name: "Asha Verma", role: "Citizen", city: "Meerut" },
  { name: "Rohan Singh", role: "Worker", city: "Lucknow" },
  { name: "Neha Patel", role: "Citizen", city: "Kanpur" },
];

const initialReports = [
  { id: "WR001", user: "Asha Verma", city: "Meerut", status: "Pending" },
  { id: "WR002", user: "Rohan Singh", city: "Lucknow", status: "In Progress" },
  { id: "WR003", user: "Neha Patel", city: "Kanpur", status: "Pending" },
];

const initialRewards = [
  { title: "Plant a Tree", points: 100 },
  { title: "Eco Bag", points: 50 },
];

export default function AdminPanel() {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [workers, setWorkers] = useState(initialWorkers);
  const [reports, setReports] = useState(initialReports);
  const [rewards, setRewards] = useState(initialRewards);

  const handleApprove = (name: string) => {
    setUsers(users.filter((u) => u.name !== name));
    toast({
      title: "Worker Approved",
      description: `${name} has been approved successfully.`,
    });
  };

  const handleReject = (name: string) => {
    setUsers(users.filter((u) => u.name !== name));
    toast({
      title: "Worker Rejected",
      description: `${name}'s application has been rejected.`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-gradient-hero text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Admin Command Center</h1>
          <p className="text-white/80 text-lg">Manage platform users, verify reports, and oversee operations.</p>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto -mt-8 space-y-8 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            ["Total Users", 128, "text-blue-500"],
            ["Total Reports", 64, "text-purple-500"],
            ["Pending", 12, "text-warning"],
            ["In Progress", 9, "text-orange-500"],
            ["Completed", 40, "text-success"],
            ["Rejected", 3, "text-destructive"],
          ].map(([label, value, colorClass]) => (
            <Card key={String(label)} className="shadow-card border-none bg-white">
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
                <p className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-card border-none bg-white">
          <Tabs defaultValue="workers" className="p-6">
            <TabsList className="mb-6 bg-muted/50 w-full justify-start overflow-x-auto">
              <TabsTrigger value="workers" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Worker Approvals</TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Active Reports</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Manage Citizens</TabsTrigger>
              <TabsTrigger value="rewards" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Rewards Program</TabsTrigger>
            </TabsList>

            <TabsContent value="workers" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Pending Worker Applications</h3>
                <Badge variant="secondary">{users.filter((u) => u.role === "Worker").length} Pending</Badge>
              </div>
              <div className="grid gap-3">
                {users.filter((u) => u.role === "Worker").map((user) => (
                  <div key={user.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:bg-muted/20 transition-colors gap-4">
                    <div>
                      <p className="font-semibold text-lg">{user.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        📍 {user.city}
                      </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button size="sm" variant="eco" className="flex-1 sm:flex-none" onClick={() => handleApprove(user.name)}>Approve</Button>
                      <Button size="sm" variant="destructive" className="flex-1 sm:flex-none" onClick={() => handleReject(user.name)}>Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <h3 className="text-xl font-semibold mb-4">Report Dispatch Console</h3>
              <div className="grid gap-3">
                {reports.map((report) => (
                  <div key={report.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-xl hover:bg-muted/20 transition-colors gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">#{report.id}</span>
                        <Badge variant="outline" className="bg-muted/30">{report.user}</Badge>
                        <Badge className={report.status === "Pending" ? "bg-warning text-warning-foreground border-none" : "bg-success text-success-foreground border-none"}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">📍 {report.city}</p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      {report.status === "Pending" ? (
                        <select 
                          className="border rounded-lg px-3 py-2 text-sm bg-background w-full md:w-64 focus:ring-2 focus:ring-primary outline-none transition-shadow"
                          onChange={(e) => {
                            if (e.target.value) {
                              setReports(reports.map(r => r.id === report.id ? { ...r, status: "In Progress" } : r));
                              toast({
                                title: "Worker Assigned",
                                description: `Report #${report.id} assigned to ${e.target.value}.`,
                              });
                            }
                          }}
                        >
                          <option value="">Assign to worker...</option>
                          {workers.map((worker) => (
                            <option key={worker.name} value={worker.name}>{worker.name} ({worker.city})</option>
                          ))}
                        </select>
                      ) : (
                        <Button variant="outline" size="sm" disabled>Assigned</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users">
              <h3 className="text-xl font-semibold mb-4">Citizen Directory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                  <div key={user.name} className="flex flex-col p-4 border rounded-xl hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-lg">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.city}</p>
                      </div>
                      <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full hover:bg-primary/5 hover:text-primary border-primary/20">
                      🎁 Award +50 Bonus
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Add New Reward</h3>
                <div className="p-5 border rounded-xl bg-muted/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label className="font-medium text-foreground">Reward Title</Label>
                    <Input placeholder="e.g. Free Coffee" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-medium text-foreground">Points Cost</Label>
                    <Input type="number" placeholder="e.g. 100" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-medium text-foreground">Category</Label>
                    <select className="w-full p-2 border rounded-md bg-white">
                      <option>Environment</option>
                      <option>Products</option>
                      <option>Food</option>
                      <option>Transport</option>
                    </select>
                  </div>
                  <Button variant="eco" className="w-full">Create Reward</Button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Active Rewards Catalog</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {rewards.map((reward) => (
                    <div key={reward.title} className="flex items-center justify-between p-4 border rounded-xl hover:border-primary/50 transition-colors">
                      <span className="font-medium">{reward.title}</span>
                      <Badge variant="default" className="bg-accent">{reward.points} pts</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
