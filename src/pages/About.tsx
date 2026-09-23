import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle, Heart, AlertTriangle, BookOpen, Shield, Droplets } from "lucide-react";
import Footer from "@/components/Footer";

const About = () => {
  const [showFullArticle, setShowFullArticle] = useState(false);

  const wasteTypes = [
    { icon: <Recycle className="h-6 w-6" />, title: "Organic Waste", description: "Kitchen scraps, food waste, garden trimmings", disposal: "Compost bins, organic waste collection" },
    { icon: <AlertTriangle className="h-6 w-6" />, title: "Hazardous Waste", description: "Batteries, chemicals, paint, electronics", disposal: "Special collection centers, never in regular bins" },
    { icon: <Recycle className="h-6 w-6" />, title: "Recyclable Materials", description: "Paper, cardboard, plastic, glass, metal", disposal: "Recycling bins, clean and sorted" },
    { icon: <Shield className="h-6 w-6" />, title: "Medical Waste", description: "Medicines, syringes, bandages", disposal: "Pharmacy take-back programs, medical facilities" },
  ];

  const diseases = [
    { icon: <Heart className="h-6 w-6" />, title: "Cholera", description: "Spread through contaminated water near waste dumps", prevention: "Proper waste disposal, clean water sources" },
    { icon: <AlertTriangle className="h-6 w-6" />, title: "Dengue & Malaria", description: "Mosquitos breed in stagnant water around waste", prevention: "Remove standing water, cover waste containers" },
    { icon: <Droplets className="h-6 w-6" />, title: "Diarrheal Diseases", description: "Bacteria from waste contaminate food and water", prevention: "Wash hands, proper sanitation, covered food" },
    { icon: <Shield className="h-6 w-6" />, title: "Respiratory Issues", description: "Toxic fumes from burning waste affect lungs", prevention: "No waste burning, proper ventilation" },
  ];

  const consequences = [
    { icon: <Droplets className="h-6 w-6" />, title: "Water Contamination", description: "Waste leachate pollutes groundwater and surface water, making it unsafe for drinking and irrigation." },
    { icon: <Heart className="h-6 w-6" />, title: "Public Health Crisis", description: "Accumulated waste becomes breeding ground for disease vectors, spreading infections rapidly." },
    { icon: <AlertTriangle className="h-6 w-6" />, title: "Environmental Degradation", description: "Soil contamination, air pollution, and ecosystem disruption affect entire communities." },
    { icon: <BookOpen className="h-6 w-6" />, title: "Economic Impact", description: "Healthcare costs rise, property values drop, and tourism decreases in polluted areas." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Types of Waste & Proper Disposal</h2>
              <p className="text-lg text-muted-foreground">Understanding waste categories helps ensure proper disposal and recycling</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wasteTypes.map((type, index) => (
                <Card key={index} className="border-accent/20 hover:border-accent/40 transition-colors">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="text-accent">{type.icon}</div>
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">{type.description}</CardDescription>
                    <p className="text-sm font-medium text-accent">Disposal: {type.disposal}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Disease Prevention Through Waste Management</h2>
              <p className="text-lg text-muted-foreground">Poor waste management can lead to serious health issues. Here is how you can protect yourself and your community.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {diseases.map((disease, index) => (
                <Card key={index} className="border-destructive/20 hover:border-destructive/40 transition-colors">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="text-destructive">{disease.icon}</div>
                      <CardTitle className="text-lg">{disease.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">{disease.description}</CardDescription>
                    <p className="text-sm text-primary">Prevention: {disease.prevention}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Consequences of Poor Waste Management</h2>
              <p className="text-lg text-muted-foreground">Understanding the impact helps motivate proper disposal practices</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {consequences.map((consequence, index) => (
                <Card key={index} className="border-orange-500/20 hover:border-orange-500/40 transition-colors">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="text-orange-500">{consequence.icon}</div>
                      <CardTitle className="text-xl">{consequence.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{consequence.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setShowFullArticle((prev) => !prev)}
              className="px-6 py-3 rounded-full bg-accent text-white font-semibold"
            >
              {showFullArticle ? "Hide full article" : "Read the full article"}
            </button>
          </div>

          {showFullArticle && (
            <div className="mt-10 bg-card p-8 rounded-xl border">
              <p className="text-muted-foreground leading-7">
                Waste is more than an eyesore; it is a public health and environmental challenge. When organic waste decomposes in open spaces, it creates foul odors, attracts pests, and can contaminate water sources. Toxic and hazardous items, if not separated correctly, can damage soil and groundwater. Communities that manage waste well reduce disease, improve public health, and create cleaner urban spaces that support growth and wellbeing.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
