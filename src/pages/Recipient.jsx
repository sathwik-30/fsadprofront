import { useEffect,useState } from "react";
import Layout from "../components/Layout";
import API_BASE_URL from "../config/apiConfig";

function Recipient(){

 const [item,setItem] = useState("");
 const [qty,setQty] = useState("");

 const [donations,setDonations] = useState([]);
 const [requests,setRequests] = useState([]);



/*
 load approved donations
*/

 const loadDonations = async()=>{

  try{

   const res = await fetch(

    `${API_BASE_URL}/api/donation/approved`,

    {

     headers:{
      Authorization: localStorage.getItem("token")
     }

    }

   );

   setDonations(await res.json());

  }
  catch(err){

   console.log(err);

  }

 };



/*
 load my requests
*/

 const loadRequests = async()=>{

  try{

   const res = await fetch(

    `${API_BASE_URL}/api/request/mine`,

    {

     headers:{
      Authorization: localStorage.getItem("token")
     }

    }

   );

   setRequests(await res.json());

  }
  catch(err){

   console.log(err);

  }

 };



 useEffect(()=>{

  loadDonations();
  loadRequests();

 },[]);



/*
 create request
*/

 const createRequest = async()=>{

  if(!item || !qty){

   alert("Enter item and quantity");
   return;

  }

  try{

   await fetch(

    `${API_BASE_URL}/api/request/add`,

    {

     method:"POST",

     headers:{

      "Content-Type":"application/json",

      Authorization: localStorage.getItem("token")

     },

     body: JSON.stringify({

      item,
      quantity: qty

     })

    }

   );


   alert("Request submitted for approval");

   setItem("");
   setQty("");

   loadRequests();

  }
  catch(err){

   console.log(err);

  }

 };



/*
 status color
*/

 const statusColor = status =>{

  if(status==="pending") return "bg-yellow-500 text-black";

  if(status==="approved") return "bg-blue-500 text-white";

  if(status==="fulfilled") return "bg-green-600 text-white";

  return "bg-gray-500 text-white";

 };



return(

<Layout>

<h1 className="text-3xl font-bold mb-8 
bg-gradient-to-r from-purple-400 to-pink-500 
text-transparent bg-clip-text">

 Recipient Dashboard

</h1>



{/* create request */}

<div className="mb-10 p-6 rounded-xl 
bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400">

<h2 className="mb-4 text-xl text-purple-300">

 Request Items

</h2>


<div className="flex gap-4 flex-wrap">

<input

placeholder="Item"

value={item}

onChange={e=>setItem(e.target.value)}

className="p-2 rounded bg-slate-900 text-white border border-purple-400"

/>


<input

type="number"

placeholder="Qty"

value={qty}

onChange={e=>setQty(e.target.value)}

className="p-2 rounded bg-slate-900 text-white border border-purple-400"

/>


<button

onClick={createRequest}

className="px-5 py-2 rounded 
bg-gradient-to-r from-purple-500 to-pink-600 
text-white font-semibold hover:scale-105 transition"

>

Submit Request

</button>

</div>

</div>



{/* my requests */}

<div className="mb-10 p-6 rounded-xl 
bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400">

<h2 className="mb-4 text-xl text-yellow-300">

 My Requests

</h2>


{

requests.length===0 &&

<p className="text-gray-300">

No requests yet

</p>

}


{

requests.map(r=>(

<div

key={r.id}

className="flex justify-between items-center 
border-b border-white/10 py-3"

>

<div>

<p className="text-white">

{r.item}

</p>

<p className="text-gray-300">

Qty {r.quantity}

</p>

</div>


<span

className={`${statusColor(r.status)} px-3 py-1 rounded font-semibold`}

>

{r.status}

</span>

</div>

))

}

</div>



{/* available donations */}

<div className="p-6 rounded-xl 
bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400">

<h2 className="mb-4 text-xl text-cyan-300">

 Available Donations

</h2>


{

donations.length===0 &&

<p className="text-gray-300">

No approved donations yet

</p>

}


{

donations.map(d=>(

<div

key={d.id}

className="flex justify-between items-center 
border-b border-white/10 py-3"

>

<div>

<p className="text-white">

{d.item}

</p>

<p className="text-gray-300">

Qty {d.quantity}

</p>

</div>


<span className="px-3 py-1 rounded bg-blue-600 text-white text-sm">

{d.status}

</span>

</div>

))

}

</div>



</Layout>

);

}

export default Recipient;