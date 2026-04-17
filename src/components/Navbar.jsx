import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setEmail(data.user.email);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    if (!window.confirm("Do you want to logout?")) return;

    await supabase.auth.signOut();
    alert("Successfully logged out");
    navigate("/");
  };

  return (
    <div style={wrapper}>
      <div style={bgLayer}></div>

      <div style={navbar}>
        <h2 style={logo}>Smart Mandal</h2>

        <button
          style={logoutBtn}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow =
              "0 12px 30px rgba(220,38,38,0.45)";
            e.target.style.background = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
            e.target.style.background = "#dc2626";
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

/* 🔥 WRAPPER */
const wrapper = {
  position: "sticky",
  top: 0,
  zIndex: 100,
};

/* 🔥 BACKGROUND FIX */
const bgLayer = {
  position: "absolute",
  inset: 0,
  background: "#0b1220",
  zIndex: -1,
};

/* 🔥 NAVBAR */
const navbar = {
  height: "72px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 40px",

  background: "transparent",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",

  borderBottom: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",

  color: "white",
  fontFamily: "Inter, sans-serif",
};

const logo = {
  margin: 0,
  fontSize: "22px",
  fontWeight: 600,
};

const logoutBtn = {
  padding: "12px 20px",
  borderRadius: "12px",
  border: "none",
  background: "#dc2626",
  color: "white",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.25s ease",
};