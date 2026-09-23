import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/UserContext";
import { useToast } from "@/hooks/use-toast";

const states = [
  { name: "Uttar Pradesh", cities: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"] },
  { name: "Delhi", cities: ["New Delhi", "Dwarka", "Rohini", "Karol Bagh"] },
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedState, setSelectedState] = useState(states[0].name);
  const [selectedCity, setSelectedCity] = useState(states[0].cities[0]);
  const navigate = useNavigate();
  const { login, signup } = useUser();
  const { toast } = useToast();

  const cities = states.find((state) => state.name === selectedState)?.cities ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const result = await login(email, password);
      if (!result.ok) {
        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      if (result.user.role === "admin") {
        navigate("/admin");
      } else if (result.user.role === "worker") {
        navigate("/worker");
      } else {
        navigate("/dashboard");
      }
      return;
    }

    const result = await signup({
      name,
      email,
      password,
      role: "user",
      state: selectedState,
      city: selectedCity,
    });

    if (!result.ok) {
      toast({
        title: "Sign up failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    if (result.user.role === "admin") {
      navigate("/admin");
    } else if (result.user.role === "worker") {
      navigate("/worker");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center font-sans p-8">
      <h1 className="text-3xl font-bold text-green-900 mb-2">Green & Clean</h1>
      <p className="text-sm text-muted-foreground mb-8">Demo admin login: admin@greenclean.in / admin123</p>

      <div className="flex space-x-4 mb-6">
        <button type="button" onClick={() => setIsLogin(true)} className={`px-6 py-2 rounded-full font-semibold ${isLogin ? "bg-green-700 text-white shadow-lg" : "bg-white text-green-700 border border-green-700"}`}>
          Login
        </button>
        <button type="button" onClick={() => setIsLogin(false)} className={`px-6 py-2 rounded-full font-semibold ${!isLogin ? "bg-green-700 text-white shadow-lg" : "bg-white text-green-700 border border-green-700"}`}>
          Sign up
        </button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Log in to your account" : "Create an account"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            </div>

            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="state">State</Label>
                  <select id="state" value={selectedState} onChange={(e) => { const next = e.target.value; setSelectedState(next); const nextState = states.find((s) => s.name === next); if (nextState) setSelectedCity(nextState.cities[0]); }} className="w-full p-2 mt-1 border rounded">
                    {states.map((state) => (
                      <option key={state.name} value={state.name}>{state.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <select id="city" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full p-2 mt-1 border rounded">
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <Button type="submit" variant="eco" className="w-full">
              {isLogin ? "Log in" : "Sign up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
