import { useState } from "react";
import API_BASE_URL from "../config/apiConfig";

function Register() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email.toLowerCase()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed");
      }

      alert(data.message);
      setStep(2);

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          email: form.email.toLowerCase(),
          role: form.role.toLowerCase(),
          otp
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed");
      }

      alert(data.message);

      setStep(1);
      setForm({
        name: "",
        email: "",
        password: "",
        role: ""
      });
      setOtp("");

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="w-96 bg-white p-6 rounded">

        {step === 1 && (
          <>
            <h2 className="text-center mb-4">Register</h2>

            <input placeholder="Name" className="w-full mb-2 border p-2"
              value={form.name}
              onChange={(e)=>setForm({...form,name:e.target.value})}
            />

            <input placeholder="Email" className="w-full mb-2 border p-2"
              value={form.email}
              onChange={(e)=>setForm({...form,email:e.target.value})}
            />

            <input type="password" placeholder="Password"
              className="w-full mb-2 border p-2"
              value={form.password}
              onChange={(e)=>setForm({...form,password:e.target.value})}
            />

            <select className="w-full mb-3 border p-2"
              value={form.role}
              onChange={(e)=>setForm({...form,role:e.target.value})}
            >
              <option value="">Select</option>
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
              <option value="logistics">Logistics</option>
            </select>

            <button onClick={sendOtp}
              className="w-full bg-blue-600 text-white p-2">
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-center mb-4">Enter OTP</h2>

            <input className="w-full mb-3 border p-2"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
            />

            <button onClick={verifyOtp}
              className="w-full bg-green-600 text-white p-2">
              Verify OTP
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Register;