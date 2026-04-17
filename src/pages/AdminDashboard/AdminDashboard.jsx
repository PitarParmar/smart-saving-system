import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import Navbar from "../../components/Navbar";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    fetchUsers();
    fetchPayments();
    fetchRequests();
  }, []);

  useEffect(() => {
    calculateBalance();
  }, [payments, requests]);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("role", "user");

    setUsers(data || []);
  };

  const fetchPayments = async () => {
    const { data } = await supabase.from("payments").select("*");
    setPayments(data || []);
  };

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .order("date", { ascending: false });

    setRequests(data || []);
  };

  const calculateBalance = () => {
    let total = 0;

    payments.forEach((p) => {
      total += p.amount + p.late_fee;
    });

    requests.forEach((r) => {
      if (r.status === "approved") {
        total -= r.final_amount;
      }
    });

    setTotalBalance(total);
  };

  const getStatus = (email) => {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const userPayment = payments.find((p) => {
      const d = new Date(p.date);
      return (
        p.email === email &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });

    if (!userPayment) return "Not Paid";
    if (userPayment.late_fee > 0) return "Late";
    return "Paid";
  };

  const updateRequestStatus = async (id, status) => {
    await supabase
      .from("withdrawal_requests")
      .update({ status })
      .eq("id", id);

    fetchRequests();
  };

  const pending = requests.filter((r) => r.status === "pending");
  const history = requests.filter((r) => r.status !== "pending");

  return (
    <div className="admin-bg">
      <div className="bg-gradient"></div>
      <div className="bg-noise"></div>

      <Navbar />

      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="admin-cards">
          <div className="admin-card">
            <p>Total Members</p>
            <h2>{users.length}</h2>
          </div>

          <div className="admin-card highlight">
            <p>Total Balance</p>
            <h2>₹{totalBalance}</h2>
          </div>
        </div>

        {/* MEMBER STATUS */}
        <div className="admin-section">
          <h3>Member Status</h3>

          <div className="table members">
            <div className="table-header">
              <span>Name</span>
              <span>Email</span>
              <span>Status</span>
            </div>

            {users.map((u) => {
              const status = getStatus(u.email);

              return (
                <div className="table-row" key={u.id}>
                  <span>{u.name}</span>
                  <span>{u.email}</span>
                  <span className={`status ${status.toLowerCase()}`}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PENDING */}
        <div className="admin-section">
          <h3>Pending Requests</h3>

          {pending.length === 0 ? (
            <p className="empty">No pending requests</p>
          ) : (
            <div className="table pending-table">
              <div className="table-header">
                <span>Email</span>
                <span>Amount</span>
                <span>Action</span>
              </div>

              {pending.map((r) => (
                <div className="table-row" key={r.id}>
                  <span>{r.email}</span>
                  <span>₹{r.requested_amount}</span>

                  <span className="actions">
                    <button
                      className="btn-primary"
                      onClick={() =>
                        updateRequestStatus(r.id, "approved")
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="btn-danger"
                      onClick={() =>
                        updateRequestStatus(r.id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HISTORY */}
        <div className="admin-section">
          <h3>Request History</h3>

          <div className="table history-table">
            <div className="table-header">
              <span>Email</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            {history.map((r) => (
              <div className="table-row" key={r.id}>
                <span>{r.email}</span>
                <span>₹{r.requested_amount}</span>
                <span className={`status ${r.status}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}