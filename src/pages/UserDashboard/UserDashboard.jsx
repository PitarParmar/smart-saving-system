import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import Navbar from "../../components/Navbar";
import "./UserDashboard.css";

export default function UserDashboard() {
  const [email, setEmail] = useState("");
  const [payments, setPayments] = useState([]);
  const [balance, setBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setEmail(data.user.email);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!email) return;
    fetchPayments(email);
    fetchRequests(email);
  }, [email]);

  const fetchPayments = async (userEmail) => {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("email", userEmail)
      .order("date", { ascending: false });

    const list = data || [];
    setPayments(list);
    calculateBalance(list);
  };

  const fetchRequests = async (userEmail) => {
    const { data } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .eq("email", userEmail)
      .order("date", { ascending: false });

    setRequests(data || []);
  };

  const calculateBalance = (list) => {
    let total = 0;
    list.forEach((p) => {
      total += p.amount + p.late_fee;
    });
    setBalance(total);
  };

  const handlePayment = async () => {
    if (!window.confirm("Are you sure you want to pay ₹2000?")) return;

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const { data: existingPayments } = await supabase
      .from("payments")
      .select("*")
      .eq("email", email);

    const alreadyPaid = existingPayments?.some((p) => {
      const d = new Date(p.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    if (alreadyPaid) {
      alert("Already paid this month");
      return;
    }

    const lateFee = today.getDate() > 15 ? 100 : 0;

    await supabase.from("payments").insert([
      {
        email,
        amount: 2000,
        late_fee: lateFee,
        date: today,
      },
    ]);

    alert("Payment successful");
    fetchPayments(email);
  };

  const handleWithdrawRequest = async () => {
    const today = new Date();

    if (today.getDate() !== 15) {
      alert("Only allowed on 15th");
      return;
    }

    const amount = parseInt(withdrawAmount);
    if (!amount) {
      alert("Enter valid amount");
      return;
    }

    const charge = Math.floor(amount * 0.02);

    await supabase.from("withdrawal_requests").insert([
      {
        email,
        requested_amount: amount,
        charge,
        final_amount: amount - charge,
        status: "pending",
        date: new Date(),
      },
    ]);

    setWithdrawAmount("");
    fetchRequests(email);
  };

  return (
    <div className="app-bg">
      <div className="bg-gradient"></div>
      <div className="bg-noise"></div>

      <Navbar />

      <div className="dashboard">
        <h1 className="title">Your Dashboard</h1>

        <div className="cards">
          <div className="glass-card card">
            <p>Email</p>
            <h3>{email}</h3>
          </div>

          <div className="glass-card card highlight">
            <p>Total Balance</p>
            <h2>₹{balance}</h2>
          </div>
        </div>

        <button className="btn-primary full-btn" onClick={handlePayment}>
          Pay ₹2000
        </button>

        <div className="glass-card section">
          <h3>Payment History</h3>
          {payments.map((p) => (
            <div key={p.id} className="row">
              <span>₹{p.amount}</span>
              <span>₹{p.late_fee}</span>
              <span>{new Date(p.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>

        <div className="glass-card section">
          <h3>Withdraw</h3>

          <input
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />

          <button className="btn-danger full-btn" onClick={handleWithdrawRequest}>
            Send Request
          </button>
        </div>

        <div className="glass-card section">
          <h3>Requests</h3>
          {requests.map((r) => (
            <div key={r.id} className="row">
              <span>₹{r.requested_amount}</span>
              <span className={`status ${r.status}`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}