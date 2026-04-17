import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUpdatePassword = async () => {
    if (!password) {
      alert("Enter new password");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert("Error updating password");
      return;
    }

    alert("Password updated successfully!");
    navigate("/");
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          style={input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={button} onClick={handleUpdatePassword}>
          Update Password
        </button>
      </div>
    </div>
  );
}

/* 🎨 styles */

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#f4f6f8",
};

const card = {
  background: "#fff",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
};

const button = {
  width: "100%",
  padding: "10px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};