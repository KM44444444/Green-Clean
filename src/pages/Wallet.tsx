import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Gift, ShoppingBag, TreePine, Coffee, Bus, Ticket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

const rewards = [
  { id: 1, title: "Plant a Tree", description: "Sponsor a tree plantation in your city", points: 100, icon: TreePine, category: "Environment", available: true },
  { id: 2, title: "Eco-friendly Bag", description: "Reusable cotton shopping bag", points: 50, icon: ShoppingBag, category: "Products", available: true },
  { id: 3, title: "Coffee Shop Voucher", description: "₹200 voucher for sustainable cafes", points: 150, icon: Coffee, category: "Food", available: true },
  { id: 4, title: "Public Transport Pass", description: "1-day free metro/bus pass", points: 80, icon: Bus, category: "Transport", available: true },
  { id: 5, title: "Shopping of Daily Needs", description: "Essential household and daily items", points: 100, icon: ShoppingBag, category: "Products", available: true },
  { id: 6, title: "Order Food Discount", description: "Discount coupon for food delivery", points: 300, icon: Ticket, category: "Food", available: true },
];

const Wallet = () => {
  const [userPoints, setUserPoints] = useState(247);
  const { toast } = useToast();

  const handleRedeem = (reward: typeof rewards[number]) => {
    if (userPoints >= reward.points) {
      setUserPoints((prev) => prev - reward.points);
      toast({ title: "Reward redeemed successfully!", description: `You've redeemed ${reward.title} for ${reward.points} points.` });
    } else {
      toast({ title: "Insufficient points", description: `You need ${reward.points - userPoints} more points to redeem this reward.`, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Green Wallet</h1>
            <p className="text-xl text-muted-foreground">Earn points for reporting waste and redeem eco-friendly rewards</p>
          </div>

          <Card className="bg-gradient-hero text-white mb-8 shadow-eco">
            <CardContent className="p-8 text-center">
              <Coins className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
              <h2 className="text-2xl font-semibold mb-2">Your Green Points</h2>
              <div className="text-5xl font-bold mb-4">{userPoints}</div>
              <p className="text-white/80">Keep reporting waste to earn more points!</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center"><Gift className="h-6 w-6 mr-2 text-accent" />Available Rewards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((reward) => {
                  const Icon = reward.icon;
                  return (
                    <Card key={reward.id} className="bg-gradient-card shadow-card">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-accent" />
                            <h3 className="font-semibold">{reward.title}</h3>
                          </div>
                          <span className="text-sm font-medium text-accent">{reward.points} pts</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                        <Button variant="eco" className="w-full" onClick={() => handleRedeem(reward)} disabled={userPoints < reward.points}>
                          {userPoints >= reward.points ? "Redeem" : "Need more points"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
              <div className="space-y-3">
                {[{ date: "2025-01-15", description: "Waste Report #WR001", points: "+5", type: "earned" }, { date: "2025-01-14", description: "Waste Report #WR002", points: "+5", type: "earned" }, { date: "2025-01-13", description: "Redeemed: Eco Bag", points: "-50", type: "redeemed" }].map((entry, index) => (
                  <Card key={index} className="bg-card">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{entry.description}</p>
                        <p className="text-xs text-muted-foreground">{entry.date}</p>
                      </div>
                      <span className={entry.type === "earned" ? "text-success font-bold" : "text-destructive font-bold"}>{entry.points}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wallet;
