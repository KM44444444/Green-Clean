import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import StatsCounter from "@/components/StatsCounter";
import { BarChart3, Users, MapPin, Recycle, TrendingUp, Clock, CheckCircle, AlertTriangle, Trash2 } from "lucide-react";

const cityData = [
  { city: "Mumbai", reports: 2450, status: "High" },
  { city: "Delhi", reports: 1890, status: "Medium" },
  { city: "Bangalore", reports: 1650, status: "Medium" },
  { city: "Chennai", reports: 1320, status: "Low" },
  { city: "Pune", reports: 980, status: "Low" },
];

const wasteCategories = [
  { type: "Plastic", percentage: 35, count: 5400, color: "bg-destructive" },
  { type: "Organic", percentage: 28, count: 4320, color: "bg-success" },
  { type: "Paper", percentage: 18, count: 2780, color: "bg-warning" },
  { type: "E-waste", percentage: 12, count: 1850, color: "bg-secondary" },
  { type: "Metal", percentage: 7, count: 1080, color: "bg-accent" },
];

const recentReports = [
  { id: "WR001", location: "MG Road, Bangalore", status: "Completed", time: "2 hours ago" },
  { id: "WR002", location: "Connaught Place, Delhi", status: "In Progress", time: "4 hours ago" },
  { id: "WR003", location: "Marine Drive, Mumbai", status: "Pending", time: "6 hours ago" },
  { id: "WR004", location: "Brigade Road, Bangalore", status: "Completed", time: "8 hours ago" },
];

const getStatusColor = (status: string) => {
  if (status === "Completed") return "bg-success text-success-foreground";
  if (status === "In Progress") return "bg-warning text-warning-foreground";
  if (status === "Pending") return "bg-destructive text-destructive-foreground";
  return "bg-muted text-muted-foreground";
};

const getStatusIcon = (status: string) => {
  if (status === "Completed") return <CheckCircle className="h-4 w-4" />;
  if (status === "In Progress") return <Clock className="h-4 w-4" />;
  if (status === "Pending") return <AlertTriangle className="h-4 w-4" />;
  return <Clock className="h-4 w-4" />;
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Dashboard</h1>
            <p className="text-xl text-muted-foreground">Real-time waste management insights and analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <Trash2 className="h-12 w-12 text-accent mx-auto mb-4" />
                <StatsCounter end={15420} suffix="+" />
                <p className="text-muted-foreground mt-2">Total Reports</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-success mx-auto mb-4" />
                <StatsCounter end={2847} suffix="+" />
                <p className="text-muted-foreground mt-2">Active Users</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <StatsCounter end={12850} suffix="+" />
                <p className="text-muted-foreground mt-2">Completed Tasks</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-warning mx-auto mb-4" />
                <span className="text-3xl font-bold text-accent">83%</span>
                <p className="text-muted-foreground mt-2">Success Rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span>Reports by City</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cityData.map((city) => (
                    <div key={city.city} className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{city.city}</p>
                        <p className="text-sm text-muted-foreground">{city.reports} reports</p>
                      </div>
                      <Badge className={city.status === "High" ? "bg-destructive text-destructive-foreground" : city.status === "Medium" ? "bg-warning text-warning-foreground" : "bg-success text-success-foreground"}>
                        {city.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Recycle className="h-5 w-5 text-accent" />
                  <span>Waste Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wasteCategories.map((category) => (
                    <div key={category.type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">{category.type}</span>
                        <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className={`h-2 rounded-full ${category.color}`} style={{ width: `${category.percentage}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground">{category.count} reports</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  <span>Recent Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{report.id}</p>
                        <p className="text-sm text-muted-foreground">{report.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        <span className="text-xs text-muted-foreground">{report.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Field Operations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled pickups</span>
                    <span className="font-semibold">84</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">On-ground teams</span>
                    <span className="font-semibold">26</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. completion</span>
                    <span className="font-semibold">4.6h</span>
                  </div>
                </div>
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
