import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login({ type }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
      return;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("email", email)
      .single();

    if (!userData?.role) {
      alert("User not found");
      return;
    }

    alert("Login successful");

    navigate(userData.role === "admin" ? "/admin" : "/user");
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Enter email first");
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (!data) {
      alert("Email not registered");
      return;
    }

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://smart-saving-system.vercel.app/reset-password",
    });

    alert("Reset link sent");
  };

  return (
    <div className="login-page">
      <div className="bg-gradient"></div>
      <div className="bg-noise"></div>

      <div className="login-container">
        <div className="login-box">
          <h2>{type === "admin" ? "Admin Login" : "User Login"}</h2>

          <p>Access your account securely</p>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Sign In</button>

          <span onClick={handleForgotPassword}>
            Forgot Password?
          </span>
        </div>
      </div>
    </div>
  );
}