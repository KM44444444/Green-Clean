import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatsCounter from "@/components/StatsCounter";
import { 
  Coins, 
  Gift, 
  Leaf, 
  Ticket, 
  ShoppingBag, 
  TreePine,
  Coffee,
  Bus,
  CheckCircle
} from "lucide-react";


const Wallet = () => {
  const [userPoints, setUserPoints] = useState(247); // Mock user points
  const { toast } = useToast();

  const rewards = [
    {
      id: 1,
      title: "Plant a Tree",
      description: "Sponsor a tree plantation in your city",
      points: 100,
      icon: TreePine,
      category: "Environment",
      available: true
    },
    {
      id: 2,
      title: "Eco-friendly Bag",
      description: "Reusable cotton shopping bag",
      points: 50,
      icon: ShoppingBag,
      category: "Products",
      available: true
    },
    {
      id: 3,
      title: "Coffee Shop Voucher",
      description: "₹200 voucher for sustainable cafes",
      points: 150,
      icon: Coffee,
      category: "Food",
      available: true
    },
    {
      id: 4,
      title: "Public Transport Pass",
      description: "1-day free metro/bus pass",
      points: 80,
      icon: Bus,
      category: "Transport",
      available: true
    },
    {
      id: 5,
      title: "Shopping of Daily Needs",
      description: "Essential household and daily items",
      points: 100,
      icon: ShoppingBag,
      category: "Products",
      available: true
    },
    {
      id: 6,
      title: "Order Food Discount",
      description: "Discount coupon for food delivery",
      points: 300,
      icon: Ticket,
      category: "Food",
      available: true
    }
  ];

  const [recentTransactions, setRecentTransactions] = useState([
    { date: "2025-01-15", description: "Waste Report #WR001", points: +5, type: "earned" },
    { date: "2025-01-14", description: "Waste Report #WR002", points: +5, type: "earned" },
    { date: "2025-01-13", description: "Redeemed: Eco Bag", points: -50, type: "redeemed" },
    { date: "2025-01-12", description: "Waste Report #WR003", points: +5, type: "earned" },
    { date: "2025-01-11", description: "Waste Report #WR004", points: +5, type: "earned" },
  ]);

  const handleRedeem = (reward: typeof rewards[0]) => {
    if (userPoints >= reward.points) {
      toast({
        title: "Reward redeemed successfully!",
        description: `You've redeemed ${reward.title} for ${reward.points} points.`,
      });
      // Deduct points and add redeemed transaction
      setUserPoints(prev => prev - reward.points);
      setRecentTransactions(prev => [
        {
          date: new Date().toISOString().slice(0, 10),
          description: `Redeemed: ${reward.title}`,
          points: -reward.points,
          type: "redeemed"
        },
        ...prev
      ]);
    } else {
      toast({
        title: "Insufficient points",
        description: `You need ${reward.points - userPoints} more points to redeem this reward.`,
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Environment: "bg-accent",
      Products: "bg-secondary",
      Food: "bg-warning",
      Transport: "bg-primary",
      Gardening: "bg-success",
      Entertainment: "bg-destructive"
    };
    return colors[category] || "bg-muted";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Green Wallet
            </h1>
            <p className="text-xl text-muted-foreground">
              Earn points for reporting waste and redeem eco-friendly rewards
            </p>
          </div>

          {/* Points Balance */}
          <Card className="bg-gradient-hero text-white mb-8 shadow-eco">
            <CardContent className="p-8 text-center">
              <Coins className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-2xl font-semibold mb-2">Your Green Points</h2>
              <div className="text-5xl font-bold mb-4">
                <StatsCounter end={userPoints} />
              </div>
              <p className="text-white/80">
                Keep reporting waste to earn more points!
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rewards Section */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Gift className="h-6 w-6 mr-2 text-accent" />
                Available Rewards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((reward) => (
                  <Card key={reward.id} className="bg-gradient-card shadow-card hover:shadow-eco transition-all duration-300 transform hover:scale-105">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <reward.icon className="h-8 w-8 text-accent" />
                        <Badge className={`${getCategoryColor(reward.category)} text-white`}>
                          {reward.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">
                        {reward.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Coins className="h-4 w-4 text-accent" />
                          <span className="font-semibold text-accent">{reward.points}</span>
                        </div>
                        <Button
                          variant={userPoints >= reward.points ? "accent" : "outline"}
                          size="sm"
                          onClick={() => handleRedeem(reward)}
                          disabled={userPoints < reward.points}
                        >
                          {userPoints >= reward.points ? "Redeem" : "Not enough"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Recent Activity
              </h2>
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <div className="flex items-center space-x-3">
                          {transaction.type === "earned" ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <Gift className="h-4 w-4 text-accent" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {transaction.date}
                            </p>
                          </div>
                        </div>
                        <span className={`font-semibold ${
                          transaction.type === "earned" ? "text-success" : "text-destructive"
                        }`}>
                          {transaction.points > 0 ? "+" : ""}{transaction.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Points Info */}
              <Card className="bg-gradient-card shadow-card mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">How to Earn Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-success/20 p-2 rounded-full">
                        <Coins className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Report Waste</p>
                        <p className="text-xs text-muted-foreground">+5 points per report</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-accent/20 p-2 rounded-full">
                        <Leaf className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Monthly Bonus</p>
                        <p className="text-xs text-muted-foreground">+50 points for active users</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wallet;
