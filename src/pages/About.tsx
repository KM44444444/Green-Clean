import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Recycle,
  Heart,
  AlertTriangle,
  BookOpen,
  Shield,
  Droplets,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const [showFullArticle, setShowFullArticle] = useState(false);

  const wasteTypes = [
    {
      icon: <Recycle className="h-6 w-6" />,
      title: "Organic Waste",
      description: "Kitchen scraps, food waste, garden trimmings",
      disposal: "Compost bins, organic waste collection",
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Hazardous Waste",
      description: "Batteries, chemicals, paint, electronics",
      disposal: "Special collection centers, never in regular bins",
    },
    {
      icon: <Recycle className="h-6 w-6" />,
      title: "Recyclable Materials",
      description: "Paper, cardboard, plastic, glass, metal",
      disposal: "Recycling bins, clean and sorted",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Medical Waste",
      description: "Medicines, syringes, bandages",
      disposal: "Pharmacy take-back programs, medical facilities",
    },
  ];

  const diseases = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Cholera",
      description: "Spread through contaminated water near waste dumps",
      prevention: "Proper waste disposal, clean water sources",
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Dengue & Malaria",
      description: "Mosquitos breed in stagnant water around waste",
      prevention: "Remove standing water, cover waste containers",
    },
    {
      icon: <Droplets className="h-6 w-6" />,
      title: "Diarrheal Diseases",
      description: "Bacteria from waste contaminate food and water",
      prevention: "Wash hands, proper sanitation, covered food",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Respiratory Issues",
      description: "Toxic fumes from burning waste affect lungs",
      prevention: "No waste burning, proper ventilation",
    },
  ];

  const consequences = [
    {
      icon: <Droplets className="h-6 w-6" />,
      title: "Water Contamination",
      description:
        "Waste leachate pollutes groundwater and surface water, making it unsafe for drinking and irrigation.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Public Health Crisis",
      description:
        "Accumulated waste becomes breeding ground for disease vectors, spreading infections rapidly.",
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Environmental Degradation",
      description:
        "Soil contamination, air pollution, and ecosystem disruption affect entire communities.",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Economic Impact",
      description:
        "Healthcare costs rise, property values drop, and tourism decreases in polluted areas.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navbar />

      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Learn About
              <span className="text-accent block">Waste Management</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Education is the first step toward a cleaner, healthier community.
              Learn how proper waste management protects our health and environment.
            </p>
          </div>

          {/* Waste Types Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Types of Waste & Proper Disposal
              </h2>
              <p className="text-lg text-muted-foreground">
                Understanding waste categories helps ensure proper disposal and recycling
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wasteTypes.map((type, index) => (
                <Card
                  key={index}
                  className="border-accent/20 hover:border-accent/40 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="text-accent">{type.icon}</div>
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">
                      {type.description}
                    </CardDescription>
                    <p className="text-sm font-medium text-accent">
                      Disposal: {type.disposal}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Disease Prevention Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Disease Prevention Through Waste Management
              </h2>
              <p className="text-lg text-muted-foreground">
                Poor waste management can lead to serious health issues. Here's how to protect yourself and your community
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {diseases.map((disease, index) => (
                <Card
                  key={index}
                  className="border-destructive/20 hover:border-destructive/40 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="text-destructive">{disease.icon}</div>
                      <CardTitle className="text-lg">{disease.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">
                      {disease.description}
                    </CardDescription>
                    <p className="text-sm text-primary">
                      Prevention: {disease.prevention}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Consequences Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Consequences of Poor Waste Management
              </h2>
              <p className="text-lg text-muted-foreground">
                Understanding the impact helps motivate proper waste disposal practices
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {consequences.map((consequence, index) => (
                <Card
                  key={index}
                  className="border-orange-500/20 hover:border-orange-500/40 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="text-orange-500">{consequence.icon}</div>
                      <CardTitle className="text-xl">{consequence.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {consequence.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-accent/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Take Action Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Knowledge is power. Use what you've learned to make a difference in your
              community by reporting waste and practicing proper disposal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/report"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-8"
              >
                Report Waste Now
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
              >
                View Dashboard
              </a>
            </div>
          </section>

          {/* Article Section */}
          <section className="mb-20">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-green-100 border-green-400 border rounded-lg shadow-lg p-6">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-green-900">
                    Recycling Process & Waste Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-800 mb-4">
                    Recycling is the process of converting waste into reusable
                    material. Understanding what types of waste can be recycled and how the recycling process works is essential for effective waste management.
                  </p>

                  {!showFullArticle ? (
                    <>
                      <p className="text-green-700 mb-4">
                        Recycling starts with separation of waste into categories such as plastic, paper, metal, and glass. These materials are then cleaned and processed at recycling plants into raw materials that companies can use to manufacture new products.
                      </p>
                      <button
                        onClick={() => setShowFullArticle(true)}
                        className="text-green-900 font-semibold hover:underline"
                      >
                        Read More
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-green-700 mb-4">
                        Recycling starts with separation of waste into categories such as plastic, paper, metal, and glass. These materials are then cleaned and processed at recycling plants into raw materials that companies can use to manufacture new products. Plastics are sorted by resin type and melted to form pellets. Paper is pulped and remade. Metals are melted and reforged. Glass is crushed and melted to form new glass containers. This circular process reduces landfills and conserves natural resources, promoting a sustainable environment.
                      </p>
                      <button
                        onClick={() => setShowFullArticle(false)}
                        className="text-green-900 font-semibold hover:underline"
                      >
                        Read Less
                      </button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
