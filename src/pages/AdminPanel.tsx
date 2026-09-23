import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const workers = [
  { name: "Rohan Singh", city: "Lucknow" },
  { name: "Priya Sharma", city: "Meerut" },
  { name: "Arjun Patel", city: "Kanpur" },
];

const users = [
  { name: "Asha Verma", role: "Citizen", city: "Meerut" },
  { name: "Rohan Singh", role: "Worker", city: "Lucknow" },
  { name: "Neha Patel", role: "Citizen", city: "Kanpur" },
];

const reports = [
  { id: "WR001", user: "Asha Verma", city: "Meerut", status: "Pending" },
  { id: "WR002", user: "Rohan Singh", city: "Lucknow", status: "In Progress" },
  { id: "WR003", user: "Neha Patel", city: "Kanpur", status: "Pending" },
];

const rewards = [
  { title: "Plant a Tree", points: 100 },
  { title: "Eco Bag", points: 50 },
];

export default function AdminPanel() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users, reports, and rewards.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          ["Users", 128],
          ["Reports", 64],
          ["Pending", 12],
          ["In Progress", 9],
          ["Completed", 40],
          ["Rejected", 3],
        ].map(([label, value]) => (
          <Card key={String(label)}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="workers">
        <TabsList>
          <TabsTrigger value="workers">Worker Approvals</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="workers" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>Pending Worker Applications</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.filter((u) => u.role === "Worker").map((user) => (
                  <div key={user.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.city}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="eco">Approve</Button>
                      <Button size="sm" variant="destructive">Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader><CardTitle>All Reports</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg gap-3">
                    <div>
                      <p className="font-medium">#{report.id} — {report.user}</p>
                      <p className="text-xs text-muted-foreground">{report.city}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={report.status === "Pending" ? "bg-warning text-warning-foreground" : "bg-success text-success-foreground"}>{report.status}</Badge>
                      {report.status === "Pending" && (
                        <select className="border rounded px-2 py-1 text-sm">
                          <option value="">Assign worker</option>
                          {workers.map((worker) => (
                            <option key={worker.name} value={worker.name}>{worker.name} ({worker.city})</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Citizens</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role} • {user.city}</p>
                    </div>
                    <Button size="sm" variant="outline">+50 bonus</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle>Add a Reward</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <Label>Title</Label>
                  <Input placeholder="Reward title" />
                </div>
                <div>
                  <Label>Points</Label>
                  <Input type="number" placeholder="e.g. 100" />
                </div>
                <div>
                  <Label>Category</Label>
                  <select className="w-full p-2 border rounded">
                    <option>Environment</option>
                    <option>Products</option>
                    <option>Food</option>
                    <option>Transport</option>
                  </select>
                </div>
                <Button variant="eco">Add reward</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Current Rewards</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rewards.map((reward) => (
                  <div key={reward.title} className="flex justify-between p-3 border rounded-lg">
                    <span>{reward.title}</span>
                    <span className="font-bold">{reward.points} pts</span>
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
