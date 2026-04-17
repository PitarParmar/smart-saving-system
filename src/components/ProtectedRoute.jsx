import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("email", authData.user.email)
        .single();

      if (userData?.role) {
        setUserRole(userData.role);
      }

      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!isLoggedIn) {
    return <Navigate to="/user-login" />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}