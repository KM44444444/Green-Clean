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
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center font-sans p-8">
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
          }`}
        >
          Login
        </button>
        <button
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
    </div>
  );
}
