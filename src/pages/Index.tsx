import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatsCounter from "@/components/StatsCounter";
import DonateItems from "@/pages/DonateItems";

import { 
  Camera, 
  MapPin, 
  Coins, 
  Recycle, 
  Users, 
  Trash2, 
  AlertTriangle, 
  Building, 
  Brain, 
  Bell,
  BarChart3,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-eco.jpg";

const Index = () => {
  const problems = [
    {
      icon: Trash2,
      title: "Overflowing Garbage",
      description: "Public spaces filled with unmanaged waste"
    },
    {
      icon: AlertTriangle,
      title: "Poor Segregation",
      description: "Improper waste categorization and disposal"
    },
    {
      icon: Building,
      title: "Overburdened Systems",
      description: "Municipal waste management systems at capacity"
    },
    {
      icon: Users,
      title: "Lack of Awareness",
      description: "Citizens unaware of proper waste disposal methods"
    }
  ];

  const solutions = [
    {
      icon: Camera,
      title: "Geo-tagged Reporting",
      description: "Photo capture with precise location tracking"
    },
    {
      icon: Bell,
      title: "Worker Notifications",
      description: "Location-based task assignment for cleanup crews"
    },
    {
      icon: Coins,
      title: "Green Wallet",
      description: "Earn points for reports, redeem eco-rewards"
    },
    {
      icon: Recycle,
      title: "Smart Categorization",
      description: "AI-powered waste type detection and sorting"
    },
    {
      icon: BarChart3,
      title: "Dashboard & Analytics",
      description: "Real-time insights and waste management heatmaps"
    },
    {
      icon: Globe,
      title: "Community Impact",
      description: "Track collective environmental improvements"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Green & Clean
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Smart Web-Based Waste Reporting & Reward System
          </p>
          <Link to="/report">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Report Waste Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-card p-8 rounded-xl shadow-card">
              <StatsCounter end={15420} suffix="+" />
              <p className="text-muted-foreground mt-2">Waste Reports Collected</p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-card">
              <StatsCounter end={2847} suffix="+" />
              <p className="text-muted-foreground mt-2">Active Users</p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-card">
              <StatsCounter end={98750} suffix="+" />
              <p className="text-muted-foreground mt-2">Green Points Redeemed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Problem We're Solving
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Waste management challenges that plague our communities today
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem, index) => (
              <Card key={index} className="bg-gradient-card shadow-card hover:shadow-eco transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <problem.icon className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {problem.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Smart Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Innovative technology to revolutionize waste management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <Card key={index} className="bg-gradient-card shadow-card hover:shadow-eco transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <solution.icon className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {solution.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {solution.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of citizens making their communities cleaner and greener
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/report">
              <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90">
                Start Reporting
              </Button>
            </Link>
            <Link to="/wallet">
              <Button variant="hero" size="lg">
                View Rewards
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="hero" size="lg" className="bg-green-600 text-white hover:bg-green-700">
                Donate Items
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
