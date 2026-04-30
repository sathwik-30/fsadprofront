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

  /*
   ✅ SEND OTP
  */
  const sendOtp = async () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.role
    ) {
      alert("Fill all fields");
      return;
    }

    if (form.password.length < 5) {
      alert("Password must be at least 5 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/send-otp`,   // ✅ FIXED (no duplicate path)
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: form.email.trim().toLowerCase()
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      alert(data.message);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  /*
   ✅ VERIFY OTP
  */
  const verifyOtp = async () => {
    if (!otp.trim()) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/verify-otp`,   // ✅ FIXED
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            role: form.role.toLowerCase(),
            otp: otp.trim()
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      alert(data.message);

      // reset form
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
      alert(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-96 bg-white p-7 rounded-xl shadow-lg">

        {step === 1 && (
          <>
            <h2 className="text-xl mb-5 font-semibold text-center">
              Register
            </h2>

            <input
              placeholder="Full Name"
              className="border p-2 w-full mb-3 rounded"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              className="border p-2 w-full mb-3 rounded"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full mb-3 rounded"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <select
              className="border p-2 w-full mb-4 rounded"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="">Select Role</option>
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
              <option value="logistics">Logistics</option>
            </select>

            <button
              onClick={sendOtp}
              disabled={loading}
              className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="mb-4 text-center font-semibold">
              Enter OTP
            </h2>

            <input
              className="border p-2 w-full mb-4 rounded"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="bg-green-600 text-white w-full p-2 rounded hover:bg-green-700"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Register;