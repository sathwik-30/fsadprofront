import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

import Admin from "./pages/Admin.jsx";
import Donor from "./pages/Donor.jsx";
import Recipient from "./pages/Recipient.jsx";
import Logistics from "./pages/Logistics.jsx";



/*
 route guard
*/

function ProtectedRoute({allowedRole, children}){

 const token = localStorage.getItem("token");

 const role =
  String(localStorage.getItem("role") || "")
  .toLowerCase();


 if(!token){

  return <Navigate to="/" replace />;

 }


 if(role !== allowedRole){

  return <Navigate to="/" replace />;

 }


 return children;

}



/*
 prevent logged users from seeing login page again
*/function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = String(localStorage.getItem("role") || "").toLowerCase();

  if (token) {
    const routeMap = {
      admin: "/admin",
      donor: "/donor",
      recipient: "/recipient",
      logistics: "/logistics"
    };

    const redirectPath = routeMap[role];

    if (redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }

    // 🔥 VERY IMPORTANT fallback
    return <Navigate to="/" replace />;
  }

  return children;
}



function App(){

 return(

  <BrowserRouter>

   <Routes>


    {/* public */}

    <Route

     path="/"

     element={

      <PublicRoute>

       <Login/>

      </PublicRoute>

     }

    />


    <Route

     path="/register"

     element={

      <PublicRoute>

       <Register/>

      </PublicRoute>

     }

    />


    <Route

     path="/forgot"

     element={

      <PublicRoute>

       <ForgotPassword/>

      </PublicRoute>

     }

    />



    {/* dashboards */}

    <Route

     path="/admin"

     element={

      <ProtectedRoute allowedRole="admin">

       <Admin/>

      </ProtectedRoute>

     }

    />


    <Route

     path="/donor"

     element={

      <ProtectedRoute allowedRole="donor">

       <Donor/>

      </ProtectedRoute>

     }

    />


    <Route

     path="/recipient"

     element={

      <ProtectedRoute allowedRole="recipient">

       <Recipient/>

      </ProtectedRoute>

     }

    />


    <Route

     path="/logistics"

     element={

      <ProtectedRoute allowedRole="logistics">

       <Logistics/>

      </ProtectedRoute>

     }

    />



    {/* fallback */}

<Route path="*" element={<Login />} />

   </Routes>

  </BrowserRouter>

 );

}

export default App;