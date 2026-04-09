import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Layout({ children }) {

  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState(null);
  const [name, setName] = useState("");


  useEffect(() => {

    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedName = localStorage.getItem("name");


    /*
     if session missing -> go login
    */

    if (!token || !savedRole) {

      navigate("/");
      return;

    }


    /*
     normalize role
    */

    const normalizedRole =
      String(savedRole).trim().toLowerCase();


    /*
     allowed roles
    */

    const validRoles = [

      "admin",
      "donor",
      "recipient",
      "logistics"

    ];


    if (!validRoles.includes(normalizedRole)) {

      localStorage.clear();

      navigate("/");

      return;

    }


    setRole(normalizedRole);

    setName(savedName || "User");


  }, [location.pathname]);



  /*
   logout
  */

  const logout = () => {

    localStorage.clear();

    navigate("/");

  };



  /*
   nav button style
  */

  const linkStyle = (path) =>

    `px-3 py-2 rounded-lg font-medium transition ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-slate-200 hover:bg-white/10 hover:text-white"
    }`;



  /*
   prevent blank screen
  */

  if (!role) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">

        Checking session...

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e3a8a]">

      {/* header */}

      <header className="sticky top-0 z-30 border-b border-white/20 bg-slate-900/80 backdrop-blur">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

          
          {/* title */}

          <div>

            <h1 className="text-2xl font-bold text-white">

              Donation Connect

            </h1>

            <p className="text-sm text-slate-300">

              {name} ({role})

            </p>

          </div>



          {/* navigation */}

          <div className="flex gap-2 flex-wrap">

            {role === "admin" && (

              <Link to="/admin" className={linkStyle("/admin")}>

                Admin

              </Link>

            )}



            {role === "donor" && (

              <Link to="/donor" className={linkStyle("/donor")}>

                Donor

              </Link>

            )}



            {role === "recipient" && (

              <Link to="/recipient" className={linkStyle("/recipient")}>

                Recipient

              </Link>

            )}



            {role === "logistics" && (

              <Link to="/logistics" className={linkStyle("/logistics")}>

                Logistics

              </Link>

            )}



            <button

              onClick={logout}

              className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"

            >

              Logout

            </button>

          </div>

        </div>

      </header>



      {/* page content */}

      <main className="max-w-7xl mx-auto px-4 py-8">

        {children}

      </main>

    </div>

  );

}

export default Layout;