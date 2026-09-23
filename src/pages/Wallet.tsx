import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import StatsCounter from "@/components/StatsCounter";
import { useUser } from "@/UserContext";
import { getTransactions, getRewards, redeemReward, timeAgo, Reward, Transaction } from "@/lib/store";
import { Link } from "react-router-dom";
import {
  Coins,
  Gift,
  Leaf,
  Ticket,
  ShoppingBag,
  TreePine,
  Coffee,
  Bus,
  CheckCircle,
} from "lucide-react";

const ICONS: Record<string, any> = {
  Environment: TreePine,
  Products: ShoppingBag,
  Food: Coffee,
  Transport: Bus,
  default: Gift,
};

const CATEGORY_COLOR: Record<string, string> = {
  Environment: "bg-accent",
  Products: "bg-secondary",
  Food: "bg-warning",
  Transport: "bg-primary",
};

const Wallet = () => {
  const { currentUser, refresh } = useUser();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  const reload = () => {
    setRewards(getRewards());
    if (currentUser) setTransactions(getTransactions(currentUser.id));
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const handleRedeem = (reward: Reward) => {
    if (!currentUser) return;
    const result = redeemReward(currentUser.id, reward);
    if (!result.ok) {
      toast({ title: "Insufficient points", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: "Reward redeemed successfully!", description: `You've redeemed ${reward.title} for ${reward.points} points.` });
    refresh();
    reload();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-2">Log in to see your Green Wallet</h2>
          <p className="text-muted-foreground mb-6">Points are tracked per account.</p>
          <Link to="/auth"><Button variant="eco">Log in / Sign up</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const userPoints = currentUser.points;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Green Wallet</h1>
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
              <p className="text-white/80">Keep reporting waste to earn more points!</p>
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
                {rewards.map((reward) => {
                  const Icon = ICONS[reward.category] || ICONS.default;
                  return (
                    <Card key={reward.id} className="bg-gradient-card shadow-card hover:shadow-eco transition-all duration-300 transform hover:scale-105">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <Icon className="h-8 w-8 text-accent" />
                          <Badge className={`${CATEGORY_COLOR[reward.category] || "bg-muted"} text-white`}>
                            {reward.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{reward.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4">{reward.description}</p>
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
                  );
                })}
              </div>
            </div>

            {/* Transaction History */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No activity yet — report waste to earn your first points.</p>
                  ) : (
                    <div className="space-y-4">
                      {transactions.slice(0, 8).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                          <div className="flex items-center space-x-3">
                            {transaction.type === "earned" || transaction.type === "bonus" ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <Gift className="h-4 w-4 text-accent" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">{timeAgo(transaction.createdAt)}</p>
                            </div>
                          </div>
                          <span className={`font-semibold ${transaction.points > 0 ? "text-success" : "text-destructive"}`}>
                            {transaction.points > 0 ? "+" : ""}{transaction.points}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

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
                        <p className="text-xs text-muted-foreground">+5 points per street-waste report (more for household items)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-accent/20 p-2 rounded-full">
                        <Leaf className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Admin Bonuses</p>
                        <p className="text-xs text-muted-foreground">Admins can award bonus points from the Admin Panel</p>
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
