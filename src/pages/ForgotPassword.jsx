import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";

function ForgotPassword(){

 const navigate = useNavigate();

 const [step,setStep] = useState(1);

 const [email,setEmail] = useState("");
 const [otp,setOtp] = useState("");
 const [password,setPassword] = useState("");

 const [loading,setLoading] = useState(false);



/*
 SEND RESET OTP
*/

 const sendOtp = async ()=>{

  if(!email.trim()){

   alert("Enter email");
   return;

  }

  try{

   setLoading(true);

   const res = await fetch(

    `${API_BASE_URL}/api/auth/send-reset-otp`,

    {

     method:"POST",

     headers:{
      "Content-Type":"application/json"
     },

     body: JSON.stringify({

      email: email.trim().toLowerCase()

     })

    }

   );


   const data = await res.json();

   alert(data.message);


   if(res.ok){

    setStep(2);

   }

  }
  catch(err){

   console.log(err);

   alert("Server error");

  }
  finally{

   setLoading(false);

  }

 };



/*
 RESEND OTP
*/

 const resendOtp = async ()=>{

  try{

   setLoading(true);

   const res = await fetch(

    `${API_BASE_URL}/api/auth/resend-reset-otp`,

    {

     method:"POST",

     headers:{
      "Content-Type":"application/json"
     },

     body: JSON.stringify({

      email: email.trim().toLowerCase()

     })

    }

   );


   const data = await res.json();

   alert(data.message);

  }
  catch(err){

   console.log(err);

  }
  finally{

   setLoading(false);

  }

 };



/*
 RESET PASSWORD
*/

 const resetPassword = async ()=>{

  if(!otp.trim() || !password.trim()){

   alert("Fill all fields");
   return;

  }


  if(password.length < 5){

   alert("Password must be at least 5 characters");
   return;

  }


  try{

   setLoading(true);

   const res = await fetch(

    `${API_BASE_URL}/api/auth/reset-password`,

    {

     method:"POST",

     headers:{
      "Content-Type":"application/json"
     },

     body: JSON.stringify({

      email: email.trim().toLowerCase(),

      otp: otp.trim(),

      password

     })

    }

   );


   const data = await res.json();

   alert(data.message);


   if(res.ok){

    navigate("/");

   }

  }
  catch(err){

   console.log(err);

   alert("Server error");

  }
  finally{

   setLoading(false);

  }

 };



return(

<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

<div className="w-96 rounded-xl bg-white p-8 shadow-lg">


{step===1 && (

<>

<h2 className="mb-6 text-xl font-bold text-center">

Forgot Password

</h2>


<input

className="mb-4 w-full border p-3 rounded-lg"

placeholder="Enter your email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>


<button

onClick={sendOtp}

disabled={loading}

className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 transition"

>

{loading ? "Sending..." : "Send OTP"}

</button>

</>

)}



{step===2 && (

<>

<h2 className="mb-6 text-xl font-bold text-center">

Reset Password

</h2>


<input

className="mb-3 w-full border p-3 rounded-lg"

placeholder="Enter OTP"

value={otp}

onChange={(e)=>setOtp(e.target.value)}

/>


<input

type="password"

className="mb-4 w-full border p-3 rounded-lg"

placeholder="New password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>


<button

onClick={resetPassword}

disabled={loading}

className="w-full rounded-lg bg-green-600 p-3 text-white mb-2 hover:bg-green-700 transition"

>

{loading ? "Updating..." : "Update Password"}

</button>


<button

onClick={resendOtp}

disabled={loading}

className="w-full rounded-lg bg-gray-500 p-3 text-white hover:bg-gray-600 transition"

>

Resend OTP

</button>

</>

)}


</div>

</div>

);

}

export default ForgotPassword;