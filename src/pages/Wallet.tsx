import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Gift, ShoppingBag, TreePine, Coffee, Bus, Ticket, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { useUser, API_BASE } from "@/UserContext";

const iconMap: Record<string, any> = {
  "TreePine": TreePine,
  "ShoppingBag": ShoppingBag,
  "Coffee": Coffee,
  "Bus": Bus,
  "Ticket": Ticket,
};

const Wallet = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [rewards, setRewards] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { token } = useUser();

  const fetchData = async () => {
    try {
      if (!token) return;
      const [walletRes, rewardsRes] = await Promise.all([
        fetch(`${API_BASE}/api/wallet`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/wallet/rewards`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const walletData = await walletRes.json();
      const rewardsData = await rewardsRes.json();
      
      setUserPoints(walletData.balance || 0);
      setTransactions(walletData.transactions || []);
      setRewards(rewardsData.rewards || []);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load wallet data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleRedeem = async (reward: any) => {
    if (userPoints < reward.cost_points) {
      toast({ title: "Insufficient points", description: `You need ${reward.cost_points - userPoints} more points.`, variant: "destructive" });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/wallet/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rewardId: reward.id })
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast({ title: "Error", description: data.error || "Failed to redeem", variant: "destructive" });
        return;
      }
      
      toast({ title: "Reward redeemed!", description: `You've redeemed ${data.redeemed}.` });
      fetchData(); // Refresh wallet data
    } catch (err) {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-green-600" /></div>;
  }

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
                  const Icon = iconMap[reward.icon_name] || Gift;
                  return (
                    <Card key={reward.id} className="bg-gradient-card shadow-card">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-accent" />
                            <h3 className="font-semibold">{reward.name}</h3>
                          </div>
                          <span className="text-sm font-medium text-accent">{reward.cost_points} pts</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                        <Button variant="eco" className="w-full" onClick={() => handleRedeem(reward)} disabled={userPoints < reward.cost_points}>
                          {userPoints >= reward.cost_points ? "Redeem" : "Need more points"}
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
                {transactions.length === 0 ? <p className="text-muted-foreground">No recent activity.</p> : null}
                {transactions.map((entry) => (
                  <Card key={entry.id} className="bg-card">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{entry.description}</p>
                        <p className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={entry.points > 0 ? "text-success font-bold" : "text-destructive font-bold"}>
                        {entry.points > 0 ? `+${entry.points}` : entry.points}
                      </span>
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
