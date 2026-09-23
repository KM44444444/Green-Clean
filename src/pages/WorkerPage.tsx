import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/UserContext";
import { getReports, updateReportStatus, osmLink, timeAgo, WasteReport } from "@/lib/store";

const workerGuidelines = [
  "Wear safety gloves and masks during waste collection.",
  "Dispose of hazardous waste separately.",
  "Report any broken or overflowing bins immediately.",
  "Maintain cleanliness while on duty.",
  "Follow the assigned routes strictly.",
];

export default function WorkerPage() {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const [reports, setReports] = useState<WasteReport[]>([]);

  const reload = () => setReports(getReports());
  useEffect(() => { reload(); }, []);

  if (!currentUser) return null;

  if (!currentUser.verified) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-2">Your account is awaiting admin approval</h1>
        <p className="text-muted-foreground">
          Worker accounts are verified manually. Once an admin approves you from the Admin Panel, your assigned tasks will appear here.
        </p>
      </div>
    );
  }

  const cityReports = reports.filter((r) => r.city === currentUser.city && r.status !== "rejected");
  const openTasks = cityReports.filter((r) => r.status === "reported");
  const myTasks = cityReports.filter((r) => r.status === "assigned" && r.assignedWorkerId === currentUser.id);
  const completedByMe = cityReports.filter((r) => r.status === "cleaned" && r.assignedWorkerId === currentUser.id);

  const claimTask = (report: WasteReport) => {
    updateReportStatus(report.id, "assigned", { id: currentUser.id, name: currentUser.name });
    toast({ title: "Task claimed", description: `You're now assigned to report #${report.id}.` });
    reload();
  };

  const markCleaned = (report: WasteReport) => {
    updateReportStatus(report.id, "cleaned", { id: currentUser.id, name: currentUser.name });
    toast({ title: "Marked as cleaned", description: `Report #${report.id} closed. Great work!` });
    reload();
  };

  const TaskCard = ({ report, action }: { report: WasteReport; action?: React.ReactNode }) => (
    <div className="p-4 border border-gray-200 rounded shadow-sm bg-green-50 flex items-center justify-between gap-4">
      <div>
        <p className="font-medium">#{report.id} — {report.category === "oldHousehold" ? report.itemType : "Street waste"}</p>
        <a href={osmLink(report.lat, report.lng)} target="_blank" rel="noreferrer" className="text-sm underline text-accent">
          View location
        </a>
        <p className="text-xs text-gray-600 mt-1">{report.description || "No description provided."}</p>
        <p className="text-xs text-gray-500">{timeAgo(report.createdAt)}</p>
      </div>
      {action}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      <section className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser.name}</h1>
        <p className="text-gray-700 mb-1">Assigned City: <span className="font-medium">{currentUser.city}</span></p>
        <p className="text-green-600 font-semibold">Verified Worker</p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Open Tasks in {currentUser.city}</h2>
        {openTasks.length === 0 ? (
          <p className="text-gray-600">No open reports in your city right now.</p>
        ) : (
          <div className="space-y-3">
            {openTasks.map((r) => (
              <TaskCard
                key={r.id}
                report={r}
                action={<Button size="sm" onClick={() => claimTask(r)}>Take this task</Button>}
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">My Assigned Tasks</h2>
        {myTasks.length === 0 ? (
          <p className="text-gray-600">No tasks currently assigned to you.</p>
        ) : (
          <div className="space-y-3">
            {myTasks.map((r) => (
              <TaskCard
                key={r.id}
                report={r}
                action={<Button size="sm" variant="eco" onClick={() => markCleaned(r)}>Mark cleaned</Button>}
              />
            ))}
          </div>
        )}
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
        <h2 className="text-2xl font-semibold mb-4">My Stats</h2>
        <p className="text-gray-700 mb-2">Total tasks completed: {completedByMe.length}</p>
        <p className="text-gray-700 mb-2">Open tasks in your city: {openTasks.length}</p>
        <p className="text-gray-700">Currently assigned to you: {myTasks.length}</p>
      </section>

      <Footer />
    </div>
  );
}
