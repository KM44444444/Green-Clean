<<<<<<< HEAD
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/UserContext";
import { Role } from "@/lib/store";
import { useEffect } from "react";

const states = [
  { name: "Uttar Pradesh", cities: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"] },
  { name: "Delhi", cities: ["New Delhi", "Dwarka", "Rohini", "Karol Bagh"] },
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<Role>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedState, setSelectedState] = useState(states[0].name);
  const [selectedCity, setSelectedCity] = useState(states[0].cities[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signup } = useUser();

  const cities = states.find((s) => s.name === selectedState)?.cities || [];

  const goToRoleHome = (r: Role, verified: boolean) => {
    if (r === "admin") navigate("/admin");
    else if (r === "worker") navigate(verified ? "/worker" : "/worker");
    else navigate("/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast({ title: "Welcome back!", description: "You're logged in." });
    goToRoleHome(result.user.role, result.user.verified);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    const result = await signup({ name, email, password, role, state: selectedState, city: selectedCity });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (role === "worker") {
      toast({
        title: "Account created",
        description: "Your worker account is pending admin approval before you can access tasks.",
      });
    } else {
      toast({ title: "Account created!", description: "Welcome to Green & Clean." });
    }
    goToRoleHome(role, role !== "worker");
=======
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const states = [
  { name: "Uttar Pradesh", cities: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"] },
  { name: "Delhi", cities: ["New Delhi", "Dwarka", "Rohini", "Karol Bagh"] }
];

export default function AuthPage() {
  const [isUser, setIsUser] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [selectedState, setSelectedState] = useState(states[0].name);
  const [selectedCity, setSelectedCity] = useState(states[0].cities[0]);
  const [loginState, setLoginState] = useState("");
  const [loginCity, setLoginCity] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const state = states.find(s => s.name === selectedState);
    if (state && !state.cities.includes(selectedCity)) {
      setSelectedCity(state.cities[0]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (isLogin) {
      // TODO: fetch user profile and then set loginState and loginCity
    }
  }, [isLogin]);

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: Add signup API call with selectedState and selectedCity
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Add login API call
>>>>>>> origin/main
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center font-sans p-8">
<<<<<<< HEAD
      <h1 className="text-3xl font-bold text-green-900 mb-2">Green & Clean</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Demo admin login: admin@greenclean.in / admin123
      </p>

      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          onClick={() => { setIsLogin(true); setError(""); }}
          className={`px-6 py-2 rounded-full font-semibold ${
            isLogin ? "bg-green-700 text-white shadow-lg" : "bg-white text-green-700 border border-green-700"
=======
      <h1 className="text-3xl font-bold text-green-900 mb-8">Green & Clean</h1>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setIsUser(true)}
          className={`px-6 py-2 rounded-full font-semibold ${
            isUser ? "bg-green-700 text-white shadow-lg" : "bg-white text-green-700 border border-green-700"
          }`}
        >
          User
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setIsLogin(true)}
          className={`px-6 py-2 rounded-full font-semibold ${
            isLogin ? "bg-green-600 text-white" : "bg-white text-green-600 border border-green-600"
>>>>>>> origin/main
          }`}
        >
          Login
        </button>
        <button
<<<<<<< HEAD
          type="button"
          onClick={() => { setIsLogin(false); setError(""); }}
          className={`px-6 py-2 rounded-full font-semibold ${
            !isLogin ? "bg-green-700 text-white shadow-lg" : "bg-white text-green-700 border border-green-700"
          }`}
        >
          Sign up
        </button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Log in to your account" : "Create an account"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
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
                  <Label>I am signing up as</Label>
                  <div className="flex gap-3 mt-1">
                    {(["user", "worker"] as Role[]).map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(r)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border capitalize ${
                          role === r ? "bg-green-700 text-white border-green-700" : "bg-white text-green-700 border-green-700"
                        }`}
                      >
                        {r === "user" ? "Citizen" : "Municipal Worker"}
                      </button>
                    ))}
                  </div>
                  {role === "worker" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Worker accounts need admin approval before you can view assigned tasks.
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <select
                    id="state"
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      const s = states.find((st) => st.name === e.target.value);
                      if (s) setSelectedCity(s.cities[0]);
                    }}
                    className="w-full p-2 mt-1 border rounded"
                  >
                    {states.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <select id="city" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full p-2 mt-1 border rounded">
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" variant="eco" className="w-full" disabled={submitting}>
              {submitting ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
            </Button>
          </form>
        </CardContent>
      </Card>
=======
          onClick={() => setIsLogin(false)}
          className={`px-6 py-2 rounded-full font-semibold ${
            !isLogin ? "bg-green-600 text-white" : "bg-white text-green-600 border border-green-600"
          }`}
        >
          Signup
        </button>
      </div>

      <form
        className="bg-white rounded-lg shadow-md p-8 w-full max-w-md"
        onSubmit={isLogin ? handleLogin : handleSignup}
      >
        {!isLogin && (
          <>
            <div className="mb-4">
              <label className="block text-green-800 font-semibold mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-green-800 font-semibold mb-1" htmlFor="state">
                Select your state
              </label>
              <select
                id="state"
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                {states.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-green-800 font-semibold mb-1" htmlFor="city">
                Select your city
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                {states.find(s => s.name === selectedState).cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-green-800 font-semibold mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your email"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-green-800 font-semibold mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        {isLogin && loginState && (
          <p className="mb-4 text-green-700 font-semibold">
            Registered State: <span className="font-bold">{loginState}</span>, City: <span className="font-bold">{loginCity}</span>
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-800 transition"
        >
          {isLogin ? "Login" : "Sign Up"} as User
        </button>

        <button
          type="button"
          className="mt-4 w-full bg-gray-200 text-green-700 py-3 rounded hover:bg-gray-300 transition font-semibold"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </form>
>>>>>>> origin/main
    </div>
  );
}
