import Card from "@mui/material/Card";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../../context/auth-context";
import { useNavigate } from "react-router";
import { Circle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // State
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const demoCredentials = [
    { email: "admin@entnt.in", password: "admin123", role: "Admin" },
    { email: "staff@entnt.in", password: "staff123", role: "Staff" },
    { email: "customer@entnt.in", password: "cust123", role: "Customer" },
  ];

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      login(email, password);

      setLoading(false);
      navigate(
        email === "admin@entnt.in" || email === "staff@entnt.in"
          ? "/dashboard"
          : "/my-rentals"
      );
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Card className="px-8 py-10">
        <h1 className="text-2xl font-bold">Login</h1>
        <h2 className="text-md text-gray-500 font-semibold">
          Enter your credentials to access the dashboard
        </h2>
        <form className="mt-4 flex flex-col gap-4" onSubmit={handleLogin}>
          <TextField
            required
            id="outlined-required"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required
            type="password"
            id="outlined-required"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? <Circle className="animate-spin" /> : "Login"}
          </Button>
        </form>
      </Card>
      <div className="mt-4">
        <Card className="px-10 py-4 w-full">
          <h1 className="text-xl">Demo Credentials</h1>
          <h2 className="text-md text-gray-500 font-semibold">
            Demo credentials to access the dashboard
          </h2>
          <div className="mt-4">
            {demoCredentials.map((cred, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setEmail(cred.email);
                  setPassword(cred.password);
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{cred.role}</p>
                    <p className="text-xs text-gray-600">{cred.email}</p>
                  </div>
                  <Button variant="outlined" size="small">
                    Use
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
