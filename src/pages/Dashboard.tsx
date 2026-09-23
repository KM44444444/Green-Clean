import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import StatsCounter from "@/components/StatsCounter";
import { useUser } from "@/UserContext";
import { getReports, getUsers, getDonations, osmLink, timeAgo, WasteReport } from "@/lib/store";
import {
  BarChart3,
  Users,
  MapPin,
  Recycle,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trash2,
} from "lucide-react";

const STATUS_LABEL: Record<WasteReport["status"], string> = {
  reported: "Pending",
  assigned: "In Progress",
  cleaned: "Completed",
  rejected: "Rejected",
};

const Dashboard = () => {
  const { currentUser } = useUser();
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [donationCount, setDonationCount] = useState(0);

  useEffect(() => {
    setReports(getReports());
    setUserCount(getUsers().filter((u) => u.role === "user").length);
    setDonationCount(getDonations().length);
  }, []);

  const myReports = useMemo(
    () => (currentUser ? reports.filter((r) => r.userId === currentUser.id) : []),
    [reports, currentUser]
  );

  const cityData = useMemo(() => {
    const byCity: Record<string, number> = {};
    reports.forEach((r) => { byCity[r.city] = (byCity[r.city] || 0) + 1; });
    return Object.entries(byCity)
      .map(([city, count]) => ({
        city,
        reports: count,
        status: count >= 5 ? "High" : count >= 2 ? "Medium" : "Low",
      }))
      .sort((a, b) => b.reports - a.reports);
  }, [reports]);

  const categoryData = useMemo(() => {
    const byCat: Record<string, number> = {};
    reports.forEach((r) => {
      const key = r.category === "oldHousehold" ? (r.itemType || "Old Household") : "Street Waste";
      byCat[key] = (byCat[key] || 0) + 1;
    });
    const total = reports.length || 1;
    const colors = ["bg-destructive", "bg-success", "bg-warning", "bg-secondary", "bg-accent"];
    return Object.entries(byCat).map(([type, count], i) => ({
      type,
      count,
      percentage: Math.round((count / total) * 100),
      color: colors[i % colors.length],
    }));
  }, [reports]);

  const completedCount = reports.filter((r) => r.status === "cleaned").length;
  const successRate = reports.length ? Math.round((completedCount / reports.length) * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-success text-success-foreground";
      case "In Progress": return "bg-warning text-warning-foreground";
      case "Pending": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="h-4 w-4" />;
      case "In Progress": return <Clock className="h-4 w-4" />;
      case "Pending": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Real-time waste management insights, built from actual reports on this device
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <Trash2 className="h-12 w-12 text-accent mx-auto mb-4" />
                <StatsCounter end={reports.length} />
                <p className="text-muted-foreground mt-2">Total Reports</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-success mx-auto mb-4" />
                <StatsCounter end={userCount} />
                <p className="text-muted-foreground mt-2">Registered Citizens</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <StatsCounter end={completedCount} />
                <p className="text-muted-foreground mt-2">Completed Cleanups</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-warning mx-auto mb-4" />
                <span className="text-3xl font-bold text-accent">{successRate}%</span>
                <p className="text-muted-foreground mt-2">Success Rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* City-wise Reports */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span>Reports by City</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cityData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reports yet — be the first to report waste in your city.</p>
                ) : (
                  <div className="space-y-4">
                    {cityData.map((city) => (
                      <div key={city.city} className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{city.city}</p>
                          <p className="text-sm text-muted-foreground">{city.reports} reports</p>
                        </div>
                        <Badge className={
                          city.status === "High" ? "bg-destructive text-destructive-foreground" :
                          city.status === "Medium" ? "bg-warning text-warning-foreground" :
                          "bg-success text-success-foreground"
                        }>
                          {city.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Waste Categories */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Recycle className="h-5 w-5 text-accent" />
                  <span>Waste Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categoryData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No category data yet.</p>
                ) : (
                  <div className="space-y-4">
                    {categoryData.map((category) => (
                      <div key={category.type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground capitalize">{category.type}</span>
                          <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className={`h-2 rounded-full ${category.color}`} style={{ width: `${category.percentage}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground">{category.count} reports</p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4">{donationCount} items listed for donation</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Reports */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  <span>Recent Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nothing reported yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reports.slice(0, 6).map((report) => {
                      const label = STATUS_LABEL[report.status];
                      return (
                        <div key={report.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(label)}
                            <div>
                              <p className="font-medium text-foreground">#{report.id}</p>
                              <a href={osmLink(report.lat, report.lng)} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground underline">
                                {report.city}
                              </a>
                              <p className="text-xs text-muted-foreground">{timeAgo(report.createdAt)}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(label)}>{label}</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My reports (if logged in) */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-accent" />
                  <span>My Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!currentUser ? (
                  <p className="text-sm text-muted-foreground">Log in to see your own report history.</p>
                ) : myReports.length === 0 ? (
                  <p className="text-sm text-muted-foreground">You haven't reported anything yet.</p>
                ) : (
                  <div className="space-y-4">
                    {myReports.slice(0, 6).map((report) => {
                      const label = STATUS_LABEL[report.status];
                      return (
                        <div key={report.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">#{report.id}</p>
                            <p className="text-sm text-muted-foreground">{report.points} points • {timeAgo(report.createdAt)}</p>
                          </div>
                          <Badge className={getStatusColor(label)}>{label}</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
