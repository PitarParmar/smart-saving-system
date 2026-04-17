import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleUser = () => navigate("/user-login");
  const handleAdmin = () => navigate("/admin-login");

  return (
    <div className="home">
      <div className="bg-gradient"></div>
      <div className="bg-noise"></div>

      <div className="container">
        <h1 className="title">Smart Mandal System</h1>

        <p className="subtitle">
          A secure and modern system to manage monthly savings,
          withdrawals, and financial transparency.
        </p>

        <div className="actions">
          <button className="btn primary" onClick={handleUser}>
            Continue as User
          </button>

          <button className="btn secondary" onClick={handleAdmin}>
            Admin Access
          </button>
        </div>
      </div>
    </div>
  );
}