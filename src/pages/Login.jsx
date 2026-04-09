import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [showLogin, setShowLogin] = useState(false);

  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userCaptcha, setUserCaptcha] = useState("");

  const [loading,setLoading] = useState(false);


  function generateCaptcha() {

    return Math.random()
      .toString(36)
      .substring(2, 7);

  }


  function refreshCaptcha() {

    setCaptcha(generateCaptcha());

  }



  const handleLogin = async () => {

    if (!email.trim() || !pass || !selectedRole) {

      alert("Enter email, password and role");
      return;

    }


    if (userCaptcha !== captcha) {

      alert("Captcha incorrect");
      refreshCaptcha();
      setUserCaptcha("");
      return;

    }


    try {

      setLoading(true);

      const res = await fetch(

        "http://localhost:5000/api/auth/login",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            email: email.trim().toLowerCase(),

            password: pass,

            role: selectedRole.trim().toLowerCase()

          })

        }

      );


      const data = await res.json();


      if (!res.ok) {

        alert(data.message);

        refreshCaptcha();
        setUserCaptcha("");
        setLoading(false);

        return;

      }


      /*
       normalize role
      */

      const role =
        String(data.role)
        .trim()
        .toLowerCase();



      /*
       store session
      */

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", data.name);



      setShowLogin(false);



      /*
       role routing
      */

      const routeMap = {

        admin: "/admin",

        donor: "/donor",

        recipient: "/recipient",

        logistics: "/logistics"

      };


      const route = routeMap[role];


      if (route) {

        navigate(route);

      }

      else {

        alert("Role mapping error");

      }

    }

    catch (err) {

      console.log(err);

      alert("Server error");

    }

    finally{

      setLoading(false);

    }

  };



  return (

    <div className="relative min-h-screen overflow-hidden">


      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />


      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#1e293b]/85 to-[#1e3a8a]/90" />


      {/* header buttons */}

      <div className="absolute right-8 top-6 z-20 flex gap-3">

        <button
          onClick={()=>setShowLogin(true)}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white"
        >
          Sign In
        </button>


        <Link
          to="/register"
          className="rounded-lg border px-5 py-2 text-white"
        >
          Register
        </Link>

      </div>



      {/* landing */}

      <div className="relative z-10 flex h-screen items-center px-20 text-white">

        <div>

          <h1 className="text-5xl font-bold mb-4">

            Every donation creates impact

          </h1>


          <p className="mb-6 text-gray-300">

            Connect donors, recipients and logistics in one platform.

          </p>


          <div className="flex gap-4">

            <button
              onClick={()=>setShowLogin(true)}
              className="bg-blue-600 px-6 py-3 rounded-lg"
            >
              Donate Now
            </button>


            <button
              onClick={()=>setShowLogin(true)}
              className="border px-6 py-3 rounded-lg"
            >
              Request Support
            </button>

          </div>

        </div>

      </div>



      {/* login popup */}

      {showLogin && (

        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-md rounded-2xl bg-white p-8">

            <h2 className="mb-6 text-center text-2xl font-bold">

              Login

            </h2>


            <input
              className="mb-4 w-full border p-3"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />


            <input
              type="password"
              className="mb-4 w-full border p-3"
              placeholder="Password"
              value={pass}
              onChange={(e)=>setPass(e.target.value)}
            />


            <select
              className="mb-4 w-full border p-3"
              value={selectedRole}
              onChange={(e)=>setSelectedRole(e.target.value)}
            >

              <option value="">Select Role</option>

              <option value="admin">Admin</option>
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
              <option value="logistics">Logistics</option>

            </select>


            <div className="mb-3 flex justify-between items-center">

              <div className="bg-gray-200 px-4 py-2 font-bold tracking-widest">

                {captcha}

              </div>


              <button
                onClick={refreshCaptcha}
                className="text-blue-600 text-sm"
              >
                refresh
              </button>

            </div>


            <input
              className="mb-4 w-full border p-3"
              placeholder="Enter Captcha"
              value={userCaptcha}
              onChange={(e)=>setUserCaptcha(e.target.value)}
            />


            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 p-3 text-white hover:bg-blue-700"
            >
              {loading ? "Logging in..." : "Login"}
            </button>


            <div className="mt-4 flex justify-between text-sm">

              <Link to="/register" className="text-blue-600">

                Register User

              </Link>


              <Link to="/forgot" className="text-blue-600">

                Forgot Password

              </Link>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default Login;